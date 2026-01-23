import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col transition-transform duration-700 ease-in-out">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    alt="Workspace Background"
                    className="w-full h-full object-cover opacity-60 animate-fade-in duration-3000"
                    src="/Images/hero_background_agentic.png"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
            </div>

            {/* Landing Header */}
            <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center animate-fade-in">
                <div className="flex items-center gap-3">
                    <img
                        src="/Images/OfficialCompanyLogo.png"
                        alt="MAB Logo"
                        className="h-12 w-auto object-contain rounded-md shadow-lg ring-1 ring-white/10"
                    />
                    <div className="flex flex-col text-left">
                        <span className="text-white font-display font-bold text-xl tracking-wide leading-none">MAB</span>
                        <span className="text-sky-400 text-[10px] font-bold tracking-[0.2em] uppercase">AI Strategies</span>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/app')}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white text-sm font-bold transition-all backdrop-blur-md"
                >
                    Agent Login
                </button>
            </header>

            {/* Landing Content */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-sky-300 text-xs font-medium uppercase tracking-wider mb-4 animate-slide-up delay-100"
                    >
                        <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                        V3.0 Agentic Framework Live
                    </div>

                    <h1
                        className="text-5xl sm:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-300 leading-tight animate-slide-up delay-200"
                    >
                        Automate the Boring.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300">
                            Augment the Genius.
                        </span>
                    </h1>

                    <p
                        className="text-lg sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed animate-slide-up delay-300 px-4"
                    >
                        The definitive repository of high-impact automated flows. Design, simulate, and deploy custom agents with <strong>Workflow Studio</strong>.
                    </p>

                    <div
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12 animate-slide-up delay-400"
                    >
                        <button
                            onClick={() => navigate('/app')}
                            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-bold text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                        >
                            Enter Workspace
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                        <button
                            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 font-bold text-lg transition-all backdrop-blur-sm"
                        >
                            View Docs
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
