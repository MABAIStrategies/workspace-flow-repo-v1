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
                    className="w-full h-full object-cover opacity-60 animate-pulse-slow" 
                    src="/Images/background workspace.png" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40"></div>
            </div>

            {/* Landing Header */}
            <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center animate-fade-in">
                <div className="flex items-center gap-3">
                    <img 
                        src="/Images/OfficialCompanyLogo.png" 
                        alt="MAB Logo" 
                        className="h-12 w-auto object-contain rounded-md shadow-lg ring-1 ring-white/10" 
                    />
                    <div className="flex flex-col">
                        <span className="text-white font-display font-bold text-xl tracking-wide leading-none">MAB</span>
                        <span className="text-sky-400 text-[10px] font-bold tracking-[0.2em] uppercase">AI Strategies</span>
                    </div>
                </div>
                <button 
                    onClick={() => navigate('/app')}
                    className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                    Login
                </button>
            </header>

            {/* Landing Content */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div 
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-dark text-sky-300 text-xs font-medium uppercase tracking-wider mb-4 animate-slide-up"
                        style={{ animationDelay: '0.1s' }}
                    >
                        <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                        Enterprise Edition 2.0 Live
                    </div>

                    <h1 
                        className="text-5xl sm:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFFDD0] to-[#D4AF37] leading-tight animate-slide-up"
                        style={{ animationDelay: '0.2s' }}
                    >
                        Automate the Boring.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400">
                            Augment the Genius.
                        </span>
                    </h1>

                    <p 
                        className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed animate-slide-up"
                        style={{ animationDelay: '0.3s' }}
                    >
                        The definitive repository of high-impact Google Workspace flows. Now featuring <strong>Workflow Studio</strong> to design your own.
                    </p>

                    <div 
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 animate-slide-up"
                        style={{ animationDelay: '0.4s' }}
                    >
                        {/* Buttons removed in previous design update */}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
