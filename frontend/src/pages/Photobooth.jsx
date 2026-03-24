import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  RotateCcw, 
  Download, 
  Zap,
  Sun,
  Sliders,
  Layers,
  LayoutGrid,
  Columns,
  Rows,
  BoxSelect,
  Cloud,
  Orbit,
  Tv,
  Film,
  Moon,
  Monitor,
  Smile,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  Settings,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const FILTER_TYPES = [
  { id: 'none', name: 'Original', icon: <Camera className="w-4 h-4" />, css: 'none' },
  { id: 'pastel', name: 'Pastel', icon: <Cloud className="w-4 h-4" />, css: 'pastel' },
  { id: 'cyberpunk', name: 'Neon', icon: <Orbit className="w-4 h-4" />, css: 'cyberpunk' },
  { id: 'vintage', name: 'Vintage', icon: <Film className="w-4 h-4" />, css: 'vintage' },
  { id: 'cinematic', name: 'Cinema', icon: <Monitor className="w-4 h-4" />, css: 'cinematic' },
  { id: 'vhs', name: 'VHS', icon: <Tv className="w-4 h-4" />, css: 'vhs' },
  { id: 'golden', name: 'Golden', icon: <Sun className="w-4 h-4" />, css: 'golden' },
  { id: 'night', name: 'Night', icon: <Moon className="w-4 h-4" />, css: 'night' },
  { id: 'toon', name: 'Toon', icon: <Smile className="w-4 h-4" />, css: 'toon' },
  { id: 'glitch', name: 'Glitch', icon: <Zap className="w-4 h-4" />, css: 'glitch' },
];

const FRAME_TYPES = [
    { id: 'none', name: 'None', color: 'transparent' },
    { id: 'neon', name: 'Purple', color: '#bc13fe' },
    { id: 'classic', name: 'Classic', color: '#ffffff' },
    { id: 'cyber', name: 'Blue', color: '#00f3ff' },
];

const Photobooth = () => {
    const webcamRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [collageImages, setCollageImages] = useState([]);
    const [isCollageMode, setIsCollageMode] = useState(false);
    const [collageCount, setCollageCount] = useState(4);
    const [collageLayout, setCollageLayout] = useState('grid');
    const [frameType, setFrameType] = useState('none');
    
    const [filter, setFilter] = useState('none');
    const [intensity, setIntensity] = useState(100);
    const [isMirrored, setIsMirrored] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [isCapturing, setIsCapturing] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user } = useAuth();

    const videoConstraints = { width: 1280, height: 720, facingMode: "user" };

    const startCapture = () => {
        setIsCapturing(true);
        setCountdown(3);
    };

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0 && isCapturing) {
            capture();
        }
    }, [countdown, isCapturing]);

    const getFilterCSS = () => {
        const found = FILTER_TYPES.find(f => f.id === filter);
        if (!found || filter === 'none') return 'none';
        if (['pastel', 'cyberpunk', 'vhs', 'golden', 'night', 'toon', 'glitch'].includes(filter)) return 'none';
        if (filter === 'cinematic') {
            const bri = 80 + (20 - (intensity / 100 * 20)); 
            const con = 100 + (intensity / 100 * 40); 
            return `brightness(${bri}%) contrast(${con}%) saturate(110%)`;
        }
        if (filter === 'vintage') {
            return `sepia(${60 * (intensity/100)}%) contrast(${100 + 10*(intensity/100)}%) brightness(95%)`;
        }
        return 'none';
    };

    const getFilterClass = () => {
        const found = FILTER_TYPES.find(f => f.id === filter);
        if (!found) return '';
        if (['glitch', 'pastel', 'cyberpunk', 'vhs', 'golden', 'night', 'toon'].includes(found.id)) return `filter-${found.id}`;
        return '';
    };

    const drawFrameOnCanvas = (canvas, ctx) => {
        if (frameType === 'none') return;
        const color = FRAME_TYPES.find(f => f.id === frameType)?.color;
        const thickness = Math.min(canvas.width, canvas.height) * 0.05;
        ctx.shadowBlur = (frameType === 'neon' || frameType === 'cyber') ? 30 : 0;
        ctx.shadowColor = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.strokeRect(thickness/2, thickness/2, canvas.width - thickness, canvas.height - thickness);
        ctx.shadowBlur = 0;
    };

    const capture = useCallback(() => {
        if (!webcamRef.current) return;
        
        const flash = document.createElement('div');
        flash.id = 'camera-flash';
        flash.style.cssText = 'position:fixed;inset:0;background:white;z-index:999;opacity:1;transition:opacity 0.6s ease-out;';
        document.body.appendChild(flash);
        setTimeout(() => { flash.style.opacity = '0'; setTimeout(() => flash.remove(), 600); }, 50);

        const imageSrc = webcamRef.current.getScreenshot();
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            
            let filterString = getFilterCSS();
            const inst = intensity / 100;
            if (filter === 'glitch') filterString = `hue-rotate(${90 * inst}deg) saturate(${1 + 2*inst}) contrast(${1 + 0.5*inst})`;
            else if (filter === 'pastel') filterString = `brightness(110%) contrast(90%) saturate(120%) blur(${2 * inst}px)`;
            else if (filter === 'cyberpunk') filterString = `contrast(${100 + 40*inst}%) saturate(${100 + 50*inst}%) hue-rotate(${20 * inst}deg)`;
            else if (filter === 'vhs') filterString = `contrast(120%) saturate(130%) brightness(110%) sepia(10%)`;
            else if (filter === 'golden') filterString = `brightness(110%) saturate(${100 + 30*inst}%) hue-rotate(${-10 * inst}deg) sepia(0.2)`;
            else if (filter === 'night') filterString = `brightness(80%) hue-rotate(180deg) contrast(110%)`;
            else if (filter === 'toon') filterString = `contrast(180%) saturate(150%) brightness(110%)`;
            
            ctx.filter = filterString;
            ctx.drawImage(img, 0, 0);

            const filteredImage = canvas.toDataURL('image/png');
            
            if (isCollageMode) {
                const newCollage = [...collageImages, filteredImage];
                setCollageImages(newCollage);
                setIsCapturing(false);
                setCountdown(0);
                if (newCollage.length < collageCount) {
                    setTimeout(() => startCapture(), 1500);
                } else {
                    assembleCollage(newCollage);
                }
            } else {
                drawFrameOnCanvas(canvas, ctx);
                const final = canvas.toDataURL('image/png');
                setCapturedImage(final);
                setIsCapturing(false);
                setCountdown(0);
                savePhoto(final);
            }
        };
    }, [webcamRef, filter, intensity, isCollageMode, collageImages, collageCount, frameType, isMirrored]);

    const assembleCollage = async (images) => {
        const canvas = document.createElement('canvas');
        let cols, rows;
        if (collageLayout === 'horizontal') { cols = collageCount; rows = 1; }
        else if (collageLayout === 'vertical') { cols = 1; rows = collageCount; }
        else { 
            if (collageCount === 2) { cols = 2; rows = 1; }
            else if (collageCount === 3) { cols = 3; rows = 1; }
            else if (collageCount === 4) { cols = 2; rows = 2; }
            else { cols = 3; rows = 2; } 
        }

        const sourceW = 1280;
        const sourceH = 720;
        canvas.width = sourceW * cols;
        canvas.height = sourceH * rows;
        const ctx = canvas.getContext('2d');
        
        const loadImg = (src) => new Promise((res) => {
            const img = new Image();
            img.src = src;
            img.onload = () => res(img);
        });

        const loadedImages = await Promise.all(images.map(loadImg));
        loadedImages.forEach((img, i) => {
            const r = Math.floor(i / cols);
            const c = i % cols;
            ctx.drawImage(img, c * sourceW, r * sourceH, sourceW, sourceH);
        });

        drawFrameOnCanvas(canvas, ctx);
        const final = canvas.toDataURL('image/png');
        setCapturedImage(final);
        savePhoto(final);
        setCollageImages([]);
    };

    const savePhoto = async (image) => {
        try {
            const token = localStorage.getItem('access_token');
            await axios.post('http://127.0.0.1:8000/api/photos/upload_base64/', 
                { image, filter_used: filter },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            toast.success("Photo Saved");
        } catch (err) { 
            console.error("Upload failed", err);
            toast.error("Cloud Save Failed");
        }
    };

    return (
        <div className="pt-24 pb-12 px-6 min-h-screen flex flex-col items-center gap-8 overflow-hidden selection:bg-brand-neon-blue/30 relative">
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80]" />
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="fixed top-0 right-0 h-full w-85 bg-[#0a0a0a] border-l border-white/5 z-[100] p-10 shadow-[-60px_0_120px_rgba(0,0,0,0.9)] flex flex-col gap-10 overflow-y-auto no-scrollbar">
                            <div className="flex items-center justify-between border-b border-white/5 pb-8">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Select <span className="text-brand-neon-purple">Filter</span></h3>
                                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest leading-none">Photo Effects</span>
                                </div>
                                <button onClick={() => setIsSidebarOpen(false)} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all hover:scale-110 active:scale-90"><ChevronRight className="w-6 h-6"/></button>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {FILTER_TYPES.map(f => (
                                    <button key={f.id} onClick={() => {setFilter(f.id); setIsSidebarOpen(false);}} className={`flex items-center gap-5 p-5 rounded-3xl border transition-all group ${filter === f.id ? 'bg-brand-neon-purple/10 border-brand-neon-purple text-brand-neon-purple shadow-[0_0_30px_#bc13fe1a]' : 'bg-white/5 border-transparent text-gray-500 hover:text-white hover:bg-white/[0.08]'}`}>
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${filter === f.id ? 'bg-brand-neon-purple text-white shadow-[0_0_20px_#bc13fe]' : 'bg-black/40 group-hover:bg-white/10'}`}>{f.icon}</div>
                                        <div className="flex flex-col items-start gap-0.5">
                                            <span className="text-[11px] font-black uppercase tracking-[0.2em]">{f.name}</span>
                                            <span className="text-[8px] font-mono text-gray-600 uppercase">Available</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Sidebar Toggle */}
            <button onClick={() => setIsSidebarOpen(true)} className="fixed right-6 top-32 z-[90] w-16 h-16 rounded-[2rem] bg-black/40 backdrop-blur-2xl border border-white/10 flex items-center justify-center text-brand-neon-purple shadow-3xl hover:bg-brand-neon-purple hover:text-white transition-all hover:scale-110 active:scale-95 group">
                <Settings className="w-7 h-7 group-hover:rotate-180 transition-transform duration-700" />
            </button>

            {/* Viewport Area */}
            <div className="w-full max-w-5xl relative aspect-video glass rounded-[3.5rem] overflow-hidden border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,1)] bg-black group-viewport">
                {!capturedImage ? (
                    <div className="relative w-full h-full">
                        <Webcam audio={false} ref={webcamRef} mirrored={isMirrored} screenshotFormat="image/png" videoConstraints={videoConstraints} className={`w-full h-full object-cover select-none ${getFilterClass()}`} style={{ filter: getFilterCSS() }} />
                        {countdown > 0 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 z-20 pointer-events-none">
                                <motion.span key={countdown} initial={{scale:0.2, opacity:0, rotate:-20}} animate={{scale:1, opacity:1, rotate:0}} className="text-[260px] font-black italic text-white drop-shadow-[0_0_60px_rgba(0,0,0,0.8)] leading-none tabular-nums select-none">{countdown}</motion.span>
                            </div>
                        )}
                        <div className="absolute top-10 left-10 flex items-center gap-6 z-10">
                             <div className="glass px-8 py-4 rounded-3xl border border-white/20 flex items-center gap-4 backdrop-blur-3xl shadow-2xl">
                                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_15px_#ef4444]" />
                                <span className="text-[12px] font-black uppercase text-white tracking-[0.3em]">{isCollageMode ? `Photo ${collageImages.length + 1}` : 'Live View'}</span>
                             </div>
                             <button onClick={() => setIsMirrored(!isMirrored)} className={`glass px-8 py-4 rounded-3xl border transition-all text-[12px] font-black uppercase tracking-widest flex items-center gap-4 backdrop-blur-3xl shadow-2xl ${isMirrored ? 'border-brand-neon-blue bg-brand-neon-blue/20 text-brand-neon-blue shadow-[0_0_20px_rgba(0,243,255,0.2)]' : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}>
                                <RefreshCw className={`w-5 h-5 ${isMirrored ? 'animate-spin-slow' : ''}`} />
                                {isMirrored ? 'Mirror On' : 'Mirror Off'}
                             </button>
                        </div>

                        {/* Floating Capture Overlay */}
                        <div className="absolute bottom-10 inset-x-0 flex justify-center z-30 opacity-0 group-viewport-hover:opacity-100 transition-opacity duration-300">
                             <button 
                                disabled={isCapturing} 
                                onClick={startCapture}
                                className={`w-28 h-28 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center group active:scale-95 transition-all hover:bg-white/20 hover:scale-110 shadow-[0_0_40px_rgba(255,255,255,0.1)] ${isCapturing ? 'opacity-20 cursor-not-allowed' : ''}`}
                             >
                                <div className="w-22 h-22 rounded-full border-[4px] border-white flex items-center justify-center">
                                     <div className="w-16 h-16 rounded-full bg-red-500 group-hover:bg-red-400 transition-colors shadow-inner" />
                                </div>
                             </button>
                        </div>
                    </div>
                ) : (
                    <div className="relative w-full h-full bg-[#020202] flex items-center justify-center group pointer-events-none sm:pointer-events-auto">
                        <motion.img initial={{scale:0.95, opacity:0, rotate:2}} animate={{scale:1, opacity:1, rotate:0}} src={capturedImage} className="max-w-[90%] max-h-[90%] object-contain rounded-2xl shadow-[0_50px_100px_rgba(0,0,0,0.8)]" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-[70px] opacity-0 group-hover:opacity-100 transition-all duration-700">
                            <div className="flex gap-16">
                                <button onClick={() => {setCapturedImage(null); setCollageImages([]);}} className="w-32 h-32 rounded-[2.5rem] bg-white/5 flex flex-col items-center justify-center text-white border border-white/10 hover:bg-white/10 hover:scale-110 transition-all group/btn shadow-2xl">
                                    <RotateCcw className="w-12 h-12 mb-2 group-hover/btn:rotate-[-120deg] transition-transform duration-500" />
                                    <span className="text-[11px] font-black uppercase tracking-widest">Retry</span>
                                </button>
                                <button onClick={() => {const l=document.createElement('a'); l.href=capturedImage; l.download='my-photo.png'; l.click();}} className="w-32 h-32 rounded-[2.5rem] bg-brand-neon-blue flex flex-col items-center justify-center text-black shadow-[0_0_80px_rgba(0,243,255,0.3)] hover:scale-125 transition-all font-black group/btn">
                                    <Download className="w-12 h-12 mb-2 group-hover/btn:translate-y-1 transition-transform duration-500" />
                                    <span className="text-[11px] uppercase tracking-widest">Download</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Neural Console Center Station */}
            <div className="w-full max-w-5xl space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* Frames Deck */}
                    <div className="glass rounded-[3rem] p-8 border border-white/10 flex flex-col gap-6 shadow-3xl bg-black/20">
                        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                            <BoxSelect className="w-6 h-6 text-brand-neon-blue" />
                            <span className="text-[13px] font-black uppercase tracking-[0.3em] text-white">Select Frame</span>
                        </div>
                        <div className="flex gap-3">
                            {FRAME_TYPES.map(f => (
                                <button key={f.id} onClick={() => setFrameType(f.id)} className={`flex-1 py-5 rounded-3xl border transition-all text-[10px] font-black uppercase tracking-widest leading-none ${frameType === f.id ? 'bg-brand-neon-blue border-brand-neon-blue text-black shadow-[0_0_30px_#00f3ff44]' : 'bg-white/5 border-transparent text-gray-500 hover:text-white hover:bg-white/10'}`}>
                                    {f.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Collage Deck */}
                    <div className="glass rounded-[3rem] p-8 border border-white/10 flex flex-col gap-6 shadow-3xl bg-black/20 min-h-[200px]">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <div className="flex items-center gap-4">
                                <LayoutGrid className="w-6 h-6 text-brand-neon-purple shadow-[0_0_15px_#bc13fe44]" />
                                <span className="text-[13px] font-black uppercase tracking-[0.3em] text-white">Collage Mode</span>
                            </div>
                            <button onClick={() => setIsCollageMode(!isCollageMode)} className={`px-8 py-3 rounded-2xl border transition-all text-[11px] font-black uppercase tracking-widest ${isCollageMode ? 'bg-brand-neon-purple border-brand-neon-purple text-white shadow-[0_0_40px_#bc13fe66]' : 'bg-white/5 border-transparent text-gray-600 hover:text-white hover:bg-white/10'}`}>
                                {isCollageMode ? 'On' : 'Off'}
                            </button>
                        </div>
                        
                        <div className="relative">
                            <AnimatePresence mode="wait">
                                {isCollageMode ? (
                                    <motion.div key="matrix-content" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex flex-col gap-6 w-full">
                                        <div className="flex items-center gap-4">
                                            <div className="flex-grow flex gap-1 p-1 bg-black/50 rounded-2xl border border-white/5 shadow-inner min-w-0">
                                                {[2, 3, 4, 6].map(c => (
                                                    <button key={c} onClick={() => setCollageCount(c)} className={`flex-1 py-3 px-1 rounded-xl transition-all text-[11px] font-black uppercase ${collageCount === c ? 'bg-white/10 text-white scale-[1.05] border border-white/10' : 'text-gray-600 hover:text-white'}`}>
                                                        {c}P
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="flex gap-2 shrink-0 pr-1">
                                                <button onClick={() => setCollageLayout('grid')} className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all ${collageLayout === 'grid' ? 'bg-brand-neon-blue border-brand-neon-blue text-black shadow-[0_0_20px_#00f3ff66]' : 'bg-white/5 border-transparent text-gray-500 hover:bg-white/10'}`}><LayoutGrid className="w-5 h-5"/></button>
                                                <button onClick={() => setCollageLayout('horizontal')} className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all ${collageLayout === 'horizontal' ? 'bg-brand-neon-blue border-brand-neon-blue text-black shadow-[0_0_20px_#00f3ff66]' : 'bg-white/5 border-transparent text-gray-500 hover:bg-white/10'}`}><Columns className="w-5 h-5"/></button>
                                                <button onClick={() => setCollageLayout('vertical')} className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all ${collageLayout === 'vertical' ? 'bg-brand-neon-blue border-brand-neon-blue text-black shadow-[0_0_20px_#00f3ff66]' : 'bg-white/5 border-transparent text-gray-500 hover:bg-white/10'}`}><Rows className="w-5 h-5"/></button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div key="matrix-idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center py-4">
                                        <p className="text-[10px] font-mono text-gray-700 uppercase tracking-[0.3em] pl-2">Enable for multiple shots</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Bottom Hub Station */}
                <div className="glass rounded-[5rem] p-10 border border-white/10 grid grid-cols-1 lg:grid-cols-3 items-center gap-12 shadow-[0_60px_120px_-30px_rgba(0,0,0,1)] bg-black/60 backdrop-blur-[60px] relative mt-10 overflow-hidden transform-gpu">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-neon-purple/5 to-transparent pointer-events-none" />
                    
                    <div className="flex flex-col gap-3 max-w-sm relative z-10">
                        <div className="flex items-center justify-between pl-1">
                            <div className="flex items-center gap-3">
                                <Sliders className="w-5 h-5 text-brand-neon-blue" />
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Intensity</span>
                            </div>
                            <span className="text-sm font-mono font-black text-brand-neon-blue drop-shadow-[0_0_8px_#00f3ff44]">{intensity}%</span>
                        </div>
                        <input type="range" min="0" max="100" value={intensity} onChange={(e)=>setIntensity(e.target.value)} className="w-full h-2 bg-white/5 rounded-full appearance-none accent-brand-neon-purple cursor-pointer shadow-inner hover:accent-brand-neon-blue transition-all" />
                    </div>

                    <div className="flex justify-center relative z-10">
                        <button disabled={isCapturing || !!capturedImage} onClick={startCapture} className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-700 active:scale-90 ${isCapturing ? 'opacity-20 cursor-not-allowed scale-90' : 'hover:shadow-[0_0_120px_rgba(0,243,255,0.3)] bg-white shadow-[0_0_80px_rgba(255,255,255,0.1)] group'}`}>
                            <div className="w-36 h-36 rounded-full bg-brand-neon-purple group-hover:bg-brand-neon-pink group-hover:scale-105 transition-all duration-500 flex flex-col items-center justify-center gap-2 shadow-inner relative overflow-hidden">
                                <Camera className="w-14 h-14 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-transform duration-700 group-hover:rotate-6" />
                                <span className="text-[11px] font-black text-white uppercase tracking-[0.4em] translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">Snap</span>
                            </div>
                        </button>
                    </div>

                    <div className="flex flex-col gap-2 items-end lg:items-center relative z-10">
                         <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]" />
                            <span className="text-[13px] font-black text-white uppercase tracking-[0.2em]">{user?.username || 'Guest'}_Ready</span>
                         </div>
                         <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest italic leading-none">System Active</p>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .group-viewport:hover .group-viewport-hover\\:opacity-100 { opacity: 1; }
            `}} />
        </div>
    );
};

export default Photobooth;
