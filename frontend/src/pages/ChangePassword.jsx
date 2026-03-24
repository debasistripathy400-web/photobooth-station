import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, ShieldCheck, Lock, ArrowRight, Eye, EyeOff, CheckCircle2, ChevronLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.new_password !== formData.confirm_password) {
            return toast.error("New passwords do not match!");
        }

        setLoading(true);
        try {
            await axios.post('/api/users/change_password/', formData);
            toast.success("Security Credentials Updated!");
            setTimeout(() => navigate('/profile'), 1500);
        } catch (err) {
            toast.error(err.response?.data?.error || "Update Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-32 px-6 min-h-screen flex flex-col items-center">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Hub</span>
                </Link>

                <div className="glass rounded-[2.5rem] p-10 border border-white/10 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-neon-purple/20 blur-[60px] rounded-full -mr-16 -mt-16" />
                    
                    <div className="relative">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 rounded-2xl bg-brand-neon-purple/10 flex items-center justify-center text-brand-neon-purple border border-brand-neon-purple/20">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none">Key Access</h1>
                                <p className="text-[10px] font-mono text-gray-500 uppercase mt-1">Identity_Auth_Required</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-4">Current Master Key</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-brand-neon-purple transition-colors" />
                                    <input 
                                        type={showPass ? "text" : "password"} 
                                        required
                                        className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-brand-neon-purple/50 focus:bg-white/[0.08] transition-all"
                                        placeholder="••••••••"
                                        value={formData.old_password}
                                        onChange={(e) => setFormData({...formData, old_password: e.target.value})}
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPass(!showPass)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                                    >
                                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="h-px bg-white/5 mx-4" />

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-4">New Master Key</label>
                                <input 
                                    type={showPass ? "text" : "password"} 
                                    required
                                    className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-sm focus:outline-none focus:border-brand-neon-blue/50 focus:bg-white/[0.08] transition-all"
                                    placeholder="••••••••"
                                    value={formData.new_password}
                                    onChange={(e) => setFormData({...formData, new_password: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-4">Confirm New Key</label>
                                <input 
                                    type={showPass ? "text" : "password"} 
                                    required
                                    className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-sm focus:outline-none focus:border-brand-neon-blue/50 focus:bg-white/[0.08] transition-all"
                                    placeholder="••••••••"
                                    value={formData.confirm_password}
                                    onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full h-16 bg-brand-neon-purple hover:bg-brand-neon-pink disabled:opacity-50 rounded-[1.2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_-5px_#bc13fe] hover:shadow-[0_0_40px_#ff00ff] hover:scale-[1.02]"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Update Credentials
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                        
                        <div className="mt-10 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                            <h3 className="text-[9px] font-black uppercase tracking-wider text-gray-500 mb-3 ml-1">Master Key Requirements</h3>
                            <ul className="space-y-2">
                                {[
                                    'Secure_Length (min 8 chars)',
                                    'Alpha_Numeric Sync',
                                    'Multi_Case Encryption'
                                ].map((req, i) => (
                                    <li key={i} className="flex items-center gap-2 text-[9px] font-bold text-gray-600">
                                        <CheckCircle2 className="w-3 h-3 text-brand-neon-blue" />
                                        {req}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ChangePassword;
