import React, { useState, useEffect } from 'react';
import { Wind, Moon, Sun, Heart, Play, Pause, RefreshCw } from 'lucide-react';

const Mindfulness = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); // 5 mins
    const [phase, setPhase] = useState('Inhale'); // Inhale, Hold, Exhale
    const [phaseProgress, setPhaseProgress] = useState(0);

    useEffect(() => {
        let timer;
        let phaseTimer;
        
        if (isPlaying && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);

            phaseTimer = setInterval(() => {
                setPhase(prev => {
                    if (prev === 'Inhale') return 'Hold';
                    if (prev === 'Hold') return 'Exhale';
                    return 'Inhale';
                });
                setPhaseProgress(0); // Reset visual progress on phase change
            }, 4000);
            
            // Sub-timer for smoother animation progress
            const progressInt = setInterval(() => {
                setPhaseProgress(prev => (prev + 1) % 100);
            }, 40);

            return () => {
                clearInterval(timer);
                clearInterval(phaseTimer);
                clearInterval(progressInt);
            };
        } else if (timeLeft === 0) {
            setIsPlaying(false);
        }
    }, [isPlaying, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const sessions = [
        { title: "Stress Relief", duration: "10 min", icon: <Wind />, color: "text-blue-400", bg: "bg-blue-500/10" },
        { title: "Better Sleep", duration: "15 min", icon: <Moon />, color: "text-indigo-400", bg: "bg-indigo-500/10" },
        { title: "Focus & Clarity", duration: "5 min", icon: <Sun />, color: "text-orange-400", bg: "bg-orange-500/10" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-10">
            {/* Breathe Tool */}
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-12 text-center shadow-2xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center">
                    <div className={`mb-8 p-6 bg-brand/10 border border-brand/20 rounded-full ${isPlaying ? 'animate-pulse' : ''}`}>
                        <Wind className="text-brand" size={48} />
                    </div>
                    <h3 className="text-4xl font-black mb-4 text-white uppercase tracking-tighter min-h-[1.2em]">
                        {isPlaying ? phase : 'Neural Calm'}
                    </h3>
                    <p className="text-slate-500 mb-10 max-w-sm text-sm font-medium">
                        {isPlaying ? `Synchronizing: ${phase === 'Inhale' ? 'Expansion' : phase === 'Hold' ? 'Stasis' : 'Release'}` : 'Optimize your nervous system. Deep diaphragmatic patterns.'}
                    </p>
                    
                    <div className="relative w-64 h-64 flex items-center justify-center mb-10">
                        {/* Dynamic Ring */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                className="fill-none stroke-slate-800 stroke-[4px]"
                            />
                            {isPlaying && (
                                <circle
                                    cx="50%"
                                    cy="50%"
                                    r="45%"
                                    className="fill-none stroke-brand stroke-[4px] transition-all duration-100 ease-linear"
                                    style={{
                                        strokeDasharray: '283%',
                                        strokeDashoffset: `${283 - (phaseProgress * 2.83)}%`
                                    }}
                                />
                            )}
                        </svg>
                        
                        <div className={`absolute inset-0 bg-brand/5 rounded-full ${isPlaying ? 'animate-ping' : ''}`}></div>
                        <div 
                            className={`w-48 h-48 bg-slate-800 rounded-full border-2 border-slate-700 flex items-center justify-center shadow-inner transition-transform duration-[4000ms] ease-in-out ${
                                isPlaying && phase === 'Inhale' ? 'scale-125 border-brand/50' : 
                                isPlaying && phase === 'Exhale' ? 'scale-90 border-slate-600' : 
                                'scale-110 border-slate-700'
                            }`}
                        >
                            <span className="text-3xl font-black text-white tracking-widest font-mono">{isPlaying ? formatTime(timeLeft) : 'READY'}</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`px-12 py-4 rounded-full font-black text-sm uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center gap-3 ${
                            isPlaying ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-brand text-slate-900 group'
                        }`}
                    >
                        {isPlaying ? <><Pause size={20} fill="currentColor" /> Stop System</> : <><Play size={20} fill="currentColor" className="group-hover:translate-x-1 transition-transform" /> Initialize Calibrate</>}
                    </button>
                </div>
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-brand/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Guided Meditations */}
                <div className="bg-slate-900 rounded-[2rem] p-8 shadow-xl border border-slate-800">
                    <h3 className="text-lg font-black text-slate-100 uppercase tracking-widest mb-8 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-brand rounded-full"></div>
                        Neural Programs
                    </h3>
                    <div className="space-y-4">
                        {sessions.map((session, i) => (
                            <div 
                                key={i} 
                                onClick={() => {
                                    const mins = parseInt(session.duration);
                                    setTimeLeft(mins * 60);
                                    setPhase('Inhale');
                                    setIsPlaying(true);
                                }}
                                className="flex items-center justify-between p-5 bg-slate-800/40 rounded-2xl group hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`w-14 h-14 rounded-2xl ${session.bg} ${session.color} flex items-center justify-center shadow-lg`}>
                                        {session.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-100">{session.title}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{session.duration} program</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 rounded-full border border-slate-700 text-slate-500 group-hover:border-brand group-hover:text-brand transition-colors">
                                    <Play size={16} fill="currentColor" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mood History & Tips */}
                <div className="space-y-8">
                    <div className="bg-slate-900 rounded-[2rem] p-8 shadow-xl border border-slate-800">
                         <h3 className="text-lg font-black text-slate-100 uppercase tracking-widest mb-8 flex items-center gap-3">
                             <div className="w-1.5 h-6 bg-brand rounded-full"></div>
                             Mood Sync
                         </h3>
                         <div className="flex gap-3 h-40 items-end justify-between px-2">
                             {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                 <div key={i} className="flex-1 flex flex-col items-center gap-3">
                                     <div 
                                        className={`w-full rounded-2xl transition-all duration-1000 ${i === 3 ? 'bg-brand' : 'bg-slate-800 border border-slate-700'}`} 
                                        style={{ height: `${h}%` }}
                                     ></div>
                                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{['m', 't', 'w', 't', 'f', 's', 's'][i]}</span>
                                 </div>
                             ))}
                         </div>
                    </div>

                    <div className="bg-brand/5 rounded-[2rem] p-8 border border-brand/10 group hover:border-brand/20 transition-all">
                        <div className="flex gap-6 items-center">
                            <div className="p-4 bg-brand text-slate-900 rounded-2xl shadow-lg shadow-brand/20">
                                <Sun size={28} />
                            </div>
                            <div>
                                <h4 className="font-black text-brand uppercase tracking-widest text-xs mb-1">Mindfulness Protocol</h4>
                                <p className="text-sm text-slate-300 font-medium leading-relaxed">
                                    Engage the 4-7-8 routine. Inhibit cortisol production and initiate parasympathetic dominance instantly.
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
