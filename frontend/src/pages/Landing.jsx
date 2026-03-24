import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Sparkles, Share2, Layers, ArrowRight, Zap, Target, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="relative overflow-hidden pt-36 pb-24 px-6">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-neon-purple/30 bg-brand-neon-purple/5 mb-6">
                        <Zap className="w-3 h-3 text-brand-neon-blue fill-brand-neon-blue" />
                        <span className="text-[10px] font-bold tracking-widest uppercase text-brand-neon-blue">Next-Gen AI Experience</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
                        AI <span className="neon-text-purple">PHOTO</span><br />
                        <span className="neon-text-blue italic">STATION.</span>
                    </h1>

                    <p className="text-lg text-gray-400 mb-10 max-w-lg leading-relaxed font-medium">
                        Elevate your snapshots with real-time AI face tracking, 
                        dynamic filters, and immersive glassmorphism aesthetics. 
                        State-of-the-art photobooth technology in your browser.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link to="/booth" className="btn-neon group flex items-center gap-2">
                            Enter Booth <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/gallery" className="px-6 py-3 rounded-full border border-white/10 hover:border-brand-neon-blue transition-colors text-sm font-bold flex items-center gap-2">
                            Browse Gallery <LayoutGrid className="w-4 h-4 opacity-50" />
                        </Link>
                    </div>

                    <div className="mt-16 flex items-center gap-12 opacity-40">
                        <div className="flex flex-col gap-1">
                            <span className="text-2xl font-black">10K+</span>
                            <span className="text-[10px] uppercase tracking-widest font-bold">Captures</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-2xl font-black">25+</span>
                            <span className="text-[10px] uppercase tracking-widest font-bold">AI Filters</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-2xl font-black">100%</span>
                            <span className="text-[10px] uppercase tracking-widest font-bold">Client-Side</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative"
                >
                    <div className="absolute -inset-10 bg-brand-neon-purple/20 blur-[100px] rounded-full" />
                    <div className="relative glass rounded-[2.5rem] overflow-hidden border border-white/10 p-4 shadow-2xl">
                        <div className="relative aspect-[4/5] bg-neutral-900 rounded-[2rem] overflow-hidden group">
                            <img 
                                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1288&auto=format&fit=crop" 
                                alt="Demo" 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                            
                            <div className="absolute top-6 right-6 glass p-3 border border-brand-neon-blue/20 rounded-2xl group-hover:rotate-12 transition-transform">
                                <Target className="w-6 h-6 text-brand-neon-blue" />
                            </div>

                            <div className="absolute bottom-8 left-8 right-8">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="px-3 py-1 bg-brand-neon-purple rounded-lg text-[10px] font-bold tracking-widest uppercase shadow-lg">CYBER_FILTER_02</div>
                                    <div className="flex -space-x-2">
                                        {[1,2,3].map(i => (
                                            <div key={i} className="w-6 h-6 rounded-full border border-black bg-neutral-800" />
                                        ))}
                                    </div>
                                </div>
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: "80%" }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="h-full bg-brand-neon-blue shadow-[0_0_10px_#00f3ff]" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute -bottom-10 -right-10 glass p-6 border border-white/20 rounded-3xl hidden md:block">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-brand-neon-pink/20 flex items-center justify-center border border-brand-neon-pink/30">
                                <Sparkles className="w-6 h-6 text-brand-neon-pink" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">Face Auto-Lock</h4>
                                <p className="text-[10px] text-gray-400">AI Powered Tracking Active</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Landing;
