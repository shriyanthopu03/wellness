import React, { useState } from 'react';
import { Bell, Droplets, Pill, Clock, Plus, Trash2, CheckCircle2, Zap } from 'lucide-react';

const Reminders = () => {
    const [waterIntake, setWaterIntake] = useState(0);
    const [reminders, setReminders] = useState([
        { id: 1, title: "Morning Vitamins", time: "08:00 AM", category: "Medication", completed: true },
        { id: 2, title: "Hydration Check", time: "11:00 AM", category: "Water", completed: false },
        { id: 3, title: "Mid-day Walk", time: "01:00 PM", category: "Movement", completed: false },
        { id: 4, title: "Omega-3", time: "07:00 PM", category: "Supplement", completed: false },
    ]);

    const toggleComplete = (id) => {
        setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
    };

    const addWater = () => {
        if (waterIntake < 8) setWaterIntake(prev => prev + 1);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-12">
            {/* Main Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                    <h3 className="text-3xl font-black text-slate-100 flex items-center gap-4 uppercase tracking-tighter italic">
                        <div className="p-3 bg-brand/10 text-brand rounded-2xl border border-brand/20">
                            <Bell size={28} />
                        </div>
                        OPERATIONAL TASKS
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-2 uppercase font-black tracking-[0.4em]">Never miss a synchronization beat</p>
                </div>
                <button className="flex items-center gap-3 px-8 py-4 bg-brand text-slate-950 rounded-2xl font-black shadow-xl shadow-brand/20 hover:scale-105 active:scale-95 transition-all text-[10px] uppercase tracking-widest relative z-10">
                    <Plus size={18} /> APPEND TASK
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Hydration Interactive Card */}
                <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col items-center justify-between min-h-[450px] group transition-all hover:border-blue-500/30">
                    <div className="absolute top-0 right-0 p-8">
                        <div className="bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full flex items-center gap-2">
                            <Zap size={10} className="text-orange-500 fill-orange-500" />
                            <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest">3 DAY STREAK</span>
                        </div>
                    </div>

                    <div className="w-full text-left">
                        <h4 className="text-xl font-black text-white italic tracking-tight uppercase">Hydration</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Water Interface</p>
                    </div>

                    <div className="relative flex flex-col items-center justify-center my-8">
                        {/* Outer Glow Circle */}
                        <div className="absolute w-44 h-44 bg-blue-500/5 rounded-full blur-2xl animate-pulse"></div>
                        
                        {/* Main Circle Display */}
                        <div className="relative w-40 h-40 bg-slate-950 rounded-full border border-slate-800 flex flex-col items-center justify-center p-8 shadow-inner">
                            <Droplets size={32} className={`text-blue-500 mb-2 transition-all duration-700 ${waterIntake > 0 ? 'scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'opacity-40'}`} />
                            <span className="text-6xl font-black text-white leading-none tracking-tighter tabular-nums">{waterIntake}</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-2">/ 8 GLASSES</span>
                        </div>
                    </div>

                    <div className="w-full space-y-6">
                        <div className="flex flex-col items-center gap-3">
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] italic flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full bg-blue-500 ${waterIntake < 8 ? 'animate-pulse' : ''}`}></span>
                                {waterIntake === 0 ? 'START HYDRATING' : waterIntake < 8 ? 'KEEP GOING!' : 'GOAL REACHED!'}
                            </span>
                            <div className="flex gap-1.5">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className={`h-1 w-4 rounded-full transition-all duration-500 ${i < waterIntake ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-slate-800'}`}></div>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={addWater}
                            disabled={waterIntake >= 8}
                            className={`w-full py-5 rounded-[1.5rem] flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl ${
                                waterIntake >= 8 
                                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-500/20 hover:scale-[1.02] active:scale-95'
                            }`}
                        >
                            <Plus size={18} />
                            Add Water
                        </button>
                    </div>
                </div>

                {/* Reminders List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                        {reminders.map((reminder) => (
                            <div 
                                key={reminder.id} 
                                className={`p-8 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden group ${
                                    reminder.completed 
                                        ? 'bg-slate-900/40 border-slate-800/50 opacity-60' 
                                        : 'bg-slate-900 border-slate-800 shadow-xl hover:border-brand/30'
                                }`}
                            >
                                {reminder.completed && <div className="absolute top-8 right-8 text-brand animate-in zoom-in-50"><CheckCircle2 size={28} /></div>}
                                
                                <div className="flex justify-between items-start relative z-10 h-full">
                                    <div className="flex items-center gap-6">
                                        <div className={`p-5 rounded-[1.5rem] shadow-lg transition-transform group-hover:scale-110 ${
                                            reminder.category === 'Water' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                            reminder.category === 'Medication' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                            'bg-brand/10 text-brand border border-brand/20'
                                        }`}>
                                            {reminder.category === 'Water' ? <Droplets size={28} /> : 
                                             reminder.category === 'Medication' ? <Pill size={28} /> : <Clock size={28} />}
                                        </div>
                                        <div>
                                            <h4 className={`text-xl font-black uppercase tracking-tighter italic ${reminder.completed ? 'text-slate-500' : 'text-slate-100'}`}>
                                                {reminder.title}
                                            </h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                    {reminder.category}
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                                <span className="text-[10px] font-black text-brand uppercase tracking-widest">{reminder.time}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 self-center">
                                        <button 
                                            onClick={() => toggleComplete(reminder.id)}
                                            className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                                                reminder.completed 
                                                    ? 'bg-slate-800 text-slate-500 border border-slate-700' 
                                                    : 'bg-brand text-slate-950 hover:shadow-lg hover:shadow-brand/20 active:scale-95'
                                            }`}
                                        >
                                            {reminder.completed ? 'Acknowledged' : 'Execute Sync'}
                                        </button>
                                        <button className="p-3 rounded-2xl bg-slate-800/50 text-slate-600 hover:text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI Context Card */}
            <div className="bg-slate-900 border border-brand/20 p-8 rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-3xl"></div>
                <h4 className="font-black text-brand flex items-center gap-2 mb-4 uppercase text-[10px] tracking-[0.3em] italic">
                    <Clock size={16} />
                    Neural Optimization
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed italic border-l-2 border-brand/30 pl-6 py-2">
                    "I noticed you usually workout at 6 PM. I've automatically suggested a 'Pre-workout Snack' reminder at 5:15 PM based on your metabolism data. Would you like to enable it?"
                </p>
                <div className="mt-8 flex gap-4">
                    <button className="text-[10px] font-black uppercase tracking-widest bg-brand text-slate-950 px-8 py-3 rounded-xl shadow-lg shadow-brand/20 hover:scale-105 transition-all">Enable Neural Suggestion</button>
                    <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-6 py-3 hover:text-slate-300 transition-all">Dismiss</button>
                </div>
            </div>
        </div>
    );
};

export default Reminders;
