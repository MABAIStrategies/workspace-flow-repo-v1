import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Particle system for animated background
        const particles: Array<{
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            opacity: number;
        }> = [];

        // Create particles
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }

        let animationId: number;

        const animate = () => {
            ctx.fillStyle = 'rgba(4, 15, 35, 1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw and update particles
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(192, 157, 98, ${p.opacity})`; // Champagne gold
                ctx.fill();

                // Update position
                p.x += p.vx;
                p.y += p.vy;

                // Bounce off edges
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            });

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(192, 157, 98, ${0.15 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            animationId = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex flex-col transition-transform duration-700 ease-in-out overflow-hidden">
            {/* Animated Canvas Background */}
            <canvas ref={canvasRef} className="absolute inset-0 z-0" />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#040f23]/80 to-[#040f23]"></div>

            {/* Landing Header */}
            <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center animate-fade-in">
                <div className="flex items-center gap-4">
                    <img
                        src="/Images/OfficialCompanyLogo.png"
                        alt="MAB Logo"
                        className="h-14 w-auto object-contain drop-shadow-2xl"
                    />
                    <div className="flex flex-col text-left">
                        <span className="text-[#f5f1e8] font-display font-bold text-2xl tracking-tight leading-none drop-shadow-lg">MAB</span>
                        <span className="text-[#c09d62] text-[11px] font-black tracking-[0.25em] uppercase">AI Strategies</span>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/app')}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#1e40af] to-[#1e3a8a] hover:from-[#2563eb] hover:to-[#1e40af] border border-[#c09d62]/20 rounded-full text-white text-sm font-bold transition-all backdrop-blur-md shadow-xl hover:shadow-2xl hover:scale-105"
                >
                    Enter Workspace
                </button>
            </header>

            {/* Landing Content */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 pb-20">
                <div className="max-w-5xl mx-auto space-y-10">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1e40af]/10 border border-[#c09d62]/30 text-[#c09d62] text-xs font-bold uppercase tracking-wider mb-6 animate-slide-up delay-100 backdrop-blur-sm"
                    >
                        <span className="w-2 h-2 rounded-full bg-[#c09d62] animate-pulse shadow-lg shadow-[#c09d62]/50"></span>
                        V3.0 Agentic Framework Live
                    </div>

                    <h1
                        className="text-6xl sm:text-8xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#f5f1e8] via-white to-[#f5f1e8] leading-tight animate-slide-up delay-200 tracking-tighter drop-shadow-2xl"
                    >
                        Automate the Boring.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c09d62] via-[#d4b883] to-[#c09d62]">
                            Augment the Genius.
                        </span>
                    </h1>

                    <p
                        className="text-xl sm:text-2xl text-[#f5f1e8]/90 max-w-3xl mx-auto leading-relaxed animate-slide-up delay-300 px-4 font-medium"
                    >
                        The definitive repository of high-impact automated workflows. Design, simulate, and deploy custom agents with <strong className="text-[#c09d62]">Workflow Studio</strong>.
                    </p>

                    <div
                        className="flex flex-col sm:flex-row gap-5 justify-center items-center mt-14 animate-slide-up delay-400"
                    >
                        <button
                            onClick={() => navigate('/app')}
                            className="group relative px-10 py-5 bg-gradient-to-r from-[#1e40af] to-[#1e3a8a] rounded-2xl text-white font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border border-[#c09d62]/20 hover:shadow-[#c09d62]/20"
                        >
                            Enter Workspace
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                        <button
                            className="px-10 py-5 bg-[#f5f1e8]/5 hover:bg-[#f5f1e8]/10 border-2 border-[#c09d62]/30 rounded-2xl text-[#f5f1e8] font-black text-xl transition-all backdrop-blur-sm hover:scale-105"
                        >
                            View Documentation
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer Credits */}
            <div className="relative z-10 pb-8 text-center text-[#c09d62]/40 text-xs tracking-wider">
                © 2026 MAB AI Strategies LLC. All rights reserved.
            </div>
        </div>
    );
};

export default LandingPage;
