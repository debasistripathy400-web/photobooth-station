# 📸 AI Photobooth Station

**AI Photobooth Station** is a high-fidelity, production-ready web platform for capturing, styling, and archiving digital moments. Featuring a professional-grade "Neural Hub" console, a collage engine (Neural Matrix), and a cinematic image filtering pipeline, this station is designed for a premium, industrial photobooth experience.

---

## 🚀 Core Features

### 🎞️ Neural Matrix (Collage Mode)
Professional-grade collage engine supporting custom layout densities (`2P, 3P, 4P, 6P`) and dynamic orientations (Grid, Horizontal, Vertical). Capture multiple shots in sequence with a synchronized AI-driven countdown.

### 🎭 Cinematic Filtering & Framing
A high-fidelity image processing pipeline with real-time CSS and Canvas-based filters:
- **Filters**: Neon (Cyberpunk), Vintage (Film), Cinematic, VHS, Golden Hour, Night Vision, Toon, and Glitch.
- **Frames**: Custom structural frames including Neon Purple, Classic White, and Cyber Blue.

### 🔘 Industrial Control Console (HUD)
- **Master Shutter Hub**: Centered ergonomic capture controls.
- **Floating Viewfinder Shutter**: Seamless "touch-style" photography directly over the live feed.
- **Real-Time Intensity Control**: Fine-tune filter strength with precision sliders.

### 📁 Neural Archive (Gallery)
A secure, high-fidelity gallery with:
- **Identity Synthesis**: Each photo is tagged with your unique neural record (username).
- **Blob-Based Local Save**: Professional, secure download engine bypassing CORS restrictions.
- **Archive Management**: View-per-shot, Full-res preview, and permanent record deletion.

---

## 🛠️ Technical Architecture

### Frontend (Uplink)
- **Framework**: React.js with Vite
- **Styling**: Tailwind CSS v4 & Lucide Icons
- **Motion**: Framer Motion for high-fidelity micro-interactions
- **Auth**: JWT (JSON Web Token) with long-term persistent sessions

### Backend (Core)
- **Framework**: Django REST Framework (DRF)
- **Database**: SQLite (Development) / PostgreSQL Ready
- **Security**: SimpleJWT with extended lifetime for persistent booth operations
- **Image Handling**: Base64 synthesis and file-system storage

---

## 📦 Local Station Setup

### 1. Backend Core
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

### 2. Frontend Link
```bash
cd frontend
npm install
npm run dev
```

---

## ⚖️ License
Released under the **MIT License**. Created by [Debasis Tripathy](https://github.com/debasistripathy400-web).

---
> [!TIP]
> This station is optimized for 1080p+ widescreen displays for a true "Photobooth Station" cinematic experience.
