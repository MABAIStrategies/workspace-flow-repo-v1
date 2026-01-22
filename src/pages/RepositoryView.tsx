import React, { useState } from 'react';
import { flowData } from '../lib/data';

interface RepositoryViewProps {
    onFlowSelect: (flow: any) => void;
}

const RepositoryView: React.FC<RepositoryViewProps> = ({ onFlowSelect }) => {
    const [filterSearch, setFilterSearch] = useState("");
    const [filterDept, setFilterDept] = useState<Set<string>>(new Set());
    const [filterLevel, setFilterLevel] = useState<Set<string>>(new Set());
    const [filterPlatform, setFilterPlatform] = useState<Set<string>>(new Set());
    const [userFlows, setUserFlows] = useState<any[]>([]);

    // Load User Flows from DB
    React.useEffect(() => {
        const fetchUserFlows = async () => {
            const { data } = await import('../lib/supabase').then(m => m.supabase.from('workflows').select('*').order('created_at', { ascending: false }));

            if (data) {
                const mapped = data.map((row: any) => {
                    // Parse metadata
                    let meta = { dept: 'General', level: 'hitl', tools: [] };
                    try {
                        if (row.description && row.description.startsWith('{')) {
                            const parsed = JSON.parse(row.description);
                            if (parsed.meta) {
                                meta = {
                                    dept: parsed.meta.dept || 'General',
                                    level: parsed.meta.level || 'hitl',
                                    tools: parsed.meta.tools || []
                                };
                            }
                        }
                    } catch (e) { }

                    return {
                        id: `db-${row.id}`, // specific ID format
                        rank: 0, // Top rank
                        name: row.name,
                        category: meta.level,
                        dept: meta.dept,
                        tools: meta.tools,
                        platform: row.platform || 'Google Workspace Studio',
                        timeSaved: 'Draft',
                        action: 'Custom Workflow',
                        isUser: true // Flag for UI
                    };
                });
                setUserFlows(mapped);
            }
        };
        fetchUserFlows();
    }, []);

    // Combine Lists
    const allFlows = [...userFlows, ...flowData];

    const toggleDept = (dept: string) => {
        const newSet = new Set(filterDept);
        if (newSet.has(dept)) newSet.delete(dept);
        else newSet.add(dept);
        setFilterDept(newSet);
    };

    const toggleLevel = (cat: string) => {
        const newSet = new Set(filterLevel);
        if (newSet.has(cat)) newSet.delete(cat);
        else newSet.add(cat);
        setFilterLevel(newSet);
    };

    const togglePlatform = (p: string) => {
        const newSet = new Set(filterPlatform);
        if (newSet.has(p)) newSet.delete(p);
        else newSet.add(p);
        setFilterPlatform(newSet);
    };

    const filtered = allFlows.filter(flow => {
        const matchesSearch = flow.name.toLowerCase().includes(filterSearch.toLowerCase()) ||
            flow.action.toLowerCase().includes(filterSearch.toLowerCase());
        const matchesDept = filterDept.size === 0 || filterDept.has(flow.dept);
        const matchesLevel = filterLevel.size === 0 || filterLevel.has(flow.category);
        const matchesPlatform = filterPlatform.size === 0 || filterPlatform.has(flow.platform || "Google Workspace Studio");

        return matchesSearch && matchesDept && matchesLevel && matchesPlatform;
    }).sort((a, b) => {
        // User flows first, then rank
        if (a.isUser && !b.isUser) return -1;
        if (!a.isUser && b.isUser) return 1;
        return a.rank - b.rank;
    });

    return (
        <div className="flex flex-1 overflow-hidden max-w-[1920px] mx-auto w-full transition-opacity duration-300">
            {/* Sidebar Filters - Functional Phase 2 */}
            <aside className="w-80 bg-gradient-to-b from-blue-600 to-indigo-700 border-r border-blue-800 flex-col hidden md:flex overflow-y-auto custom-scrollbar z-20 text-white">
                <div className="p-6 space-y-8">
                    <div>
                        <label className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-3 block">Search Repository</label>
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-blue-300 text-xl">search</span>
                            </span>
                            <input
                                className="pl-10 block w-full rounded-xl border-white/20 bg-white/10 text-sm text-white placeholder-blue-200/50 focus:border-white focus:ring-white/20 py-3 transition-shadow"
                                placeholder="e.g. 'Invoice' or 'Lead'..."
                                type="text"
                                value={filterSearch}
                                onChange={(e) => setFilterSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Dept Filter */}
                    <div>
                        <label className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-3 block flex justify-between">
                            Departments
                            {filterDept.size > 0 && <span onClick={() => setFilterDept(new Set())} className="text-[10px] underline cursor-pointer hover:text-white">Clear</span>}
                        </label>
                        <div className="space-y-2">
                            {["Sales", "Marketing", "HR", "Operations", "Finance", "Executive", "IT/Eng"].map(d => (
                                <label key={d} onClick={() => toggleDept(d)} className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-2 rounded-lg transition-colors">
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${filterDept.has(d) ? 'bg-white border-white' : 'border-blue-300/50 group-hover:border-white/80'}`}>
                                        {filterDept.has(d) && <span className="material-symbols-outlined text-[10px] text-blue-600 font-bold">check</span>}
                                    </div>
                                    <span className={`text-sm ${filterDept.has(d) ? 'text-white font-bold' : 'text-blue-100 group-hover:text-white'}`}>{d}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Level Filter */}
                    <div>
                        <label className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-3 block flex justify-between">
                            Automation Level
                            {filterLevel.size > 0 && <span onClick={() => setFilterLevel(new Set())} className="text-[10px] underline cursor-pointer hover:text-white">Clear</span>}
                        </label>
                        <div className="space-y-2">
                            {[
                                { id: 'hitl', label: 'Human in the Loop', icon: 'person' },
                                { id: 'triggered', label: 'Triggered Auto', icon: 'bolt' },
                                { id: 'background', label: 'Background', icon: 'settings_suggest' }
                            ].map(l => (
                                <label key={l.id} onClick={() => toggleLevel(l.id)} className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg border transition-all ${filterLevel.has(l.id) ? 'bg-white/10 border-white/40 shadow-sm' : 'border-transparent hover:bg-white/5'}`}>
                                    <span className="material-symbols-outlined text-sm text-blue-200">{l.icon}</span>
                                    <span className="text-sm text-blue-100 flex-1">{l.label}</span>
                                    {filterLevel.has(l.id) && <span className="w-2 h-2 rounded-full bg-emerald-400 box-shadow-glow"></span>}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Platform Filter */}
                    <div>
                        <label className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-3 block flex justify-between">
                            Platform
                            {filterPlatform.size > 0 && <span onClick={() => setFilterPlatform(new Set())} className="text-[10px] underline cursor-pointer hover:text-white">Clear</span>}
                        </label>
                        <div className="space-y-1">
                            {["Google Workspace Studio", "OpenAI GPT", "GEM (Custom Agent)", "Zapier / IFTTT", "Mac / iOS Shortcut", "Power Automate / AppSheet", "Opal / Toolhouse"].map(p => (
                                <label key={p} onClick={() => togglePlatform(p)} className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-2 rounded-lg transition-colors">
                                    <div className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all ${filterPlatform.has(p) ? 'bg-emerald-400 border-emerald-400' : 'border-blue-300/50 group-hover:border-white/80'}`}>
                                    </div>
                                    <span className={`text-[11px] ${filterPlatform.has(p) ? 'text-white font-bold' : 'text-blue-100 group-hover:text-white'}`}>{p}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-slate-50 overflow-y-auto custom-scrollbar p-4 sm:p-8 relative">

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 bg-white/10 w-24 h-24 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <div className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">Total Workflows</div>
                            <div className="text-4xl font-display font-bold">{allFlows.length}</div>
                            <div className="text-blue-100 text-sm mt-1 opacity-80">In your repository</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Your Workflows</div>
                        <div className="text-4xl font-display font-bold text-slate-800">{userFlows.length}</div>
                        <div className="text-emerald-600 text-xs font-bold mt-2 flex items-center bg-emerald-50 w-fit px-2 py-1 rounded-full">
                            <span className="material-symbols-outlined text-sm mr-1">folder</span> Saved in Library
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Top Category</div>
                        <div className="text-4xl font-display font-bold text-slate-800">Sales</div>
                        <div className="text-slate-500 text-sm mt-1">Lead routing & proposals</div>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pb-20">
                    {filtered.map(flow => {
                        let badgeText = "Background";
                        if (flow.category === "hitl") { badgeText = "Human Loop"; }
                        else if (flow.category === "triggered") { badgeText = "Triggered"; }

                        // Override for User Flows
                        if ((flow as any).isUser) badgeText = "My Flow";

                        // Tailwind doesn't support dynamic class interpolation easily without safelisting 
                        // So we use standard classes for simplicity in this port, or inline styles/helper function
                        // For MVP: simplified colors
                        const badgeClass = (flow as any).isUser ? "bg-purple-100 text-purple-700 ring-1 ring-purple-500/20" : (flow.category === "hitl" ? "bg-amber-50 text-amber-600" : (flow.category === "triggered" ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-600"));
                        const barClass = (flow as any).isUser ? "bg-purple-600" : (flow.category === "hitl" ? "bg-amber-500" : (flow.category === "triggered" ? "bg-blue-500" : "bg-slate-500"));

                        return (
                            <div key={flow.id} onClick={() => onFlowSelect(flow)} className="group bg-white rounded-2xl shadow-sm border border-slate-200 p-0 cursor-pointer card-hover transition-all-300 flex flex-col h-full relative overflow-hidden">
                                <div className={`h-1.5 w-full ${barClass}`}></div>
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600 ring-1 ring-inset ring-slate-200 uppercase tracking-wider w-fit">{flow.dept}</span>
                                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tight flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[12px]">hub</span>
                                                {flow.platform || "Google Workspace Studio"}
                                            </span>
                                        </div>
                                        <div className="bg-slate-900 text-white px-2 py-1 rounded-md text-[10px] font-bold shadow-sm">
                                            {flow.price ? `$${flow.price.toFixed(2)}` : "FREE"}
                                        </div>
                                    </div>
                                    <h4 className="font-display font-bold text-slate-900 text-xl leading-tight group-hover:text-blue-600 transition-colors mb-2">{flow.name}</h4>
                                    <p className="text-sm text-slate-500 line-clamp-2 mb-6 flex-1 font-medium">{flow.action}</p>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                                        <div className={`flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${badgeClass}`}>
                                            {badgeText}
                                        </div>
                                        <div className="text-xs text-slate-400 font-bold flex items-center">
                                            <span className="material-symbols-outlined text-sm mr-1">timelapse</span>
                                            {flow.timeSaved}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default RepositoryView;
