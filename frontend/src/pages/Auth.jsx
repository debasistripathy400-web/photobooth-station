import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Mail, ArrowRight, ShieldCheck, Hexagon, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Auth = ({ mode = 'login' }) => {
    const isLogin = mode === 'login';
    const [formData, setFormData] = useState({ 
        username: '', 
        email: '', 
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                // LOGIN FLOW
                const result = await login(formData.username, formData.password);
                if (result.success) {
                    toast.success("Identity Verified: Sync Active");
                    navigate('/booth');
                } else {
                    setError(result.error);
                    toast.error("Invalid Master Key");
                }
            } else {
                // REGISTER FLOW
                const result = await register(formData.username, formData.email, formData.password);
                if (result.success) {
                    toast.success("Identity Created & Linked");
                    navigate('/booth');
                } else {
                    setError(result.error);
                    toast.error(result.error);
                }
            }
        } catch (err) {
            setError("Critical Link Error. System Overloaded.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-36 flex items-center justify-center p-6 selection:bg-brand-neon-blue/30 overflow-x-hidden min-h-screen">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="absolute top-0 right-[-20%] w-[300px] h-[300px] bg-brand-neon-purple/5 blur-[120px] rounded-full pointer-events-none -z-10" />
                <div className="absolute bottom-0 left-[-20%] w-[300px] h-[300px] bg-brand-neon-blue/5 blur-[120px] rounded-full pointer-events-none -z-10" />

                <div className="flex flex-col items-center mb-10">
                    <motion.div 
                        initial={{ rotate: -15, scale: 0.8 }}
                        animate={{ rotate: 12, scale: 1 }}
                        className="w-16 h-16 bg-brand-neon-purple p-4 rounded-[1.5rem] mb-6 shadow-[0_0_40px_rgba(188,19,254,0.3)] flex items-center justify-center"
                    >
                        <Hexagon className="w-8 h-8 text-white fill-white/20" />
                    </motion.div>
                    <h1 className="text-4xl font-black italic tracking-tighter mb-2 text-white">
                        {isLogin ? 'IDENTITY_LINK' : 'BIOMETRIC_INIT'}
                    </h1>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] opacity-80">
                        {isLogin ? 'Sync_With_Universal_Feed' : 'Create_New_Neural_Handle'}
                    </p>
                </div>

                <div className="glass rounded-[3rem] p-10 border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden">
                    <AnimatePresence>
                        {error && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6">
                                <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black tracking-widest uppercase text-gray-500 ml-4">Neural Handle</label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-brand-neon-blue transition-all">
                                    <User className="w-4 h-4" />
                                </div>
                                <input required type="text" placeholder="Identity Handle" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4.5 pl-14 pr-6 text-sm font-bold placeholder:text-gray-700 focus:outline-none focus:border-brand-neon-blue/40 focus:bg-white/[0.08] transition-all" />
                            </div>
                        </div>

                        {!isLogin && (
                            <div className="space-y-1">
                                <label className="text-[10px] font-black tracking-widest uppercase text-gray-500 ml-4">Email Channel</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-brand-neon-blue transition-all">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <input required type="email" placeholder="system@link.ai" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4.5 pl-14 pr-6 text-sm font-bold placeholder:text-gray-700 focus:outline-none focus:border-brand-neon-blue/40 focus:bg-white/[0.08] transition-all" />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-[10px] font-black tracking-widest uppercase text-gray-500 ml-4">Master Key</label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-brand-neon-purple transition-all">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input required type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4.5 pl-14 pr-6 text-sm font-bold focus:outline-none focus:border-brand-neon-purple/40 focus:bg-white/[0.08] transition-all" />
                            </div>
                        </div>

                        <button disabled={loading} type="submit" className="w-full py-5 rounded-2xl bg-brand-neon-purple text-white font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all hover:bg-brand-neon-pink shadow-[0_0_30px_rgba(188,19,254,0.3)] hover:shadow-[0_0_40px_rgba(188,19,254,0.5)] active:scale-95 disabled:opacity-50 mt-4">
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{isLogin ? 'Initialize Link' : 'Secure Core'} <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>

                    <div className="mt-8 flex items-center justify-between text-[11px] font-black tracking-widest uppercase text-gray-600 pt-8 border-t border-white/5">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-brand-neon-blue" />
                            <span>Encrypted</span>
                        </div>
                        <Link to={isLogin ? '/register' : '/login'} className="text-white hover:text-brand-neon-blue transition-colors border-b-2 border-brand-neon-blue pb-0.5">
                            {isLogin ? 'NEW_ID' : 'IDENTITY_LINK'}
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
