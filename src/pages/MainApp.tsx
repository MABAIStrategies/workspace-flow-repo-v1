import React, { useState } from 'react';
import RepositoryView from './RepositoryView';
import StudioView from './StudioView';
import SalesQuestView from './SalesQuestView';
import { supabase } from '../lib/supabase';
import type { UIWorkflow } from '../types/ui';

const ProfileForm: React.FC<{ name: string, setName: (n: string) => void, onSave: () => void, loading: boolean, msg: string }> = ({ name, setName, onSave, loading, msg }) => {
    return (
        <div className="space-y-6 max-w-md">
            <div>
                <label className="block text-sm font-medium leading-6 text-slate-900">Display Name</label>
                <div className="mt-2">
                    <input
                        value={name} onChange={e => setName(e.target.value)}
                        type="text" className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3" placeholder="Enter your name"
                    />
                </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
                <button
                    onClick={onSave}
                    disabled={loading}
                    className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
                {msg && <span className={`text-sm font-bold ${msg === 'Error' ? 'text-red-500' : 'text-emerald-600'}`}>{msg}</span>}
            </div>
        </div>
    );
};

const MainApp: React.FC = () => {
    const [view, setView] = useState<'repo' | 'studio' | 'profile' | 'quest'>('repo');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [selectedFlow, setSelectedFlow] = useState<UIWorkflow | null>(null);
    const [userName, setUserName] = useState('User');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<string>('');

    React.useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
            if (data?.full_name) setUserName(data.full_name);
        }
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No user");

            const { error } = await supabase.from('profiles').upsert({
                id: user.id,
                full_name: userName,
                updated_at: new Date().toISOString()
            });

            if (error) throw error;
            setMsg('Saved!');
        } catch (e) {
            console.error(e);
            setMsg('Error');
        } finally {
            setLoading(false);
            setTimeout(() => setMsg(''), 3000);
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
            {/* Main App Header */}
            <header className="bg-brand-50/50 backdrop-blur-md border-b border-slate-200 z-30 shrink-0 sticky top-0">
                <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo Area */}
                        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView('repo')}>
                            {/* Mobile Hamburger */}
                            <button onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(!mobileMenuOpen); }} className="md:hidden p-2 text-slate-500 hover:text-slate-900">
                                <span className="material-symbols-outlined">menu</span>
                            </button>
                            <img src="/Images/OfficialCompanyLogo.png" alt="MAB Logo" className="h-10 w-auto object-contain" />
                            <div className="hidden lg:block">
                                <h1 className="text-lg font-bold text-slate-900 leading-tight font-display tracking-tight">MAB AI Strategies</h1>
                                <p className="text-[10px] text-[#c09d62] font-black tracking-widest uppercase">Workspace Flows</p>
                            </div>
                        </div>

                        {/* Centered Navigation Toggles - HIDDEN ON MOBILE */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
                            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-inner">
                                <button
                                    onClick={() => { setView('repo'); setSelectedFlow(null); }}
                                    className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${view === 'repo' ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md ring-1 ring-white/10' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    Repository
                                </button>
                                <button
                                    onClick={() => { setView('studio'); setSelectedFlow(null); }}
                                    className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${view === 'studio' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md ring-1 ring-white/10' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    <span className="material-symbols-outlined text-sm">radio_button_unchecked</span> Studio
                                </button>
                                <button
                                    onClick={() => { setView('quest'); setSelectedFlow(null); }}
                                    className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${view === 'quest' ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md ring-1 ring-white/10' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    <span className="material-symbols-outlined text-sm">military_tech</span> Quests
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
                                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0D8ABC&color=fff`} alt="Profile" />
                                </button>

                                {/* Dropdown Menu */}
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 transform origin-top-right z-50">
                                    <div className="px-4 py-3 border-b border-slate-50">
                                        <p className="text-xs text-slate-500">Signed in as</p>
                                        <p className="text-sm font-bold text-slate-900 truncate">{userName}</p>
                                    </div>
                                    <button
                                        onClick={() => { setView('profile'); setSelectedFlow(null); }}
                                        className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-sm">person</span>
                                        Profile Settings
                                    </button>
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
            </header >

            {/* Mobile Menu Dropdown */}
            {
                mobileMenuOpen && (
                    <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-2 animate-fade-in shadow-xl relative z-20">
                        <button onClick={() => { setView('repo'); setMobileMenuOpen(false); }} className={`w-full text-left px-4 py-3 rounded-lg font-bold ${view === 'repo' ? 'bg-slate-100 text-slate-900' : 'text-slate-500'}`}>Repository</button>
                        <button onClick={() => { setView('studio'); setMobileMenuOpen(false); }} className={`w-full text-left px-4 py-3 rounded-lg font-bold ${view === 'studio' ? 'bg-blue-50 text-blue-600' : 'text-slate-500'}`}>Studio</button>
                        <button onClick={() => { setView('profile'); setMobileMenuOpen(false); }} className={`w-full text-left px-4 py-3 rounded-lg font-bold ${view === 'profile' ? 'bg-slate-100 text-slate-900' : 'text-slate-500'}`}>My Profile</button>
                    </div>
                )
            }

            {/* View Render */}
            {view === 'repo' && <RepositoryView onFlowSelect={setSelectedFlow} />}
            {view === 'studio' && <StudioView />}
            {view === 'quest' && <SalesQuestView />}
            {
                view === 'profile' && (
                    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-8 flex justify-center">
                        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                            <h2 className="text-2xl font-bold font-display text-slate-900 mb-6">User Profile</h2>
                            <ProfileForm
                                name={userName}
                                setName={setUserName}
                                onSave={handleSaveProfile}
                                loading={loading}
                                msg={msg}
                            />
                        </div>
                    </div>
                )
            }

            {/* Detail Modal */}
            {
                selectedFlow && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" onClick={() => { setSelectedFlow(null); setMsg(''); }}>
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"></div>
                        <div
                            className={`bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col relative animate-scale-in border border-white/20`}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header with Tier-specific styling */}
                            <div className={`p-8 pb-12 relative overflow-hidden ${selectedFlow.tier === 'GEM' ? 'bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-950 text-white' :
                                selectedFlow.tier === 'GPT' ? 'bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white' :
                                    selectedFlow.tier === 'SKILL' ? 'bg-gradient-to-br from-amber-900 via-orange-900 to-amber-950 text-white' :
                                        'bg-slate-50 border-b border-slate-100 text-slate-900'
                                }`}>
                                {/* Noise Overlays for Premium */}
                                {selectedFlow.isPremium && <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-150"></div>}

                                <div className="relative z-10 flex justify-between items-start">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            {selectedFlow.tier && (
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedFlow.tier === 'GEM' ? 'bg-blue-500/20 text-blue-200 border border-blue-400/30' :
                                                    selectedFlow.tier === 'GPT' ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30' :
                                                        selectedFlow.tier === 'SKILL' ? 'bg-amber-500/20 text-amber-200 border border-amber-400/30' :
                                                            'bg-slate-200 text-slate-600'
                                                    }`}>
                                                    {selectedFlow.tier} Tier
                                                </span>
                                            )}
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedFlow.isPremium ? 'bg-white/10 text-white/80 border border-white/20' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                {selectedFlow.dept}
                                            </span>
                                        </div>
                                        <h3 className="text-3xl lg:text-4xl font-syne font-black tracking-tight">{selectedFlow.name}</h3>
                                        <div className="flex items-center gap-4 text-sm opacity-80">
                                            <div className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-base">hub</span>
                                                <span className="font-bold">{selectedFlow.platform}</span>
                                            </div>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-30"></span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-base">timer</span>
                                                <span className="font-bold">{selectedFlow.timeSaved} Saved</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => { setSelectedFlow(null); setMsg(''); }} className={`p-2 rounded-full transition-all ${selectedFlow.isPremium ? 'hover:bg-white/10 text-white/60 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'}`}>
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                                <div className="p-8 space-y-8">
                                    {/* Description */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Objective</h4>
                                        <p className="text-slate-600 text-lg leading-relaxed font-medium">
                                            {selectedFlow.action || "This professional workflow automates complex business processes with high reliability and security."}
                                        </p>
                                    </div>

                                    {/* Implementation Steps */}
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">One-Click Blueprint</h4>
                                        <div className="grid gap-4">
                                            {selectedFlow.steps && selectedFlow.steps.map((step: string, i: number) => (
                                                <div key={i} className="flex gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-blue-200 hover:bg-white transition-all duration-300">
                                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white text-slate-900 font-syne font-black flex items-center justify-center border border-slate-200 shadow-sm group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all">
                                                        {i + 1}
                                                    </div>
                                                    <div className="pt-2">
                                                        <p className="text-slate-700 font-bold leading-snug">{step}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Tools */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Core Technologies</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedFlow.tools && selectedFlow.tools.map((tool: string) => (
                                                <span key={tool} className="px-4 py-2 bg-slate-50 border border-slate-100 text-slate-600 font-bold text-xs rounded-xl flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                    {tool}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Implementation Logic (Hidden until "Implement" is clicked) */}
                                    {(msg === 'implementing' || msg === 'copied') && (
                                        <div className="space-y-6 pt-6 border-t border-slate-100 animate-slide-up">
                                            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                                                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                                                <div className="relative z-10">
                                                    <div className="flex items-center justify-between mb-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Technical Deployment Script</h5>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(`Implement the following workflow logic for ${selectedFlow.platform}:\n\n${selectedFlow.steps?.join('\n')}\n\nConstraints: High efficiency, error handling included.`);
                                                                setMsg('copied');
                                                                setTimeout(() => setMsg('implementing'), 2000);
                                                            }}
                                                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all border border-white/10"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">{msg === 'copied' ? 'check' : 'content_copy'}</span>
                                                            {msg === 'copied' ? 'Copied to Clipboard' : 'Copy Full Logic'}
                                                        </button>
                                                    </div>
                                                    <div className="font-mono text-sm text-slate-300 bg-black/40 p-6 rounded-2xl border border-white/5 leading-relaxed max-h-[300px] overflow-y-auto custom-scrollbar-dark">
                                                        <span className="text-emerald-400 font-bold">// Platform: {selectedFlow.platform}</span><br />
                                                        <span className="text-blue-400 font-bold">const</span> workflowId = "{selectedFlow.id}";<br />
                                                        <span className="text-blue-400 font-bold">const</span> tier = "{selectedFlow.tier || 'Standard'}";<br /><br />
                                                        <span className="text-slate-500">/* Logic: {selectedFlow.name} */</span><br />
                                                        {selectedFlow.steps?.map((s: string, i: number) => (
                                                            <div key={i}><span className="text-slate-500">step_{i + 1}:</span> {s}</div>
                                                        ))}
                                                        <br />
                                                        <span className="text-amber-400">await</span> flow.execute({`{`} <br />
                                                        &nbsp;&nbsp;mode: <span className="text-purple-400">"PRODUCTION"</span>,<br />
                                                        &nbsp;&nbsp;security: <span className="text-purple-400">"ENTERPRISE_READY"</span><br />
                                                        {`}`});
                                                    </div>
                                                    <p className="mt-6 text-xs text-slate-500 font-medium italic">
                                                        Note: This blueprint is optimized for instant deployment via {selectedFlow.platform === 'Custom' ? 'API' : selectedFlow.platform}.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="text-right sm:text-left">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Cost</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-syne font-black text-slate-900">{selectedFlow.price ? `$${selectedFlow.price.toLocaleString()}` : "FREE"}</span>
                                            {(selectedFlow.price || 0) > 0 && <span className="text-xs text-slate-500 font-bold">USD</span>}
                                        </div>
                                    </div>
                                    {selectedFlow.isPremium && (
                                        <div className="h-10 w-[1px] bg-slate-200 hidden sm:block"></div>
                                    )}
                                    {selectedFlow.isPremium && (
                                        <div className="hidden sm:block">
                                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Verified By</p>
                                            <p className="text-xs font-bold text-slate-700">MAB AI Architect</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <button
                                        onClick={() => { setSelectedFlow(null); setMsg(''); }}
                                        className="flex-1 sm:flex-initial px-8 py-4 rounded-2xl bg-white border border-slate-200 text-sm font-black text-slate-600 hover:bg-slate-50 transition-all font-syne uppercase tracking-widest"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => setMsg('implementing')}
                                        className={`flex-1 sm:flex-initial px-8 py-4 rounded-2xl text-sm font-black text-white shadow-2xl transition-all font-syne uppercase tracking-widest flex items-center justify-center gap-3 group relative overflow-hidden ${selectedFlow.tier === 'GEM' ? 'bg-indigo-600 hover:bg-indigo-700' :
                                            selectedFlow.tier === 'GPT' ? 'bg-emerald-600 hover:bg-emerald-700' :
                                                selectedFlow.tier === 'SKILL' ? 'bg-amber-600 hover:bg-amber-700' :
                                                    'bg-slate-900 hover:bg-slate-800'
                                            }`}>
                                        <span className="material-symbols-outlined text-xl group-hover:scale-125 transition-transform">rocket_launch</span>
                                        {(msg === 'implementing' || msg === 'copied') ? 'Deploying...' : 'Buy & Implement'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default MainApp;
