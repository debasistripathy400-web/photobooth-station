import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Camera, LayoutGrid, User, LogOut, Hexagon, ChevronDown, Image } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl flex items-center justify-between px-4 sm:px-6 py-3 border border-white/10 shadow-2xl relative">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="bg-brand-neon-purple p-1 sm:p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                <Hexagon className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white/20" />
            </div>
            <span className="text-lg sm:text-xl font-display font-black tracking-tighter text-white">
                PHOTO<span className="text-brand-neon-blue">BOOTH</span>
                <span className="text-brand-neon-pink ml-1 text-[7px] sm:text-[8px] px-1 sm:px-1.5 py-0.5 border border-brand-neon-pink/30 rounded uppercase font-black">STATION</span>
            </span>
        </Link>

        {/* Global Nav */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            <NavLink to="/booth" className={({ isActive }) => `flex items-center gap-2 text-[10px] lg:text-xs font-black uppercase tracking-widest transition-all ${isActive ? 'text-brand-neon-blue drop-shadow-[0_0_8px_#00f3ff]' : 'text-gray-500 hover:text-white'}`}>
              <Camera className="w-3.5 h-3.5" /> <span className="hidden lg:inline">Booth</span>
            </NavLink>
            <NavLink to="/gallery" className={({ isActive }) => `flex items-center gap-2 text-[10px] lg:text-xs font-black uppercase tracking-widest transition-all ${isActive ? 'text-brand-neon-blue drop-shadow-[0_0_8px_#00f3ff]' : 'text-gray-500 hover:text-white'}`}>
              <LayoutGrid className="w-3.5 h-3.5" /> <span className="hidden lg:inline">Gallery</span>
            </NavLink>
          </div>

          <div className="h-6 w-px bg-white/10 hidden md:block" />

          {/* Mobile Links (Mobile Only) */}
          <div className="flex md:hidden items-center gap-2">
            <NavLink to="/booth" className={({ isActive }) => `p-2 rounded-xl transition-all ${isActive ? 'bg-brand-neon-blue/20 text-brand-neon-blue' : 'text-gray-500'}`}>
                <Camera className="w-5 h-5" />
            </NavLink>
            <NavLink to="/gallery" className={({ isActive }) => `p-2 rounded-xl transition-all ${isActive ? 'bg-brand-neon-blue/20 text-brand-neon-blue' : 'text-gray-500'}`}>
                <LayoutGrid className="w-5 h-5" />
            </NavLink>
          </div>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 sm:gap-4 bg-black/40 backdrop-blur-md px-2 sm:px-3 py-1.5 sm:py-2 rounded-2xl border border-white/10 hover:border-white/20 transition-all group"
              >
                <div className="relative">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-brand-neon-blue to-brand-neon-purple p-0.5 group-hover:rotate-6 transition-transform">
                        <div className="w-full h-full rounded-[10px] bg-black flex items-center justify-center">
                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 hidden lg:flex">
                    <span className="text-[11px] font-black text-white tracking-tight uppercase">{user.username}</span>
                    <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-neon-blue' : ''}`} />
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <>
                    <div className="fixed inset-0 z-[190]" onClick={() => setIsOpen(false)} />
                    <motion.div 
                      key="dropdown"
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.98 }}
                      className="absolute right-0 top-full mt-4 w-60 bg-[#0c0c0c] rounded-[2rem] border border-white/10 overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.9)] z-[200] isolate text-left"
                    >
                      {/* Integrated Header */}
                      <div className="px-6 py-5 bg-gradient-to-b from-white/[0.03] to-transparent border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-brand-neon-blue shadow-[0_0_8px_#00f3ff]" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Secure Interface</span>
                        </div>
                      </div>
                      
                      {/* Nav Items */}
                      <div className="p-3 flex flex-col gap-1">
                        <Link 
                            to="/gallery" 
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 text-gray-400 hover:text-white transition-all group border border-transparent hover:border-white/10"
                        >
                            <div className="w-8 h-8 rounded-xl bg-brand-neon-pink/10 flex items-center justify-center text-brand-neon-pink group-hover:scale-110 transition-transform">
                                <Image className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.15em]">Edit Photos</span>
                        </Link>

                        <div className="my-1 h-px bg-white/5" />

                        <button 
                          onClick={() => {logout(); setIsOpen(false);}}
                          className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-all text-left group"
                        >
                            <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20">
                                <LogOut className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.15em]">End Session</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">
                Access
              </Link>
              <Link to="/register" className="btn-neon text-[10px] py-2 px-6">
                Initialize Beta
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
