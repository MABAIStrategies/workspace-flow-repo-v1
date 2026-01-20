import React, { useState } from 'react';
import { flowData } from '../lib/data';

interface RepositoryViewProps {
  onFlowSelect: (flow: any) => void;
}

const RepositoryView: React.FC<RepositoryViewProps> = ({ onFlowSelect }) => {
  const [filterSearch, setFilterSearch] = useState("");
  // In a real app, these would be managed by a more complex filter state or context
  // const [filterDept, setFilterDept] = useState<string[]>([]);
  
  const filtered = flowData.filter(flow => 
    flow.name.toLowerCase().includes(filterSearch.toLowerCase()) || 
    flow.action.toLowerCase().includes(filterSearch.toLowerCase())
  ).sort((a, b) => a.rank - b.rank);

  return (
    <div className="flex flex-1 overflow-hidden max-w-[1920px] mx-auto w-full transition-opacity duration-300">
      {/* Sidebar Filters - Static for Phase 2 MVP */}
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
            {/* Filter sections would go here (Dept, Level, Tools) */}
            <div className="text-blue-200 text-sm italic">Filters enabled in next update...</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 overflow-y-auto custom-scrollbar p-4 sm:p-8 relative">
          
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 bg-white/10 w-24 h-24 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                    <div className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">Total Efficiency Gain</div>
                    <div className="text-4xl font-display font-bold">~140 hrs</div>
                    <div className="text-blue-100 text-sm mt-1 opacity-80">Per month / employee</div>
                </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Active Scenarios</div>
                <div className="text-4xl font-display font-bold text-slate-800">{flowData.length}</div>
                <div className="text-emerald-600 text-xs font-bold mt-2 flex items-center bg-emerald-50 w-fit px-2 py-1 rounded-full">
                    <span className="material-symbols-outlined text-sm mr-1">trending_up</span> 15 New Added
                </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Top ROI Category</div>
                <div className="text-4xl font-display font-bold text-slate-800">Finance</div>
                <div className="text-slate-500 text-sm mt-1">Automated invoicing & disputes</div>
            </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pb-20">
          {filtered.map(flow => {
            let accentColor = "slate";
            let badgeText = "Background";
            if (flow.category === "hitl") { accentColor = "amber"; badgeText = "Human Loop"; }
            else if (flow.category === "triggered") { accentColor = "blue"; badgeText = "Triggered"; }

            // Tailwind doesn't support dynamic class interpolation easily without safelisting 
            // So we use standard classes for simplicity in this port, or inline styles/helper function
            // For MVP: simplified colors
            const badgeClass = flow.category === "hitl" ? "bg-amber-50 text-amber-600" : (flow.category === "triggered" ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-600");
            const barClass = flow.category === "hitl" ? "bg-amber-500" : (flow.category === "triggered" ? "bg-blue-500" : "bg-slate-500");

            return (
                <div key={flow.id} onClick={() => onFlowSelect(flow)} className="group bg-white rounded-2xl shadow-sm border border-slate-200 p-0 cursor-pointer card-hover transition-all-300 flex flex-col h-full relative overflow-hidden">
                    <div className={`h-1.5 w-full ${barClass}`}></div>
                    <div className="p-6 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-4">
                            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600 ring-1 ring-inset ring-slate-200 uppercase tracking-wider">{flow.dept}</span>
                            <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined text-[18px] text-slate-400">integration_instructions</span>
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
