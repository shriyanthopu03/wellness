import React from 'react';
import { Users, MessageCircle, Heart, Share2, Award } from 'lucide-react';

const Community = () => {
    const posts = [
        { id: 1, user: "Sarah J.", text: "Completed my 5K run today! AroMi's pacing advice was spot on. 🏃‍♀️", likes: 24, comments: 5, category: "Fitness" },
        { id: 2, user: "Mike R.", text: "Started the 7-day mindfulness challenge. Feeling much calmer already. 🧘‍♂️", likes: 18, comments: 2, category: "Mindfulness" },
        { id: 3, user: "WellnessBot", text: "New Community Goal: Can we reach 1 million total steps together this weekend? Join the challenge!", likes: 156, comments: 42, isOfficial: true },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Community Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CommunityStat icon={<Users />} label="Members" value="12.4k" />
                <CommunityStat icon={<Award />} label="Active Challenges" value="6" />
                <CommunityStat icon={<MessageCircle />} label="Live Discussions" value="28" />
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 overflow-x-auto no-scrollbar">
                {['Running Club', 'Yoga Souls', 'Keto Kitchen', 'Struggle Free', 'Sleep Better'].map(group => (
                    <button key={group} className="whitespace-nowrap px-6 py-3 bg-gray-50 hover:bg-brand hover:text-white rounded-2xl font-bold transition-all text-sm border border-gray-100">
                        {group}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    {posts.map(post => (
                        <div key={post.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${post.isOfficial ? 'bg-brand' : 'bg-gray-200 text-gray-400'}`}>
                                        {post.user[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                            {post.user}
                                            {post.isOfficial && <span className="text-[10px] bg-brand/10 text-brand px-2 py-0.5 rounded-full uppercase">Official</span>}
                                        </h4>
                                        <span className="text-xs text-brand font-bold uppercase tracking-wider">{post.category || 'Announcement'}</span>
                                    </div>
                                </div>
                                <button className="text-gray-400 p-2"><Share2 size={16}/></button>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-6 italic">{post.text}</p>
                            <div className="flex gap-6">
                                <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-xs font-bold">
                                    <Heart size={16} /> {post.likes}
                                </button>
                                <button className="flex items-center gap-2 text-gray-400 hover:text-brand transition-colors text-xs font-bold">
                                    <MessageCircle size={16} /> {post.comments}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-brand to-brand-dark p-6 rounded-3xl text-white shadow-xl shadow-brand/20">
                        <h3 className="text-lg font-bold mb-4">Expert Q&A Live</h3>
                        <p className="text-sm opacity-90 mb-6 font-medium">Dr. Emily is online now discussing 'Nutrition for Mental Clarity'</p>
                        <button className="w-full py-3 bg-white text-brand font-bold rounded-2xl text-sm hover:scale-105 transition-all">Join Lounge</button>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4">Leaderboard</h3>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                                <div className="flex items-center gap-3">
                                    <span className="font-black text-gray-300 w-4">#{i}</span>
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">U{i}</div>
                                    <span className="text-sm font-bold text-gray-700 font-medium">User_{i}02</span>
                                </div>
                                <span className="text-xs font-black text-brand">{(4-i)*1200} pts</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CommunityStat = ({ icon, label, value }) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="p-4 bg-brand-light/30 text-brand rounded-2xl">{icon}</div>
        <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
            <h4 className="text-xl font-black text-gray-900">{value}</h4>
        </div>
    </div>
);

export default Community;
