import React, { useState } from 'react';
import { Wind, Moon, Sun, Heart, Play, Pause, RefreshCw } from 'lucide-react';

const Mindfulness = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(600); // 10 mins in seconds

    const sessions = [
        { title: "Stress Relief", duration: "10 min", icon: <Wind />, color: "blue" },
        { title: "Better Sleep", duration: "15 min", icon: <Moon />, color: "indigo" },
        { title: "Focus & Clarity", duration: "5 min", icon: <Sun />, color: "orange" },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Breathe Tool */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-700 rounded-3xl p-12 text-center text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center">
                    <div className="mb-8 p-4 bg-white/20 rounded-full animate-pulse">
                        <Wind size={48} />
                    </div>
                    <h3 className="text-3xl font-black mb-2">Deep Breathing</h3>
                    <p className="opacity-80 mb-8 max-w-sm">Inhale... Hold... Exhale. Sync your breath with the circle.</p>
                    
                    <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                        <div className="absolute inset-0 bg-white/10 rounded-full animate-ping"></div>
                        <div className="w-32 h-32 bg-white/20 rounded-full border-4 border-white flex items-center justify-center scale-up-down">
                            <span className="text-xl font-bold">Inhale</span>
                        </div>
                    </div>

                    <button className="px-8 py-3 bg-white text-indigo-700 font-extrabold rounded-full hover:shadow-lg transition-all active:scale-95">
                        Start 5 Min Session
                    </button>
                </div>
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-300/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Guided Meditations */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Guided Meditations</h3>
                    <div className="space-y-4">
                        {sessions.map((session, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-gray-100 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl bg-${session.color}-50 text-${session.color}-600 flex items-center justify-center`}>
                                        {session.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">{session.title}</h4>
                                        <span className="text-xs text-gray-500 font-medium">{session.duration} session</span>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-brand group-hover:text-brand">
                                    <Play size={18} fill="currentColor" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mood History & Tips */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                         <h3 className="text-xl font-bold text-gray-800 mb-2">Mood Trends</h3>
                         <div className="flex gap-2 h-32 items-end justify-between bg-white px-2 mt-6">
                             {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                 <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                     <div 
                                        className={`w-full rounded-t-lg transition-all duration-1000 ${i === 3 ? 'bg-brand' : 'bg-brand-light'}`} 
                                        style={{ height: `${h}%` }}
                                     ></div>
                                     <span className="text-[10px] font-bold text-gray-400 capitalize">{['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'][i]}</span>
                                 </div>
                             ))}
                         </div>
                    </div>

                    <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100">
                        <div className="flex gap-4 items-start">
                            <div className="p-3 bg-white rounded-2xl text-orange-500 shadow-sm">
                                <Sun size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-orange-800">Mindfulness Tip</h4>
                                <p className="text-sm text-orange-950/70 mt-1">
                                    When you feel stressed, try the 4-7-8 technique. It lowers cortisol and resets your nervous system instantly.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Mindfulness;
