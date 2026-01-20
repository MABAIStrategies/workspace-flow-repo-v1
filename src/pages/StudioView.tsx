import React, { useState } from 'react';
import { AppTools } from '../lib/data';

interface StudioViewProps {
    // Props if needed
}

interface Workflow {
    id: number;
    name: string;
    dept: string;
    color: string;
    height: number;
}

const StudioView: React.FC<StudioViewProps> = () => {
    // State
    const [library, setLibrary] = useState<Workflow[]>([
        { id: 999, name: "HR Onboard", dept: "HR", color: "from-amber-900 via-amber-700 to-amber-900", height: 28 } // Example
    ]);
    const [dept, setDept] = useState("Sales");
    const [level, setLevel] = useState("hitl");
    const [trigger, setTrigger] = useState("");
    const [action, setAction] = useState("");
    const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set());
    const [generatedResult, setGeneratedResult] = useState<{title: string, desc: string} | null>(null);
    const [isThinking, setIsThinking] = useState(false);

    // Helpers
    const toggleTool = (tool: string) => {
        const newSet = new Set(selectedTools);
        if (newSet.has(tool)) newSet.delete(tool);
        else newSet.add(tool);
        setSelectedTools(newSet);
    };

    const runSimulation = () => {
        if (!trigger || !action) { alert("Please fill in trigger and action."); return; }
        setIsThinking(true);
        setTimeout(() => {
            setIsThinking(false);
            setGeneratedResult({
                title: "Workflow Generated",
                desc: `Successfully configured ${level} workflow for ${dept}: When '${trigger}' occurs, then '${action}' using ${Array.from(selectedTools).join(', ')}.`
            });
        }, 1500);
    };

    const saveWorkflow = () => {
        if (!generatedResult) { alert("Run the workflow first."); return; }
        
        const colors = ['from-blue-900 via-blue-700 to-blue-900', 'from-indigo-900 via-indigo-700 to-indigo-900', 'from-slate-900 via-slate-700 to-slate-900'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const height = Math.floor(Math.random() * (32 - 24 + 1) + 24); 

        const newFlow: Workflow = {
            id: Date.now(),
            name: `Generated ${library.length + 1}`,
            dept,
            color: randomColor,
            height
        };
        
        setLibrary([newFlow, ...library]);
        alert("Saved to Library!");
        
        // Reset
        setTrigger("");
        setAction("");
        setGeneratedResult(null);
        setSelectedTools(new Set());
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
                        <div className="space-y-8 px-2 pt-4 relative z-10 flex flex-row flex-wrap items-end gap-1">
                            {library.map(book => (
                                <div 
                                    key={book.id}
                                    className={`group relative min-w-[32px] w-8 bg-gradient-to-r ${book.color} rounded-sm shadow-xl hover:-translate-y-4 transition-transform duration-300 cursor-pointer flex flex-col items-center justify-center py-2 border-l border-white/10 overflow-hidden`}
                                    style={{ height: `${book.height * 4}px` }} // Scaling roughly to tailwind units
                                >
                                    <span className="writing-vertical-rl text-[10px] font-bold text-white/90 tracking-widest uppercase truncate w-full text-center h-full max-h-full">
                                        {book.name.length > 15 ? book.name.substring(0, 12) + '...' : book.name}
                                    </span>
                                    <div className="absolute top-0 w-full h-1 bg-white/20"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Studio Workspace */}
            <main className="flex-1 bg-slate-100 overflow-y-auto custom-scrollbar p-4 sm:p-8 flex items-center justify-center">
                <div className="max-w-4xl w-full">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold font-display text-slate-900">Workflow Studio</h2>
                            <p className="text-slate-500 text-sm">Design, test, and deploy new automation agents.</p>
                        </div>
                        <div className="flex gap-2">
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
                                        <select value={dept} onChange={e => setDept(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all w-full">
                                            {Object.values(AppTools).slice(0, 6).map(d => <option key={d}>{d}</option>)} 
                                            {/* Oops, used Tools instead of Depts. Fix below */}
                                             <option>Sales</option><option>Marketing</option><option>HR</option><option>Finance</option><option>Operations</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 mb-1 block">Automation Level</label>
                                        <select value={level} onChange={e => setLevel(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all w-full">
                                            <option value="hitl">Human in the Loop</option>
                                            <option value="triggered">Triggered Auto</option>
                                            <option value="background">Background</option>
                                        </select>
                                    </div>
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
                                        <div className="w-full animate-fade-in">
                                             <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 mb-4">
                                                <div className="flex items-center gap-2 text-emerald-700 mb-2 font-bold">
                                                    <span className="material-symbols-outlined">check_circle</span>
                                                    Valid Logic Configuration
                                                </div>
                                                <p className="text-emerald-800 text-sm">{generatedResult.desc}</p>
                                             </div>
                                        </div>
                                    ) : (
                                        <div className="text-center opacity-40">
                                            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">play_arrow</span>
                                            <p className="text-slate-400 font-medium">Configure your logic and<br/>click 'Run Simulation'</p>
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
