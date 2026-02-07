import React, { useState, useEffect } from 'react';
import { Trophy, Footprints, Flame, Timer, Play, ChevronRight, Clock } from 'lucide-react';

const Fitness = ({ userContext, setUserContext }) => {
    const [activeSession, setActiveSession] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [customMinutes, setCustomMinutes] = useState(10);

    const handleStepUpdate = (newSteps) => {
        const stepsToAdd = Math.max(0, parseInt(newSteps) || 0);
        if (stepsToAdd === 0) return;
        
        setUserContext(prev => {
            const totalSteps = (prev.steps || 0) + stepsToAdd;
            const newCalories = totalSteps * 0.04;
            return {
                ...prev,
                steps: totalSteps,
                calories_burned: parseFloat(newCalories.toFixed(1))
            };
        });
    };

    const workouts = [
        { 
            title: "Morning Yoga", 
            duration: "15 min", 
            durationSec: 900,
            level: "Beginner", 
            calories: 120, 
            type: "Yoga", 
            description: "Gentle sunrise flow to wake up your body.",
            exercises: ["Child's Pose (2 min)", "Cat-Cow (3 min)", "Downward Dog (5 min)", "Warrior I (5 min)"]
        },
        { 
            title: "HIIT Session", 
            duration: "30 min", 
            durationSec: 1800,
            level: "Advanced", 
            calories: 400, 
            type: "Cardio", 
            description: "High-intensity intervals for maximum fat burn.",
            exercises: ["Burpees (3 sets)", "Mountain Climbers (45s)", "Jumping Jacks (1 min)", "Sprint Drills (5 min)"]
        },
        { 
            title: "Strength Training", 
            duration: "45 min", 
            durationSec: 2700,
            level: "Intermediate", 
            calories: 300, 
            type: "Strength", 
            description: "Compound movements to build muscle mass.",
            exercises: ["Squats (4x12)", "Push-ups (3x15)", "Lunges (3x10)", "Plank (1 min)"]
        },
        { 
            title: "Core Power", 
            duration: "10 min", 
            durationSec: 600,
            level: "Beginner", 
            calories: 80, 
            type: "Core", 
            description: "Quick targeted core strengthening exercises.",
            exercises: ["Crunches (30s)", "Leg Raises (30s)", "Plank (1 min)", "Russian Twists (30s)"]
        },
        { 
            title: "Evening Stretch", 
            duration: "20 min", 
            durationSec: 1200,
            level: "Beginner", 
            calories: 50, 
            type: "Recovery", 
            description: "Relaxing stretches to improve flexibility before sleep.",
            exercises: ["Neck Stretch (2 min)", "Hamstring Stretch (5 min)", "Cobra Pose (3 min)", "Happy Baby (5 min)"]
        },
    ];

    useEffect(() => {
        let interval = null;
        if (activeSession && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev === 4) {
                        // Play a beep sound or alert tone 3 seconds before end
                        try {
                            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                            const oscillator = audioCtx.createOscillator();
                            const gainNode = audioCtx.createGain();
                            oscillator.connect(gainNode);
                            gainNode.connect(audioCtx.destination);
                            oscillator.type = 'sine';
                            oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
                            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                            oscillator.start();
                            oscillator.stop(audioCtx.currentTime + 0.5);
                        } catch (e) {
                            console.log("Audio alert failed", e);
                        }
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (timeLeft === 0 && activeSession) {
            // Final Completion Sound/Alarm
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                oscillator.type = 'square'; // Sharper sound for alarm
                oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5);
                gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 1);
            } catch (e) {
                console.log("Alarm sound failed", e);
            }
            setActiveSession(null);
            alert(`⏰ Timer Finished! Great job on your ${activeSession.title} session.`);
        }
        return () => clearInterval(interval);
    }, [activeSession, timeLeft]);

    const startSession = (session) => {
        setActiveSession(session);
        // Default to 10 mins (600s) if durationSec not provided
        setTimeLeft(session.durationSec || 600);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-6xl mx-auto pb-20">
            {/* Active Session Overlay-like Card */}
            {activeSession && (
                <div className="bg-brand text-slate-950 p-10 rounded-[3rem] shadow-2xl shadow-brand/20 flex flex-col md:flex-row justify-between items-center gap-10 border border-brand/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10 flex items-center gap-8">
                        <div className="p-6 bg-slate-950/10 rounded-[2rem] border border-slate-950/10 shadow-inner">
                            <Clock className="animate-pulse" size={48} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900/60 mb-2 block italic">Protocol Synchronization</span>
                            <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-1">{activeSession.title}</h3>
                            <div className="text-6xl font-black font-mono tracking-tighter tabular-nums">{formatTime(timeLeft)}</div>
                        </div>
                    </div>
                    <div className="relative z-10 flex flex-col items-center gap-4">
                        <div className="flex items-center gap-6">
                            <button 
                                onClick={() => { setActiveSession(null); setTimeLeft(0); }}
                                className="bg-slate-950 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl italic"
                            >
                                Abort Cycle
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Stats & Profile Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="md:col-span-2 bg-slate-900 p-10 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10 flex items-center justify-between mb-12">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-brand/10 text-brand rounded-[1.5rem] border border-brand/20 shadow-xl shadow-brand/10">
                                <Trophy size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-100 uppercase tracking-tighter italic">Human Performance</h3>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-1">Efficiency Profile: {userContext.vitals?.fitness_level || 'ADVANCED'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <StatCard 
                                icon={<Footprints size={24} className="text-blue-400"/>} 
                                label="Momentum" 
                                value={userContext.steps} 
                                goal="10,000" 
                                unit="steps" 
                                color="blue" 
                            />
                            <div className="bg-slate-950 p-2 rounded-2xl border border-slate-800/50 shadow-inner group-hover:border-brand/20 transition-all">
                                <input 
                                    type="number" 
                                    placeholder="APPEND STEPS +"
                                    className="text-[10px] px-6 py-4 bg-slate-900 border border-slate-800 rounded-xl w-full outline-none focus:border-brand/50 text-brand placeholder:text-slate-700 transition-all font-black uppercase tracking-widest"
                                    onBlur={(e) => { handleStepUpdate(e.target.value); e.target.value = ''; }}
                                    onKeyDown={(e) => { if(e.key === 'Enter') { handleStepUpdate(e.target.value); e.target.value = ''; }}}
                                />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <StatCard 
                                icon={<Flame size={24} className="text-orange-400"/>} 
                                label="Thermal Exhaust" 
                                value={Math.round(userContext.calories_burned)} 
                                goal="500" 
                                unit="kcal" 
                                color="orange" 
                            />
                            <StatCard 
                                icon={<Timer size={24} className="text-purple-400"/>} 
                                label="Bio-Uptime" 
                                value={Math.floor(userContext.steps / 100)} 
                                goal="60" 
                                unit="min" 
                                color="purple" 
                            />
                        </div>
                    </div>
                 </div>

                 {/* Custom Timer Mini-Module */}
                 <div className="bg-slate-900 rounded-[3rem] p-10 shadow-2xl border border-slate-800 h-full flex flex-col justify-between group overflow-hidden relative">
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand/5 blur-3xl"></div>
                    <div>
                        <h3 className="text-[10px] font-black text-slate-100 uppercase tracking-[0.4em] mb-12 flex items-center gap-4 italic">
                            <div className="w-2 h-2 bg-brand rounded-full animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.6)]"></div>
                            Manual Protocol
                        </h3>
                        <div className="space-y-10">
                            <div className="text-center">
                                <label className="block text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">Target Duration</label>
                                <div className="flex items-center justify-center gap-4">
                                    <input 
                                        type="number" 
                                        value={customMinutes} 
                                        onChange={(e) => setCustomMinutes(Math.max(1, parseInt(e.target.value) || 0))}
                                        className="w-24 text-center text-5xl font-black bg-transparent border-b-2 border-slate-800 focus:border-brand outline-none text-white tracking-tighter"
                                    />
                                    <span className="text-sm font-black text-slate-500 uppercase italic">Min</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => startSession({ title: "Custom Training", durationSec: customMinutes * 60 })}
                        className="w-full py-6 bg-brand text-slate-950 font-black rounded-2xl hover:scale-[1.03] active:scale-95 transition-all shadow-xl shadow-brand/10 flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-xs italic mt-12"
                    >
                        <Play size={20} fill="currentColor" />
                        Execute
                    </button>
                 </div>
            </div>

            {/* Plans List */}
            <div className="pt-10">
                <div className="flex items-center gap-6 mb-12">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Training Cycles</h3>
                    <div className="h-px flex-1 bg-slate-800"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {workouts.map((workout, i) => (
                        <div 
                            key={i} 
                            className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 hover:border-brand/30 transition-all duration-500 group cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 blur-2xl group-hover:bg-brand/10 transition-all"></div>
                            
                            <div className="flex justify-between items-start mb-8">
                                <div className="p-4 bg-slate-800 border border-slate-700 text-brand rounded-2xl group-hover:bg-brand group-hover:text-slate-950 transition-all duration-500 shadow-xl">
                                    <Timer size={24} />
                                </div>
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] italic border border-slate-800 px-3 py-1 rounded-lg">
                                    {workout.level}
                                </span>
                            </div>

                            <h4 className="text-xl font-black text-slate-100 group-hover:text-brand transition-colors uppercase tracking-tight italic mb-3">{workout.title}</h4>
                            <p className="text-sm text-slate-400 font-medium leading-relaxed italic mb-8">{workout.description}</p>
                            
                            <div className="grid grid-cols-2 gap-4 mb-10">
                                <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 flex items-center justify-center gap-3">
                                    <Clock size={14} className="text-brand" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{workout.duration}</span>
                                </div>
                                <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 flex items-center justify-center gap-3">
                                    <Flame size={14} className="text-orange-500" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{workout.calories} kcal</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => startSession(workout)}
                                className="w-full py-4 bg-slate-800 text-slate-300 rounded-xl border border-slate-700 font-black text-[10px] uppercase tracking-widest hover:bg-brand hover:text-slate-950 hover:border-brand transition-all shadow-xl group-hover:scale-[1.02]"
                            >
                                Initiate Protocol
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, goal, unit, color }) => {
    const colorClasses = {
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-blue-500/5',
        orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20 shadow-orange-500/5',
        purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-purple-500/5'
    };
    const barClasses = {
        blue: 'bg-blue-500',
        orange: 'bg-orange-500',
        purple: 'bg-purple-500'
    };

    const progress = Math.min(100, (parseInt(value) / parseInt(goal.replace(',', ''))) * 100);

    return (
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/50 shadow-inner hover:border-slate-800 transition-all">
            <div className="flex items-center gap-5 mb-6">
                <div className={`p-3 rounded-xl border ${colorClasses[color]} shadow-lg`}>
                    {icon}
                </div>
                <div>
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">{label}</p>
                    <h4 className="text-2xl font-black text-slate-100 tracking-tighter italic tabular-nums">
                        {value?.toLocaleString() || 0} <span className="text-[10px] text-slate-500 uppercase italic opacity-60 ml-1">{unit}</span>
                    </h4>
                </div>
            </div>
            <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/10">
                <div 
                    className={`h-full ${barClasses[color]} transition-all duration-1000 shadow-[0_0_10px_rgba(45,212,191,0.2)]`} 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
};

export default Fitness;
