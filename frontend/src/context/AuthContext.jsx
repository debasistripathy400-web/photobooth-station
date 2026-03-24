import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

// Initialize axios with baseURL and credentials if needed
axios.defaults.baseURL = 'http://127.0.0.1:8000';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const setToken = (token) => {
        if (token) {
            localStorage.setItem('access_token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            localStorage.removeItem('access_token');
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    setUser({ id: decoded.user_id, username: decoded.username });
                    setToken(token);
                } else {
                    setToken(null);
                    setUser(null);
                }
            } catch (err) {
                console.error("Session integrity failure", err);
                setToken(null);
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const res = await axios.post('/api/login/', { username, password });
            const { access, refresh } = res.data;
            setToken(access);
            localStorage.setItem('refresh_token', refresh);
            const decoded = jwtDecode(access);
            setUser({ id: decoded.user_id, username: decoded.username });
            return { success: true };
        } catch (err) {
            console.error("Link Authorization failed", err);
            return { success: false, error: err.response?.data?.detail || "Invalid Credentials" };
        }
    };

    const register = async (username, email, password) => {
        try {
            const res = await axios.post('/api/register/', { username, email, password });
            if (res.status === 201 || res.status === 200) {
                // Instantly sync after registration
                return await login(username, password);
            }
            return { success: false, error: "Initialization failed" };
        } catch (err) {
            const errors = err.response?.data;
            let msg = "Neural Record Sync Error";
            if (errors) {
                if (errors.username) msg = "Identity handle already exists.";
                else if (errors.email) msg = "Email channel already linked.";
                else if (errors.password) msg = "Master key incompatible.";
            }
            return { success: false, error: msg };
        }
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
