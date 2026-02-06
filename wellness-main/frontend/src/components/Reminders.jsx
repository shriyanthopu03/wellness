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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Bell className="text-brand" size={20} />
                        Active Reminders
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-wider">Never miss a health beat</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-brand text-white rounded-2xl font-bold shadow-lg shadow-brand/20 hover:scale-105 transition-all text-sm">
                    <Plus size={18} /> Add Reminder
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reminders.map((reminder) => (
                    <div 
                        key={reminder.id} 
                        className={`p-6 rounded-3xl border transition-all ${reminder.completed ? 'bg-gray-50 border-gray-100 grayscale' : 'bg-white border-gray-100 shadow-sm hover:shadow-md'}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl ${
                                    reminder.category === 'Water' ? 'bg-blue-50 text-blue-500' :
                                    reminder.category === 'Medication' ? 'bg-red-50 text-red-500' :
                                    'bg-purple-50 text-purple-500'
                                }`}>
                                    {reminder.category === 'Water' ? <Droplets size={20} /> : 
                                     reminder.category === 'Medication' ? <Pill size={20} /> : <Clock size={20} />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">{reminder.title}</h4>
                                    <span className="text-xs font-bold text-gray-400 uppercase">{reminder.category} • {reminder.time}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => toggleComplete(reminder.id)}
                                className={`p-2 rounded-xl transition-all ${reminder.completed ? 'text-brand' : 'text-gray-300 hover:text-brand'}`}
                            >
                                <CheckCircle2 size={24} fill={reminder.completed ? 'currentColor' : 'none'} />
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <button className="text-[10px] font-bold text-gray-400 hover:text-brand transition-colors uppercase tracking-widest px-3 py-1 bg-gray-50 rounded-lg">Snooze</button>
                            <button className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest px-3 py-1 bg-gray-50 rounded-lg ml-auto">Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* AI Context Card */}
            <div className="bg-brand-light/30 border border-brand-light p-6 rounded-3xl">
                <h4 className="font-bold text-brand-dark flex items-center gap-2 mb-2">
                    <Clock size={18} />
                    AroMi Optimization
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed italic">
                    "I noticed you usually workout at 6 PM. I've automatically suggested a 'Pre-workout Snack' reminder at 5:15 PM based on your metabolism data. Would you like to enable it?"
                </p>
                <div className="mt-4 flex gap-3">
                    <button className="text-xs font-bold bg-brand text-white px-4 py-2 rounded-xl">Enable AI Suggestion</button>
                    <button className="text-xs font-bold text-gray-500 px-4 py-2">Dismiss</button>
                </div>
            </div>
        </div>
    );
};

export default Reminders;
