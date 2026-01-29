import React, { useState } from 'react';

interface Quest {
    id: string;
    title: string;
    description: string;
    category: 'Agent' | 'GEM' | 'Skill';
    status: 'locked' | 'available' | 'in-progress' | 'completed';
    reward: string;
    xp: number;
}

const SalesQuestView: React.FC = () => {
    const [quests] = useState<Quest[]>([
        {
            id: 'q1',
            title: 'Foundational Agent Mastery',
            description: 'Master the core 10 autonomous agents that drive enterprise sales automation.',
            category: 'Agent',
            status: 'in-progress',
            reward: 'Bronze Agent Badge',
            xp: 500
        },
        {
            id: 'q2',
            title: 'GEM Implementation Specialist',
            description: 'Successfully deploy the SAM Quote Builder v2 and Headroom Builder.',
            category: 'GEM',
            status: 'available',
            reward: 'Financial Pro Badge',
            xp: 750
        },
        {
            id: 'q3',
            title: 'Prospecting Strategy Lab',
            description: 'Utilize the Signal Feed and Dossier Hub to identify 5 high-intent accounts.',
            category: 'Skill',
            status: 'available',
            reward: 'Hunter Badge',
            xp: 600
        },
        {
            id: 'q4',
            title: 'Negotiation Guardrails',
            description: 'Navigate complex contract negotiations within the calculated ROI limits.',
            category: 'Skill',
            status: 'locked',
            reward: 'Closer Badge',
            xp: 1000
        }
    ]);

    const stats = {
        totalXp: 1250,
        level: 4,
        nextLevelXp: 2000,
        badgesEarned: 3,
        streak: 5
    };

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50 p-6 lg:p-12 space-y-12">
            {/* Header: User Progress Stats */}
            <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                    {/* Level Card */}
                    <div className="flex-1 bg-gradient-to-br from-[#1e40af] via-[#1e3a8a] to-[#1e40af] rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-150"></div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-200 uppercase tracking-[3px] mb-2">Mastery Level</h4>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-6xl font-syne font-black">{stats.level}</span>
                                        <span className="text-xl font-bold text-slate-200">/ 50</span>
                                    </div>
                                </div>
                                <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                    <span className="material-symbols-outlined text-3xl">military_tech</span>
                                </div>
                            </div>

                            <div className="mt-8 space-y-4">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-slate-200">Experience Points (XP)</span>
                                    <span>{stats.totalXp} / {stats.nextLevelXp}</span>
                                </div>
                                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-[2px]">
                                    <div
                                        className={`h-full bg-gradient-to-r from-[#c09d62] to-[#d4b883] rounded-full shadow-[0_0_10px_rgba(192,157,98,0.5)] transition-all duration-1000 w-pct-${Math.round((stats.totalXp / stats.nextLevelXp) * 20) * 5}`}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 w-full lg:w-1/3">
                        <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-[#1e40af] transition-all duration-300">
                            <span className="material-symbols-outlined text-[#1e40af] text-3xl">workspace_premium</span>
                            <div>
                                <p className="text-3xl font-syne font-black text-slate-900">{stats.badgesEarned}</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Badges</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-orange-500 transition-all duration-300">
                            <span className="material-symbols-outlined text-orange-600 text-3xl">local_fire_department</span>
                            <div>
                                <p className="text-3xl font-syne font-black text-slate-900">{stats.streak}d</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Streak</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-emerald-500 transition-all duration-300">
                            <span className="material-symbols-outlined text-emerald-600 text-3xl">bolt</span>
                            <div>
                                <p className="text-3xl font-syne font-black text-slate-900">Top 5%</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rank</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-[#c09d62] transition-all duration-300">
                            <span className="material-symbols-outlined text-[#c09d62] text-3xl">psychology</span>
                            <div>
                                <p className="text-3xl font-syne font-black text-slate-900">42</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Skills</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quests Section */}
            <div className="max-w-[1400px] mx-auto space-y-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-syne font-black tracking-tight text-slate-900">Active Quests</h2>
                        <p className="text-slate-500 font-medium text-lg mt-2">Master the <span className="text-[#1e40af] font-bold">MAB Platform</span> to unlock elite performance tiers.</p>
                    </div>
                    <button className="px-6 py-3 bg-gradient-to-r from-[#1e40af] to-[#1e3a8a] text-white rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-xl">
                        View Mastery Map
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {quests.map((quest, idx) => (
                        <div
                            key={quest.id}
                            className={`group relative bg-white rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden reveal-stagger stagger-${(idx % 20) + 1}
                                ${quest.status === 'locked' ? 'border-slate-100 opacity-60 grayscale' : 'border-transparent shadow-sm hover:shadow-2xl hover:border-slate-200 hover:-translate-y-2'}
                            `}
                        >
                            {/* Category Header */}
                            <div className={`h-2 w-full ${quest.category === 'Agent' ? 'bg-blue-500' :
                                quest.category === 'GEM' ? 'bg-indigo-600' : 'bg-amber-500'
                                }`}></div>

                            <div className="p-8 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${quest.category === 'Agent' ? 'text-blue-500' :
                                            quest.category === 'GEM' ? 'text-indigo-600' : 'text-amber-600'
                                            }`}>
                                            {quest.category} Quest
                                        </span>
                                        <h3 className="text-2xl font-syne font-black text-slate-900 leading-tight">{quest.title}</h3>
                                    </div>
                                    <div className={`p-3 rounded-2xl ${quest.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                                        quest.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                                            quest.status === 'available' ? 'bg-slate-100 text-slate-600' : 'bg-slate-50 text-slate-400'
                                        }`}>
                                        <span className="material-symbols-outlined text-2xl">
                                            {quest.status === 'completed' ? 'check_circle' :
                                                quest.status === 'in-progress' ? 'trending_up' :
                                                    quest.status === 'available' ? 'play_arrow' : 'lock'}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-slate-500 font-medium leading-relaxed">
                                    {quest.description}
                                </p>

                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <div className="flex justify-between items-center text-sm font-bold">
                                        <div className="flex items-center gap-2 text-slate-900">
                                            <span className="material-symbols-outlined text-base text-amber-500">stars</span>
                                            <span>{quest.reward}</span>
                                        </div>
                                        <div className="text-blue-600">
                                            +{quest.xp} XP
                                        </div>
                                    </div>

                                    {quest.status !== 'locked' && (
                                        <button className={`w-full py-4 rounded-2xl font-syne font-black uppercase tracking-widest text-xs transition-all
                                            ${quest.status === 'in-progress' ? 'bg-slate-900 text-white shadow-xl hover:bg-slate-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                                        `}>
                                            {quest.status === 'in-progress' ? 'Continue Quest' : 'Start Quest'}
                                        </button>
                                    )}
                                    {quest.status === 'locked' && (
                                        <div className="w-full py-4 rounded-2xl bg-slate-50 text-slate-400 font-syne font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined text-sm">lock</span> Locked
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Pending Skills Teaser */}
                    <div className="group relative bg-slate-900 rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center overflow-hidden border border-white/10 reveal-stagger stagger-5">
                        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                        <span className="material-symbols-outlined text-6xl text-white/20 mb-6">rocket_launch</span>
                        <h3 className="text-2xl font-syne font-black text-white mb-2 tracking-tight">696 Agentic Skills</h3>
                        <p className="text-slate-400 font-medium text-sm px-4">
                            Massive library pending delivery. Advanced mastery levels and specialized "Context Engineering" quests arriving soon.
                        </p>
                        <div className="mt-8 px-6 py-2 bg-white/10 rounded-full border border-white/20 text-[10px] font-black text-white uppercase tracking-widest">
                            Coming Soon
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesQuestView;
