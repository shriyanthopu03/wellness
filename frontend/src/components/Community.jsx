import React from 'react';
import { Users, MessageCircle, Heart, Share2, Award } from 'lucide-react';

const Community = () => {
    const posts = [
        { id: 1, user: "Sarah J.", text: "Completed my 5K run today! AroMi's pacing advice was spot on. 🏃‍♀️", likes: 24, comments: 5, category: "Fitness" },
        { id: 2, user: "Mike R.", text: "Started the 7-day mindfulness challenge. Feeling much calmer already. 🧘‍♂️", likes: 18, comments: 2, category: "Mindfulness" },
        { id: 3, user: "WellnessBot", text: "New Community Goal: Can we reach 1 million total steps together this weekend? Join the challenge!", likes: 156, comments: 42, isOfficial: true },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Community Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <CommunityStat icon={<Users />} label="Nodes Active" value="12.4k" />
                <CommunityStat icon={<Award />} label="Sync Challenges" value="6" />
                <CommunityStat icon={<MessageCircle />} label="Data Streams" value="28" />
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl p-4 rounded-[2rem] border border-slate-800 flex items-center gap-4 overflow-x-auto no-scrollbar shadow-inner">
                {['Running Club', 'Yoga Souls', 'Keto Kitchen', 'Struggle Free', 'Sleep Better'].map(group => (
                    <button key={group} className="whitespace-nowrap px-8 py-4 bg-slate-800/50 hover:bg-brand hover:text-slate-900 rounded-2xl font-black transition-all text-[10px] uppercase tracking-widest border border-slate-700/50 text-slate-400">
                        {group}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {posts.map(post => (
                        <div key={post.id} className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border border-slate-800 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white shadow-lg ${post.isOfficial ? 'bg-brand text-slate-900' : 'bg-slate-800 border border-slate-700 text-slate-400'}`}>
                                        {post.user[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-100 flex items-center gap-3 uppercase tracking-tighter italic">
                                            {post.user}
                                            {post.isOfficial && <span className="text-[8px] bg-brand text-slate-900 px-2.5 py-1 rounded-full uppercase font-black not-italic">Verified Node</span>}
                                        </h4>
                                        <span className="text-[10px] text-brand font-black uppercase tracking-[0.2em] mt-1 block">{post.category || 'Announcement'}</span>
                                    </div>
                                </div>
                                <button className="text-slate-600 hover:text-brand transition-colors p-2 bg-slate-800/50 rounded-xl"><Share2 size={16}/></button>
                            </div>
                            
                            <p className="text-slate-300 leading-relaxed mb-8 text-sm font-medium italic">"{post.text}"</p>
                            
                            <div className="flex gap-8 relative z-10 border-t border-slate-800/50 pt-6">
                                <button className="flex items-center gap-3 text-slate-500 hover:text-red-500 transition-all text-[10px] font-black uppercase tracking-widest">
                                    <Heart size={18} /> {post.likes} SYNC
                                </button>
                                <button className="flex items-center gap-3 text-slate-500 hover:text-brand transition-all text-[10px] font-black uppercase tracking-widest">
                                    <MessageCircle size={18} /> {post.comments} RESPONSES
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-8">
                    <div className="bg-brand/10 border border-brand/20 p-8 rounded-[2.5rem] relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Users size={80} />
                         </div>
                         <h4 className="text-[10px] font-black text-brand uppercase tracking-[0.3em] mb-4">Neural Program</h4>
                         <p className="text-slate-200 text-sm font-bold leading-relaxed mb-6">
                            Expert Q&A is currently live: <span className="italic">"Substrate Optimization for Synapses"</span>
                         </p>
                         <button className="w-full py-4 bg-brand text-slate-950 font-black uppercase tracking-[0.2em] rounded-2xl text-[10px] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand/20">Access Lounge</button>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 border-b border-slate-800 pb-4">Performance Nodes</h3>
                        <div className="space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <span className="font-black text-slate-700 w-4 italic text-sm">#{i}</span>
                                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:border-brand/50 border border-transparent transition-all">U{i}</div>
                                        <span className="text-xs font-black text-slate-300 uppercase tracking-tighter">Node_{i}x4</span>
                                    </div>
                                    <span className="text-[10px] font-black text-brand italic">{(4-i)*1200}V</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CommunityStat = ({ icon, label, value }) => (
    <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 shadow-xl flex items-center gap-6 group hover:border-brand/30 transition-all">
        <div className="p-4 bg-slate-800 text-brand rounded-2xl group-hover:bg-brand group-hover:text-slate-900 transition-all shadow-lg">
            {React.cloneElement(icon, { size: 24 })}
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-2xl font-black text-white uppercase tracking-tighter">{value}</p>
        </div>
    </div>
);

export default Community;
