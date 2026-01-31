import React, { useState } from 'react';
import { flowData, AppDepts } from '../lib/data';
import type { UIWorkflow } from '../types/ui';
import type { Workflow as DatabaseWorkflow } from '../types/database';

interface RepositoryViewProps {
    onFlowSelect: (flow: UIWorkflow) => void;
}

const RepositoryView: React.FC<RepositoryViewProps> = ({ onFlowSelect }) => {
    const [filterSearch, setFilterSearch] = useState("");
    const [filterDept, setFilterDept] = useState<Set<string>>(new Set());
    const [filterLevel, setFilterLevel] = useState<Set<string>>(new Set());
    const [filterPlatform, setFilterPlatform] = useState<Set<string>>(new Set());
    const [filterTier, setFilterTier] = useState<Set<string>>(new Set());
    const [filterPriceRange, setFilterPriceRange] = useState<'all' | 'free' | 'paid'>('all');
    const [filterTags, setFilterTags] = useState<Set<string>>(new Set());
    const [userFlows, setUserFlows] = useState<UIWorkflow[]>([]);

    // Load User Flows from DB
    React.useEffect(() => {
        const fetchUserFlows = async () => {
            const { data } = await import('../lib/supabase').then(m => m.supabase.from('workflows').select('*').order('created_at', { ascending: false }));

            if (data) {
                const mapped = data.map((row: DatabaseWorkflow) => {
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
                    } catch { /* Ignore JSON parse errors */ }

                    return {
                        id: `db-${row.id}`,
                        rank: row.rank || 0,
                        name: row.name,
                        category: row.category || meta.level,
                        dept: row.department || meta.dept,
                        tools: row.tools || meta.tools,
                        platform: row.platform || 'Google Workspace',
                        price: row.price || 0,
                        isPremium: row.is_premium || false,
                        tier: row.tier || 'Standard',
                        tags: row.tags || [],
                        steps: (meta as { steps?: string[] }).steps || [],
                        timeSaved: 'Draft',
                        action: row.description && !row.description.startsWith('{') ? row.description : (meta as { desc?: string }).desc || 'Custom Workflow',
                        isUser: true,
                        raw: row
                    };
                });
                setUserFlows(mapped);
            }
        };
        fetchUserFlows();
    }, []);

    // Combine Lists
    const allFlows: UIWorkflow[] = [...userFlows, ...(flowData as unknown as UIWorkflow[])];

    const toggleSet = (set: Set<string>, setter: (s: Set<string>) => void, val: string) => {
        const newSet = new Set(set);
        if (newSet.has(val)) newSet.delete(val);
        else newSet.add(val);
        setter(newSet);
    };

    const filtered = allFlows.filter(flow => {
        const matchesSearch =
            flow.name.toLowerCase().includes(filterSearch.toLowerCase()) ||
            (flow.action || "").toLowerCase().includes(filterSearch.toLowerCase());

        const matchesDept = filterDept.size === 0 || filterDept.has(flow.dept);
        const matchesLevel = filterLevel.size === 0 || filterLevel.has(flow.category);
        const matchesTier = filterTier.size === 0 || filterTier.has(flow.tier || 'Standard');

        const flowPlatform = flow.platform || "Google Workspace";
        const normalizedPlatform = flowPlatform === "Google Workspace Studio" ? "Google Workspace" : flowPlatform;
        const matchesPlatform = filterPlatform.size === 0 || filterPlatform.has(normalizedPlatform);

        const isFree = (flow.price || 0) === 0;
        const matchesPrice = filterPriceRange === 'all' ||
            (filterPriceRange === 'free' && isFree) ||
            (filterPriceRange === 'paid' && !isFree);

        const matchesTags = filterTags.size === 0 || (flow.tags || []).some((t: string) => filterTags.has(t));

        return matchesSearch && matchesDept && matchesLevel && matchesPlatform && matchesPrice && matchesTags && matchesTier;
    }).sort((a, b) => {
        if (a.tier === 'GEM' && b.tier !== 'GEM') return -1;
        if (a.tier !== 'GEM' && b.tier === 'GEM') return 1;
        if (a.isUser && !b.isUser) return -1;
        if (!a.isUser && b.isUser) return 1;
        return (a.rank || 0) - (b.rank || 0);
    });

    return (
        <div className="flex flex-1 overflow-hidden max-w-full mx-auto w-full transition-opacity duration-300 bg-slate-50 font-outfit">
            {/* Sidebar Filters */}
            <aside className="w-80 bg-white border-r border-slate-200 flex-col hidden lg:flex overflow-y-auto custom-scrollbar z-20 shrink-0">
                <div className="p-8 space-y-10">
                    <div>
                        <h2 className="text-2xl font-syne font-extrabold text-slate-900 mb-6 px-1">Filters</h2>
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
                            </span>
                            <input
                                className="pl-12 block w-full rounded-2xl border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 py-4 transition-all"
                                placeholder="Search repository..."
                                type="text"
                                value={filterSearch}
                                onChange={(e) => setFilterSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Tiers Filter */}
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-4 block flex justify-between px-1">
                            Marketplace Tiers
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {['Standard', 'GEM', 'GPT', 'SKILL'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => toggleSet(filterTier, setFilterTier, t)}
                                    className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border ${filterTier.has(t) ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dept Filter */}
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-4 block flex justify-between px-1">
                            Departments
                        </label>
                        <div className="space-y-1">
                            {Object.values(AppDepts).map(d => {
                                const count = allFlows.filter(f => f.dept === d).length;
                                return (
                                    <label key={d} onClick={() => toggleSet(filterDept, setFilterDept, d)} className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all ${filterDept.has(d) ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-600'}`}>
                                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${filterDept.has(d) ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                                            {filterDept.has(d) && <span className="material-symbols-outlined text-[14px] text-white font-bold">check</span>}
                                        </div>
                                        <span className="text-sm font-semibold flex-1">{d}</span>
                                        <span className="text-[10px] font-black opacity-40">{count}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Platform Filter */}
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-4 block flex justify-between px-1">
                            Platforms
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {["Google Workspace", "Microsoft 365", "Slack", "Zapier", "n8n", "Make", "Custom", "API-Based", "Multi-Platform"].map(p => (
                                <button
                                    key={p}
                                    onClick={() => toggleSet(filterPlatform, setFilterPlatform, p)}
                                    className={`px-4 py-2 rounded-full text-[10px] font-bold border transition-all ${filterPlatform.has(p) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Filter */}
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-4 block px-1">Budget</label>
                        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                            {(['all', 'free', 'paid'] as const).map(option => (
                                <button
                                    key={option}
                                    onClick={() => setFilterPriceRange(option)}
                                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${filterPriceRange === option ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto custom-scrollbar relative bg-slate-50 flex flex-col">

                {/* Hero / Header */}
                <header className="p-8 lg:p-12 pb-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-5xl lg:text-6xl font-syne font-black text-slate-900 tracking-tighter mb-4">
                                The <span className="text-blue-600">Universal</span> <br />Repository
                            </h1>
                            <p className="text-slate-500 text-lg max-w-xl font-medium leading-relaxed">
                                Access production-grade automation blueprints, enterprise-ready GEMs, and specialized GPT agents to scale your operations.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-white p-4 lg:p-6 rounded-3xl border border-slate-200 shadow-sm min-w-[160px]">
                                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Assets</span>
                                <span className="text-3xl font-syne font-black text-slate-900">{allFlows.length}</span>
                            </div>
                            <div className="bg-blue-600 p-4 lg:p-6 rounded-3xl text-white shadow-xl shadow-blue-500/20 min-w-[160px]">
                                <span className="block text-[10px] font-black text-blue-200 uppercase tracking-widest mb-2">Market Vol</span>
                                <span className="text-3xl font-syne font-black">${allFlows.reduce((acc, f) => acc + (f.price || 0), 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Status Bar */}
                <div className="px-8 lg:px-12 mb-8 flex items-center justify-between transition-all">
                    <div className="flex items-center gap-4 text-sm font-bold text-slate-400">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> {filtered.length.toLocaleString()} Blueprints Displayed</span>
                        <span className="hidden md:inline">|</span>
                        <span className="hidden md:flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Marketplace 2.0 Certified</span>
                    </div>
                    {(filterDept.size > 0 || filterLevel.size > 0 || filterPlatform.size > 0 || filterTier.size > 0 || filterSearch) && (
                        <button
                            onClick={() => {
                                setFilterDept(new Set()); setFilterLevel(new Set());
                                setFilterPlatform(new Set()); setFilterTier(new Set());
                                setFilterSearch(""); setFilterTags(new Set());
                            }}
                            className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline"
                        >
                            Reset Filters
                        </button>
                    )}
                </div>

                {/* Results Grid */}
                <div className="px-8 lg:px-12 pb-24">
                    {filtered.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                            {filtered.map((flow, idx) => {
                                const isPremium = flow.isPremium || flow.tier === 'GEM' || flow.tier === 'GPT';
                                const tierColor = flow.tier === 'GEM' ? 'from-amber-400 to-orange-600' :
                                    flow.tier === 'GPT' ? 'from-emerald-400 to-teal-600' :
                                        flow.tier === 'SKILL' ? 'from-purple-500 to-indigo-600' : 'from-slate-700 to-slate-900';

                                return (
                                    <div
                                        key={flow.id}
                                        onClick={() => onFlowSelect(flow)}
                                        className={`group relative bg-white rounded-[2rem] border-2 transition-all duration-500 cursor-pointer overflow-hidden reveal-stagger ${idx < 20 ? `stagger-${idx + 1}` : ''} ${isPremium ? 'border-slate-900 shadow-xl' : 'border-transparent shadow-sm hover:shadow-xl hover:border-slate-200'}`}
                                    >
                                        {/* Premium Header / Bar */}
                                        <div className={`h-2 w-full bg-gradient-to-r ${tierColor}`}></div>

                                        <div className="p-8 pb-10 flex flex-col h-full">
                                            {/* Meta Header */}
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-3 py-1 bg-slate-100 text-[9px] font-black text-slate-500 uppercase tracking-widest rounded-full">{flow.dept}</span>
                                                        {flow.tier && flow.tier !== 'Standard' && (
                                                            <span className={`px-3 py-1 bg-gradient-to-r ${tierColor} text-[9px] font-black text-white uppercase tracking-widest rounded-full shadow-sm`}>{flow.tier}</span>
                                                        )}
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[12px]">layers</span>
                                                        {flow.platform}
                                                    </span>
                                                </div>
                                                <div className={`px-4 py-2 rounded-2xl text-xs font-black shadow-sm ${isPremium ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                                    {flow.price ? `$${flow.price.toLocaleString()}` : "FREE"}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 space-y-4">
                                                <h3 className="text-2xl font-syne font-black text-slate-900 leading-[1.1] group-hover:text-blue-600 transition-colors">
                                                    {flow.name}
                                                </h3>
                                                <p className="text-slate-500 text-sm font-medium line-clamp-3 leading-relaxed">
                                                    {flow.action}
                                                </p>
                                            </div>

                                            {/* Footer Info */}
                                            <div className="pt-8 mt-6 border-t border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-sm text-slate-400">bolt</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Efficiency</span>
                                                        <span className="text-[11px] font-bold text-slate-700">{flow.timeSaved || 'Standard'}</span>
                                                    </div>
                                                </div>
                                                <div className="material-symbols-outlined text-slate-200 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all">arrow_forward</div>
                                            </div>
                                        </div>

                                        {/* Hover Overlay for Standard items */}
                                        {!isPremium && <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-4xl text-slate-300">search_off</span>
                            </div>
                            <h3 className="text-2xl font-syne font-black text-slate-900 mb-2">No Matching Blueprints</h3>
                            <p className="text-slate-500 font-medium">Try adjusting your filters or search query.</p>
                            <button
                                onClick={() => {
                                    setFilterDept(new Set()); setFilterLevel(new Set());
                                    setFilterPlatform(new Set()); setFilterTier(new Set());
                                    setFilterSearch("");
                                }}
                                className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all"
                            >
                                Clear All
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default RepositoryView;
