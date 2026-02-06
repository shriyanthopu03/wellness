import React, { useState } from 'react';
import { Bell, Droplets, Pill, Clock, Plus, Trash2, CheckCircle2 } from 'lucide-react';

const Reminders = () => {
    const [reminders, setReminders] = useState([
        { id: 1, title: "Morning Vitamins", time: "08:00 AM", category: "Medication", completed: true },
        { id: 2, title: "Hydration Check", time: "11:00 AM", category: "Water", completed: false },
        { id: 3, title: "Mid-day Walk", time: "01:00 PM", category: "Movement", completed: false },
        { id: 4, title: "Omega-3", time: "07:00 PM", category: "Supplement", completed: false },
    ]);

    const toggleComplete = (id) => {
        setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                    <h3 className="text-2xl font-black text-slate-100 flex items-center gap-4 uppercase tracking-tighter italic">
                        <div className="p-3 bg-brand/10 text-brand rounded-2xl border border-brand/20">
                            <Bell size={24} />
                        </div>
                        Operational Tasks
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-2 uppercase font-black tracking-[0.4em]">Never miss a synchronization beat</p>
                </div>
                <button className="flex items-center gap-3 px-8 py-4 bg-brand text-slate-950 rounded-2xl font-black shadow-xl shadow-brand/20 hover:scale-105 active:scale-95 transition-all text-[10px] uppercase tracking-widest relative z-10">
                    <Plus size={18} /> Append Task
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {reminders.map((reminder) => (
                    <div 
                        key={reminder.id} 
                        className={`p-8 rounded-[2rem] border transition-all duration-500 relative overflow-hidden group ${
                            reminder.completed 
                                ? 'bg-slate-900/40 border-slate-800 opacity-50' 
                                : 'bg-slate-900 border-slate-800 shadow-xl hover:border-brand/30'
                        }`}
                    >
                        {reminder.completed && <div className="absolute top-4 right-4 text-brand"><CheckCircle2 size={24} /></div>}
                        
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div className="flex items-center gap-5">
                                <div className={`p-4 rounded-2xl shadow-lg ${
                                    reminder.category === 'Water' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                    reminder.category === 'Medication' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                    'bg-brand/10 text-brand border border-brand/20'
                                }`}>
                                    {reminder.category === 'Water' ? <Droplets size={24} /> : 
                                     reminder.category === 'Medication' ? <Pill size={24} /> : <Clock size={24} />}
                                </div>
                                <div>
                                    <h4 className={`text-lg font-black uppercase tracking-tight italic ${reminder.completed ? 'text-slate-500' : 'text-slate-100'}`}>
                                        {reminder.title}
                                    </h4>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1 block">
                                        {reminder.category} • <span className="text-brand/70">{reminder.time}</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 relative z-10 border-t border-slate-800/50 pt-6">
                            <button 
                                onClick={() => toggleComplete(reminder.id)}
                                className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                                    reminder.completed 
                                        ? 'bg-slate-800 text-slate-500' 
                                        : 'bg-brand text-slate-950 hover:scale-[1.02]'
                                }`}
                            >
                                {reminder.completed ? 'Acknowledge' : 'Execute Sync'}
                            </button>
                            <button className="p-3 rounded-xl bg-slate-800/50 text-slate-600 hover:text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
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
