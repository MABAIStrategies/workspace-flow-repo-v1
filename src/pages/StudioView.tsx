import React, { useState } from 'react';
import { AppTools, AppDepts } from '../lib/data';
import type { Platform } from '../types/database';

// Props interface removed - component takes no props

interface Workflow {
    id: number;
    name: string;
    dept: string;
    color: string;
    height: number;
}

const StudioView: React.FC = () => {
    // State
    const [library, setLibrary] = useState<Workflow[]>([]);
    const [dept, setDept] = useState("Sales");
    const [level, setLevel] = useState("hitl");
    const [trigger, setTrigger] = useState("");
    const [action, setAction] = useState("");
    const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set());
    const [platform, setPlatform] = useState<Platform>("Google Workspace");
    const [price, setPrice] = useState<number>(0);
    const [isPremium, setIsPremium] = useState(false);
    const [tags, setTags] = useState<string>("");
    // Updated Result State to hold full object
    const [generatedResult, setGeneratedResult] = useState<{ title: string, desc: string, steps: string[], platform?: string, implementationPrompt?: string } | null>(null);
    const [isThinking, setIsThinking] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isPublic, setIsPublic] = useState(false);

    // Initial Fetch (Library)
    React.useEffect(() => {
        const fetchLibrary = async () => {
            const { data } = await import('../lib/supabase').then(m => m.supabase.from('workflows').select('*').order('created_at', { ascending: false }));
            if (data) {
                setLibrary(data.map((row: { id: number; name: string; description: string }) => {
                    let meta = { dept: 'General', color: 'from-slate-900', height: 28 };
                    try { meta = JSON.parse(row.description).meta || meta; } catch { /* Ignore parse errors */ }
                    return { id: row.id, name: row.name, dept: meta.dept, color: meta.color, height: meta.height };
                }));
            }
        };
        fetchLibrary();
    }, []);

    // Helpers
    const toggleTool = (tool: string) => {
        const newSet = new Set(selectedTools);
        if (newSet.has(tool)) newSet.delete(tool);
        else newSet.add(tool);
        setSelectedTools(newSet);
    };

    const runSimulation = async () => {
        if (!trigger || !action) { alert("Please fill in trigger and action."); return; }
        setIsThinking(true);

        try {
            const { generateWorkflow } = await import('../lib/gemini');
            const result = await generateWorkflow(`${trigger} -> ${action}`, dept, level, Array.from(selectedTools), platform);

            setGeneratedResult(result);
        } catch (e) {
            alert("AI Error: " + e);
            // Fallback for demo if key fails
            setGeneratedResult({
                title: "Manual Workflow",
                desc: `Configured ${level} workflow for ${dept}: ${trigger} -> ${action}.`,
                steps: ["Trigger detected", "Action executed"]
            });
        } finally {
            setIsThinking(false);
        }
    };

    const saveWorkflow = async () => {
        if (!generatedResult) { alert("Run the workflow first."); return; }

        const colors = ['from-blue-900 via-blue-700 to-blue-900', 'from-indigo-900 via-indigo-700 to-indigo-900', 'from-slate-900 via-slate-700 to-slate-900', 'from-emerald-900 via-emerald-700 to-emerald-900'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const height = Math.floor(Math.random() * (32 - 24 + 1) + 24);

        const { supabase } = await import('../lib/supabase');
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) { alert("You must be logged in to save."); return; }

        const metaPayload = {
            desc: generatedResult.desc,
            meta: { dept, color: randomColor, height, tools: Array.from(selectedTools), level },
            steps: generatedResult.steps
        };

        // Parse tags from comma-separated string
        const tagsArray = tags.trim() ? tags.split(',').map(t => t.trim()).filter(t => t.length > 0) : [];

        const workflowData = {
            user_id: user.id,
            name: generatedResult.title || "New Workflow",
            description: JSON.stringify(metaPayload),
            department: dept,
            category: level,
            tools: Array.from(selectedTools),
            platform: platform,
            price: price,
            is_premium: isPremium,
            tags: tagsArray,
            is_public: isPublic
        };

        const { data, error } = editingId
            ? await supabase.from('workflows').update(workflowData).eq('id', editingId).select().single()
            : await supabase.from('workflows').insert(workflowData).select().single();

        if (error) {
            alert("Error saving: " + error.message);
        } else {
            if (editingId) {
                setLibrary(library.map(b => b.id === data.id ? { ...b, name: data.name, dept, color: randomColor, height } : b));
            } else {
                setLibrary([{ id: data.id, name: data.name, dept, color: randomColor, height }, ...library]);
            }
            alert(isPublic ? "Saved & Published to Marketplace!" : "Saved to Studio Library!");
            resetStudio();
        }
    };

    const resetStudio = () => {
        setEditingId(null);
        setTrigger("");
        setAction("");
        setGeneratedResult(null);
        setSelectedTools(new Set());
        setIsPublic(false);
        setPrice(0);
        setIsPremium(false);
        setTags("");
        setDept("Sales");
        setLevel("hitl");
        setPlatform("Google Workspace");
    };

    const loadWorkflow = async (id: number) => {
        const { supabase } = await import('../lib/supabase');
        const { data, error } = await supabase.from('workflows').select('*').eq('id', id).single();

        if (data && !error) {
            setEditingId(data.id);
            setDept(data.department || "Sales");
            setLevel(data.category || "hitl");
            setPlatform(data.platform || "Google Workspace");
            setPrice(data.price || 0);
            setIsPremium(data.is_premium || false);
            setTags(data.tags ? data.tags.join(', ') : "");
            setSelectedTools(new Set(data.tools || []));

            let desc = "";
            let steps = [];
            try {
                const parsed = JSON.parse(data.description);
                desc = parsed.desc || "";
                steps = parsed.steps || [];
            } catch { /* Ignore parse errors */ }

            setGeneratedResult({
                title: data.name,
                desc: desc,
                steps: steps,
                platform: data.platform
            });
        }
    };

    const deleteWorkflow = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this workflow?")) return;

        const { supabase } = await import('../lib/supabase');
        const { error } = await supabase.from('workflows').delete().eq('id', id);

        if (error) {
            alert("Error deleting: " + error.message);
        } else {
            setLibrary(library.filter(b => b.id !== id));
            if (editingId === id) resetStudio();
        }
    };

    return (
        <div className="flex flex-1 overflow-hidden transition-opacity duration-300">
            {/* Library Shelf Sidebar */}
            <aside className="w-64 relative hidden md:flex flex-col border-r border-slate-300 z-20 shadow-2xl">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img src="/Images/library_shelf_bg.png" className="w-full h-full object-cover opacity-90" alt="Shelf" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80 mix-blend-multiply"></div>
                </div>

                {/* Shelf Content */}
                <div className="relative z-10 flex flex-col h-full">
                    <div className="p-4 bg-black/40 backdrop-blur-sm border-b border-white/10">
                        <h2 className="text-white font-display font-bold text-lg flex items-center gap-2">
                            <span className="material-symbols-outlined text-amber-400">shelves</span>
                            My Library
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
                        {/* Shelf Rows (Visual) */}
                        <div className="absolute inset-0 flex flex-col justify-evenly px-4 py-8 pointer-events-none opacity-20">
                            {[1, 2, 3, 4].map(i => <div key={i} className="h-2 bg-black/50 shadow-inner w-full"></div>)}
                        </div>

                        {/* Books */}
                        <div className="space-y-4 px-2 pt-4 relative z-10 flex flex-row flex-wrap items-end gap-2">
                            {library.map((book, idx) => (
                                <div
                                    key={book.id}
                                    onClick={() => loadWorkflow(book.id)}
                                    className={`group relative min-w-[32px] w-8 bg-gradient-to-r ${book.color} rounded-sm shadow-xl hover:-translate-y-4 transition-transform duration-300 cursor-pointer flex flex-col items-center justify-center py-2 border-l border-white/10 overflow-hidden book-h-${book.height} ${editingId === book.id ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black/50 glow-amber' : ''} ${idx % 3 === 0 ? 'texture-leather' : idx % 3 === 1 ? 'texture-carbon' : ''}`}
                                >
                                    <span className="writing-vertical-rl text-[10px] font-bold text-white/90 tracking-widest uppercase truncate w-full text-center h-full max-h-full">
                                        {book.name.length > 15 ? book.name.substring(0, 12) + '...' : book.name}
                                    </span>
                                    <div className="absolute top-0 w-full h-1 bg-white/20"></div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={(e) => deleteWorkflow(e, book.id)}
                                        className="absolute bottom-1 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-red-400"
                                    >
                                        <span className="material-symbols-outlined text-xs">delete</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Studio Workspace */}
            <main className="flex-1 bg-slate-100 overflow-y-auto custom-scrollbar p-4 sm:p-8 flex items-start justify-center">
                <div className="max-w-7xl w-full">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold font-display text-slate-900">
                                {editingId ? 'Editing Workflow' : 'Workflow Studio'}
                                {editingId && <span className="ml-2 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-tighter align-middle">ID: {editingId}</span>}
                            </h2>
                            <p className="text-slate-500 text-sm">Design, test, and deploy new automation agents.</p>
                        </div>
                        <button
                            onClick={resetStudio}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <span className="material-symbols-outlined text-sm">add</span> New Workflow
                        </button>
                        <div className="flex gap-2 items-center">
                            <label className="flex items-center gap-2 mr-2 cursor-pointer">
                                <span className="text-xs font-bold text-slate-500 uppercase">Publish?</span>
                                <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                            </label>
                            <button className="px-4 py-2 bg-white border border-slate-300 text-xs font-bold text-slate-600 rounded-lg hover:bg-slate-50">Clear</button>
                            <button onClick={saveWorkflow} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-lg hover:bg-slate-800 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">save</span> Save
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Configuration Column */}
                        <div className="space-y-6">
                            {/* System Config */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">tune</span> System Configuration
                                </h3>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="text-xs text-slate-500 mb-1 block">Department</label>
                                        <select aria-label="Department" value={dept} onChange={e => setDept(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all w-full">
                                            {Object.values(AppDepts).map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 mb-1 block">Automation Level</label>
                                        <select aria-label="Automation Level" value={level} onChange={e => setLevel(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all w-full">
                                            <option value="hitl">Human in the Loop</option>
                                            <option value="triggered">Triggered Auto</option>
                                            <option value="background">Background</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="text-xs text-slate-500 mb-1 block">Target Platform</label>
                                    <select aria-label="Target Platform" value={platform} onChange={e => setPlatform(e.target.value as Platform)} className="bg-slate-900 text-white border-0 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all w-full font-bold">
                                        <option value="Google Workspace">Google Workspace</option>
                                        <option value="Microsoft 365">Microsoft 365</option>
                                        <option value="Slack">Slack</option>
                                        <option value="Zapier">Zapier</option>
                                        <option value="n8n">n8n</option>
                                        <option value="Make">Make</option>
                                        <option value="Custom">Custom</option>
                                        <option value="API-Based">API-Based</option>
                                        <option value="Multi-Platform">Multi-Platform</option>
                                    </select>

                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 mb-1 block">Integrated Tools</label>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.values(AppTools).map(tool => (
                                            <button
                                                key={tool}
                                                onClick={() => toggleTool(tool)}
                                                className={`px-2 py-1 rounded text-xs font-bold border transition-all ${selectedTools.has(tool) ? 'bg-blue-100 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-blue-300'}`}
                                            >
                                                {tool}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Pricing & Tags */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">sell</span> Pricing & Tags
                                </h3>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="text-xs text-slate-500 mb-1 block">Price (USD)</label>
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={e => setPrice(parseFloat(e.target.value) || 0)}
                                            min="0"
                                            step="0.01"
                                            className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all w-full"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 w-full hover:bg-slate-100 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={isPremium}
                                                onChange={e => setIsPremium(e.target.checked)}
                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-xs font-semibold text-slate-700">Premium Workflow</span>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 mb-1 block">Tags (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={tags}
                                        onChange={e => setTags(e.target.value)}
                                        className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all w-full"
                                        placeholder="e.g. automation, email, crm"
                                    />
                                </div>
                            </div>

                            {/* Trigger Logic */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">bolt</span> Trigger & Action Logic
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-700">Trigger Event</label>
                                        <input value={trigger} onChange={e => setTrigger(e.target.value)} type="text" className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all w-full mt-1 font-mono" placeholder="e.g. New row added to 'Clients' Sheet" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-700">Action Chain</label>
                                        <textarea value={action} onChange={e => setAction(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all w-full mt-1 font-mono h-32 resize-none" placeholder="e.g. 1. Create Folder&#10;2. Draft Email"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Results Column */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-lg border border-slate-200 h-full min-h-[500px] flex flex-col relative overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Simulation Output</span>
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                    </div>
                                </div>
                                <div className="flex-1 p-8 flex flex-col items-center justify-center relative">
                                    {isThinking ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-slate-500 font-mono text-sm animate-pulse">Running Logic Simulation...</span>
                                        </div>
                                    ) : generatedResult ? (
                                        <div className="w-full animate-fade-in overflow-y-auto max-h-[400px] custom-scrollbar">
                                            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2 text-emerald-700 font-bold">
                                                        <span className="material-symbols-outlined">check_circle</span>
                                                        {generatedResult.title || 'Workflow Ready'}
                                                    </div>
                                                    {generatedResult.platform && (
                                                        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full uppercase">{generatedResult.platform}</span>
                                                    )}
                                                </div>
                                                <p className="text-emerald-800 text-sm mb-3">{generatedResult.desc}</p>
                                                {generatedResult.steps && generatedResult.steps.length > 0 && (
                                                    <div className="border-t border-emerald-200 pt-3 mt-2">
                                                        <p className="text-xs font-bold text-emerald-700 uppercase mb-2">Steps:</p>
                                                        <ol className="list-decimal list-inside space-y-1 text-sm text-emerald-800">
                                                            {generatedResult.steps.map((step: string, i: number) => <li key={i}>{step}</li>)}
                                                        </ol>
                                                    </div>
                                                )}
                                            </div>
                                            {generatedResult.implementationPrompt && (
                                                <div className="bg-slate-800 rounded-lg p-4 text-white">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-xs font-bold text-slate-400 uppercase">Implementation Prompt</p>
                                                        <button onClick={() => { navigator.clipboard.writeText(generatedResult.implementationPrompt || ''); alert('Copied!'); }} className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-sm">content_copy</span> Copy
                                                        </button>
                                                    </div>
                                                    <p className="text-sm font-mono text-slate-200 whitespace-pre-wrap">{generatedResult.implementationPrompt}</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center opacity-40">
                                            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">play_arrow</span>
                                            <p className="text-slate-400 font-medium">Configure your logic and<br />click 'Run Simulation'</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 border-t border-slate-200 bg-slate-50 sticky bottom-0">
                                    <button onClick={runSimulation} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group">
                                        <span className="material-symbols-outlined group-hover:rotate-180 transition-transform">sync</span>
                                        Run Simulation
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudioView;
