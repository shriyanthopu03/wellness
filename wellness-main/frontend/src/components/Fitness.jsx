import React, { useState, useEffect } from 'react';
import { Trophy, Footprints, Flame, Timer, Play, ChevronRight, Clock } from 'lucide-react';

const Fitness = ({ userContext, setUserContext }) => {
    const [activeSession, setActiveSession] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [customMinutes, setCustomMinutes] = useState(10);

    const handleStepUpdate = (newSteps) => {
        const steps = Math.max(0, parseInt(newSteps) || 0);
        // Average 0.04 calories per step
        const calories = steps * 0.04;
        setUserContext(prev => ({
            ...prev,
            steps: steps,
            calories_burned: parseFloat(calories.toFixed(1))
        }));
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeSession && (
                <div className="bg-brand text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-4 animate-bounce-subtle">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-2xl relative">
                            <Clock className="animate-pulse" size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold">Live Session: {activeSession.title}</h4>
                            <p className="text-xl font-black tracking-widest">{formatTime(timeLeft)}</p>
                            <p className="text-[10px] opacity-75 uppercase tracking-wider">Time Remaining</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <span className="block text-xl font-bold">{userContext.vitals.heart_rate}</span>
                            <span className="text-[10px] uppercase font-bold opacity-60">BPM</span>
                        </div>
                        <div className="h-10 w-px bg-white/20"></div>
                        <button 
                            onClick={() => setActiveSession(null)}
                            className="bg-white text-brand px-6 py-2 rounded-xl font-bold text-sm hover:bg-teal-50"
                        >
                            End Workout Early
                        </button>
                    </div>
                </div>
            )}

            {/* Activity Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative group">
                    <StatCard 
                        icon={<Footprints className="text-blue-500"/>} 
                        label="Steps" 
                        value={userContext.steps} 
                        goal="10,000" 
                        unit="steps" 
                        color="blue" 
                    />
                    <div className="mt-2 flex gap-2">
                        <input 
                            type="number" 
                            placeholder="Add steps..."
                            className="text-xs p-2 border border-blue-100 rounded-lg w-full outline-none focus:ring-1 focus:ring-blue-400"
                            onBlur={(e) => handleStepUpdate(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleStepUpdate(e.target.value)}
                        />
                    </div>
                </div>
                <StatCard 
                    icon={<Flame className="text-orange-500"/>} 
                    label="Calories" 
                    value={Math.round(userContext.calories_burned)} 
                    goal="500" 
                    unit="kcal" 
                    color="orange" 
                />
                <StatCard 
                    icon={<Timer className="text-purple-500"/>} 
                    label="Active Time" 
                    value={Math.floor(userContext.steps / 100)} 
                    goal="60" 
                    unit="min" 
                    color="purple" 
                />
            </div>

            {/* Manual Timer & AI Plans */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Custom Timer Card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-fit">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Clock className="text-brand" size={20} />
                        Custom Timer
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-2">Set Duration (minutes)</label>
                            <input 
                                type="number" 
                                value={customMinutes} 
                                onChange={(e) => setCustomMinutes(Math.max(1, parseInt(e.target.value) || 0))}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand outline-none"
                            />
                        </div>
                        <button 
                            onClick={() => startSession({ title: "Custom Session", durationSec: customMinutes * 60, exercises: ["Your choice of exercise"] })}
                            className="w-full py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            <Play size={18} fill="white" />
                            Start Timer
                        </button>
                    </div>
                </div>

                {/* Personalized Workout Plans */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Your AI Workout Plan</h3>
                            <p className="text-gray-500 text-sm">Based on your {userContext.health_goals?.[0] || 'wellness'} goal</p>
                        </div>
                        <button className="text-brand font-bold text-sm flex items-center gap-1 hover:underline">
                            View All <ChevronRight size={16}/>
                        </button>
                    </div>

                    <div className="space-y-4">
                        {workouts.map((workout, i) => (
                            <div 
                                key={i} 
                                onClick={() => startSession(workout)}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand">
                                        <Play size={20} className="fill-current" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 group-hover:text-brand transition-colors">{workout.title}</h4>
                                        <p className="text-xs text-gray-400 mb-1">{workout.description}</p>
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {workout.exercises.map((ex, idx) => (
                                                <span key={idx} className="text-[10px] px-2 py-0.5 bg-brand/10 text-brand rounded-full font-medium">
                                                    {ex}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex gap-3 text-xs text-gray-500">
                                            <span>{workout.duration}</span>
                                            <span>•</span>
                                            <span>{workout.level}</span>
                                            <span>•</span>
                                            <span>{workout.calories} kcal</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="p-2 rounded-full border border-gray-200 group-hover:border-brand group-hover:text-brand transition-colors">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Progress Tracking */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Trophy className="text-yellow-500" size={20}/>
                        Weekly Achievement
                    </h3>
                    <div className="flex items-end gap-2 mb-4">
                        <span className="text-4xl font-black text-gray-900">4</span>
                        <span className="text-gray-500 mb-1">days streak!</span>
                    </div>
                    <div className="flex justify-between gap-2">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <div className={`w-8 h-24 rounded-full bg-gray-100 relative overflow-hidden`}>
                                    <div 
                                        className={`absolute bottom-0 w-full rounded-full transition-all duration-1000 ${i < 4 ? 'bg-brand' : 'bg-gray-200'}`} 
                                        style={{ height: i < 4 ? `${60 + i*10}%` : '0%' }}
                                    ></div>
                                </div>
                                <span className="text-xs font-bold text-gray-400">{day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-brand to-brand-dark rounded-3xl p-8 text-white shadow-lg overflow-hidden relative">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-2">Smart Tip</h3>
                        <p className="opacity-90 leading-relaxed mb-6">
                            "{userContext.name}, your energy level is {userContext.energy_level}/10. {userContext.energy_level > 7 ? 'Perfect for a high-intensity workout today!' : userContext.energy_level > 4 ? 'A light jog or moderate cardio would be great.' : 'We recommend some gentle stretching or yoga to recover.'}"
                        </p>
                        <button 
                            onClick={() => startSession({ title: "Custom Recovery", duration: "10 min" })}
                            className="px-6 py-3 bg-white text-brand font-bold rounded-xl hover:shadow-xl transition-all"
                        >
                            Start Recommended Activity
                        </button>
                    </div>
                    <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-10">
                        <ActivityTrackerIcon size={200} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, goal, unit, color }) => {
    const colorClasses = {
        blue: { bg: 'bg-blue-50', bar: 'bg-blue-500' },
        orange: { bg: 'bg-orange-50', bar: 'bg-orange-500' },
        purple: { bg: 'bg-purple-50', bar: 'bg-purple-500' }
    };
    
    const currentClasses = colorClasses[color] || colorClasses.blue;
    const numericValue = typeof value === 'string' ? parseInt(value.replace(/,/g, '')) : value;
    const numericGoal = typeof goal === 'string' ? parseInt(goal.replace(/,/g, '')) : goal;
    const percentage = Math.min(100, (numericValue / numericGoal) * 100);

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${currentClasses.bg}`}>{icon}</div>
                <span className="font-bold text-gray-500 uppercase text-xs tracking-wider">{label}</span>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-black text-gray-900">{typeof value === 'number' ? value.toLocaleString() : value}</span>
                <span className="text-gray-400 text-sm">{unit}</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                    className={`h-full ${currentClasses.bar} transition-all duration-1000`} 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400">
                <span>Progress</span>
                <span>Goal: {goal}</span>
            </div>
        </div>
    );
};

const ActivityTrackerIcon = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="white" />
    </svg>
);

export default Fitness;
