import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Maximize2, 
  Trash2, 
  Calendar, 
  Zap, 
  X,
  Image as ImageIcon,
  User,
  Eye,
  Settings,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Gallery = () => {
    const [photos, setPhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user: currentUser, loading: authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading) {
            fetchPhotos();
        }
    }, [authLoading]);

    const fetchPhotos = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const res = await axios.get('http://127.0.0.1:8000/api/photos/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setPhotos(res.data);
        } catch (err) {
            console.error("Gallery sync error", err);
            if (err.response?.status === 401) {
                toast.error("Session Expired. Please Login.");
            } else {
                toast.error("Gallery sync failed");
            }
        } finally {
            setLoading(false);
        }
    };

    const deletePhoto = async (id) => {
        if (!window.confirm("Delete this photo forever?")) return;
        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(`http://127.0.0.1:8000/api/photos/${id}/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setPhotos(photos.filter(p => p.id !== id));
            toast.success("Photo Deleted");
        } catch (err) {
            toast.error("Delete Failed");
        }
    };

    const downloadImage = async (url, id) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `photo-id-${id}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            toast.success("Photo Saved Locally");
        } catch (err) {
            console.error("Download failed", err);
            // Fallback to simple link click if fetch fails
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.download = `photo-id-${id}.png`;
            link.click();
        }
    };

    if (loading) return (
        <div className="pt-32 flex justify-center items-center h-[50vh]">
            <div className="w-12 h-12 border-4 border-brand-neon-purple border-t-transparent rounded-full animate-spin shadow-[0_0_20px_#bc13fe44]" />
        </div>
    );

    return (
        <div className="pt-24 px-6 min-h-screen pb-20 overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="relative">
                        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-2">
                            Your <span className="text-brand-neon-purple drop-shadow-[0_0_15px_#bc13fe66]">Gallery</span>
                        </h1>
                        <p className="text-gray-600 font-mono text-[10px] uppercase tracking-[0.4em] leading-none pl-1">Photo Archive // Saved Moments</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-md">
                        <Zap className="w-4 h-4 text-brand-neon-blue" />
                        <span className="text-[10px] font-black uppercase tracking-wider tabular-nums">{photos.length} Photos Saved</span>
                    </div>
                </div>

                {photos.length === 0 ? (
                    <div className="aspect-video glass rounded-[3rem] flex flex-col items-center justify-center border-dashed border-2 border-white/10 group">
                        <div className="bg-white/5 p-8 rounded-full mb-6 group-hover:scale-110 transition-transform duration-500">
                             <ImageIcon className="w-16 h-16 text-gray-800" />
                        </div>
                        <p className="text-gray-600 uppercase font-black text-xs tracking-[0.3em]">Gallery Empty // Take some photos!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {photos.map((photo, i) => (
                            <motion.div 
                                key={photo.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="group relative aspect-[4/5] glass rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-brand-neon-purple/50 transition-all duration-700 shadow-3xl bg-neutral-900/40"
                            >
                                <img 
                                    src={photo.image} 
                                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1" 
                                    alt="Moment"
                                />
                                
                                <div className="absolute top-6 left-6 right-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl p-2.5 rounded-2xl border border-white/10">
                                        <div className="w-8 h-8 rounded-xl bg-brand-neon-purple flex items-center justify-center text-white font-black text-[10px] shadow-lg">
                                            {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div className="flex flex-col pr-2">
                                            <span className="text-[10px] font-black text-white">@{currentUser?.username || 'user'}</span>
                                            <span className="text-[7px] font-mono text-gray-400 uppercase tracking-widest leading-none">{photo.filter_used || 'Raw'}</span>
                                        </div>
                                    </div>
                                    <div className="p-2.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl">
                                        <ShieldCheck className="w-4 h-4 text-brand-neon-blue" />
                                    </div>
                                </div>

                                <div className="absolute bottom-6 left-6 right-6 flex gap-3 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                    <div className="flex-grow grid grid-cols-2 gap-2 bg-black/70 backdrop-blur-2xl border border-white/15 rounded-[1.5rem] p-2 shadow-2xl">
                                        <button 
                                            onClick={() => setSelectedPhoto(photo)}
                                            className="h-12 rounded-xl bg-white/5 hover:bg-brand-neon-blue/20 hover:text-brand-neon-blue transition-all flex items-center justify-center gap-2 text-[9px] font-black uppercase text-white/70"
                                        >
                                            <Maximize2 className="w-3.5 h-3.5" /> View
                                        </button>
                                        <button 
                                            onClick={() => downloadImage(photo.image, photo.id)}
                                            className="h-12 rounded-xl bg-white/5 hover:bg-brand-neon-purple/20 hover:text-brand-neon-purple transition-all flex items-center justify-center gap-2 text-[9px] font-black uppercase text-white/70"
                                        >
                                            <Download className="w-3.5 h-3.5" /> Save
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => deletePhoto(photo.id)}
                                        className="w-16 h-16 rounded-2xl bg-black/70 backdrop-blur-2xl border border-white/15 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all group/trash"
                                    >
                                        <Trash2 className="w-5 h-5 group-hover/trash:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedPhoto && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/98 backdrop-blur-[50px]"
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <button className="absolute top-10 right-10 w-16 h-16 rounded-full glass border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all z-[210]">
                            <X className="w-6 h-6" />
                        </button>
                        
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="relative max-w-7xl w-full aspect-video rounded-[3rem] overflow-hidden border border-white/15 shadow-[0_0_150px_rgba(0,0,0,1)] bg-black"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img src={selectedPhoto.image} className="w-full h-full object-contain" alt="Gallery View" />
                            <div className="absolute bottom-10 left-10 p-10 glass rounded-[2.5rem] border border-white/20 max-w-sm backdrop-blur-3xl shadow-3xl">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-14 h-14 rounded-2xl bg-brand-neon-purple flex items-center justify-center text-white shadow-[0_0_40px_#bc13fe33]">
                                        <Zap className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Full <span className="text-brand-neon-blue">Photo</span></h2>
                                        <p className="text-[10px] font-mono text-gray-500">Photo ID: {selectedPhoto.id}</p>
                                    </div>
                                </div>
                                <button onClick={() => downloadImage(selectedPhoto.image, selectedPhoto.id)} className="w-full py-5 bg-brand-neon-purple hover:bg-brand-neon-pink rounded-2xl font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-4 text-white shadow-2xl transition-all active:scale-95 group">
                                    <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                                    Download Photo
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
