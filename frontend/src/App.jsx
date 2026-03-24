import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Photobooth from './pages/Photobooth';
import Gallery from './pages/Gallery';
import Auth from './pages/Auth';
import ChangePassword from './pages/ChangePassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" />;
    return children;
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-brand-neon-purple/30 selection:text-white">
                    {/* Background Accents */}
                    <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-neon-purple via-brand-neon-blue to-brand-neon-pink z-50 opacity-40 shadow-[0_0_20px_rgba(188,19,254,0.5)]" />
                    
                    <Navbar />
                    
                    <main className="relative z-10">
                        <Routes>
                            <Route path="/" element={<Landing />} />
                            <Route path="/booth" element={<Photobooth />} />
                            <Route path="/gallery" element={<Gallery />} />
                            <Route path="/login" element={<Auth mode="login" />} />
                            <Route path="/register" element={<Auth mode="register" />} />
                            <Route path="/profile/password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
                        </Routes>
                    </main>

                    {/* Global Blur Blobs */}
                    <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-neon-purple/10 blur-[150px] rounded-full pointer-events-none -z-10" />
                    <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-neon-blue/10 blur-[150px] rounded-full pointer-events-none -z-10" />
                    
                    <ToastContainer 
                        position="bottom-right"
                        theme="dark"
                        toastStyle={{ 
                            background: 'rgba(20,20,20,0.8)', 
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '1.5rem',
                            color: '#fff',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase'
                        }}
                    />
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
