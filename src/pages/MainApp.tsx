import React, { useState } from 'react';
import RepositoryView from './RepositoryView';
import StudioView from './StudioView';

const MainApp: React.FC = () => {
    const [view, setView] = useState<'repo' | 'studio'>('repo');
    const [selectedFlow, setSelectedFlow] = useState<any>(null);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
             {/* Main App Header */}
            <header className="bg-brand-50/50 backdrop-blur-md border-b border-slate-200 z-30 shrink-0 sticky top-0">
                <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo Area */}
                        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView('repo')}>
                            <img src="/Images/OfficialCompanyLogo.png" alt="MAB Logo" className="h-10 w-auto object-contain mix-blend-multiply" />
                            <div className="hidden md:block">
                                <h1 className="text-lg font-bold text-slate-900 leading-tight font-display tracking-tight">MAB AI Strategies</h1>
                                <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Workspace Flows</p>
                            </div>
                        </div>

                        {/* Centered Navigation Toggles */}
                        <div className="absolute left-1/2 transform -translate-x-1/2">
                            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-inner">
                                <button 
                                    onClick={() => setView('repo')}
                                    className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${view === 'repo' ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md ring-1 ring-white/10' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    Repository
                                </button>
                                <button 
                                    onClick={() => setView('studio')}
                                    className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${view === 'studio' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md ring-1 ring-white/10' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    <span className="material-symbols-outlined text-sm">radio_button_unchecked</span> Studio
                                </button>
                            </div>
                        </div>

                        {/* Right Area: Profile Placeholder */}
                        <div className="flex items-center gap-4 relative">
                            <span className="text-slate-400 hover:text-slate-600 cursor-pointer">
                                <span className="material-symbols-outlined">notifications</span>
                            </span>
                            <div className="relative group">
                                <button className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden focus:ring-2 focus:ring-blue-500 transition-all outline-none">
                                    <img src={`https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff`} alt="Profile" />
                                </button>
                                
                                {/* Dropdown Menu */}
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 transform origin-top-right z-50">
                                    <div className="px-4 py-3 border-b border-slate-50">
                                        <p className="text-xs text-slate-500">Signed in as</p>
                                        <p className="text-sm font-bold text-slate-900 truncate">User</p>
                                    </div>
                                    <button 
                                        onClick={async () => {
                                            await import('../lib/supabase').then(m => m.supabase.auth.signOut());
                                            window.location.href = '/login';
                                        }} 
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-sm">logout</span>
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* View Render */}
            {view === 'repo' ? <RepositoryView onFlowSelect={setSelectedFlow} /> : <StudioView />}

            {/* Detail Modal (Simplified implementation for MVP) */}
            {selectedFlow && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" onClick={() => setSelectedFlow(null)}>
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"></div>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative animate-fade-in" onClick={e => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                            <div>
                                <h3 className="text-2xl font-display font-bold text-slate-900">{selectedFlow.name}</h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200">{selectedFlow.dept}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span className="text-sm text-slate-500">{selectedFlow.timeSaved} Saved</span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedFlow(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">Implementation Steps</h4>
                            <div className="space-y-6 relative">
                                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-100"></div>
                                {selectedFlow.steps && selectedFlow.steps.map((step: string, i: number) => (
                                    <div key={i} className="flex gap-5 relative">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-blue-600 font-bold flex items-center justify-center border-2 border-blue-100 shadow-sm z-10">{i+1}</div>
                                        <div className="pt-1">
                                            <p className="text-sm text-slate-600 mt-1">{step}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                         <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-end gap-3 sticky bottom-0">
                            <button onClick={() => setSelectedFlow(null)} className="px-6 py-2.5 rounded-lg bg-white border border-slate-300 text-sm font-bold text-slate-700 hover:bg-slate-50">Close</button>
                            <button className="px-6 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-bold shadow-lg hover:bg-black flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">bookmark</span> Save to Library
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainApp;
