import React, { useState } from 'react';
import { Activity, Battery, Smile, User, Heart, Brain, Zap, Target, TrendingUp, Plus, Trash2, CheckCircle, Circle, Calculator, BarChart3, LogOut, UserCircle } from 'lucide-react';

// Real-time Chart Imports
import StepsChart from './charts/StepsChart';
import CaloriesChart from './charts/CaloriesChart';
import SleepChart from './charts/SleepChart';
import ActivityChart from './charts/ActivityChart';

const Dashboard = ({ userContext, setUserContext, onGetRecommendation, setActiveTab, handleLogout }) => {
    const [newGoal, setNewGoal] = useState('');
    const [newTodo, setNewTodo] = useState('');
    const [manualSteps, setManualSteps] = useState('');
    const [manualSleep, setManualSleep] = useState(userContext.lifestyle_inputs?.sleep_hours || '');
    const [localFitness, setLocalFitness] = useState(userContext.vitals?.fitness_level || '');
    const [isUpdating, setIsUpdating] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleUpdate = (field, value) => {
        setUserContext(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedUpdate = (parent, field, value) => {
        setUserContext(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [field]: value
            }
        }));
    };

    const updateManualSteps = () => {
        setIsUpdating(true);
        const stepsToAdd = parseInt(manualSteps) || 0;
        const sleepToSet = parseInt(manualSleep) || userContext.lifestyle_inputs?.sleep_hours || 0;
        const fitnessToSet = localFitness || userContext.vitals?.fitness_level || 'Active';

        setTimeout(() => {
            setUserContext(prev => {
                const newSteps = (prev.steps || 0) + stepsToAdd;
                const newCalories = parseFloat((newSteps * 0.04).toFixed(1));
                return {
                    ...prev,
                    steps: newSteps,
                    calories_burned: newCalories,
                    lifestyle_inputs: {
                        ...(prev.lifestyle_inputs || {}),
                        sleep_hours: sleepToSet
                    },
                    vitals: {
                        ...(prev.vitals || {}),
                        daily_calories: Math.round(newCalories),
                        fitness_level: fitnessToSet
                    }
                };
            });
            setManualSteps('');
            setIsUpdating(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        }, 800);
    };

    const addGoal = () => {
        if (newGoal.trim()) {
            setUserContext(prev => ({
                ...prev,
                health_goals: [...(prev.health_goals || []), newGoal.trim()]
            }));
            setNewGoal('');
        }
    };

    const removeGoal = (goalToRemove) => {
        setUserContext(prev => ({
            ...prev,
            health_goals: prev.health_goals.filter(g => g !== goalToRemove)
        }));
    };

    const addTodo = () => {
        if (newTodo.trim()) {
            setUserContext(prev => ({
                ...prev,
                todos: [...(prev.todos || []), { id: Date.now(), text: newTodo.trim(), completed: false }]
            }));
            setNewTodo('');
        }
    };

    const toggleTodo = (id) => {
        setUserContext(prev => ({
            ...prev,
            todos: prev.todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
        }));
    };

    const removeTodo = (id) => {
        setUserContext(prev => ({
            ...prev,
            todos: prev.todos.filter(t => t.id !== id)
        }));
    };

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-[1400px] mx-auto p-4 md:p-6">
            {/* Minimalist Top Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
                        System <span className="text-brand">Ready</span>
                    </h1>
                    <p className="text-slate-400 text-sm font-medium tracking-wide uppercase">Operational Overview • {new Date().toLocaleDateString()}</p>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-800 bg-slate-900/50 text-slate-400 hover:border-brand/40 hover:text-white transition-all duration-300"
                    >
                        <UserCircle size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Profile</span>
                    </button>

                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-800 bg-slate-900/50 text-slate-400 hover:border-red-500/40 hover:text-red-500 transition-all duration-300"
                    >
                        <LogOut size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Log Out</span>
                    </button>
                    
                    <div className="h-8 w-[1px] bg-slate-800 mx-2 hidden md:block"></div>

                    <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 p-1.5 pr-6 rounded-2xl">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand to-orange-400 flex items-center justify-center text-white shadow-lg">
                            <User size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase leading-none mb-1">Status</p>
                            <p className="text-xs font-bold text-white leading-none uppercase">{userContext.mood || 'Optimal'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
                {/* Left Panel: Vitals & Energy */}
                <div className="lg:col-span-4 space-y-4 md:space-y-6">
                    <div className="bg-[#111827] border border-slate-800/60 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Zap size={80} className="text-brand" />
                        </div>
                        
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <Battery className="text-brand" size={12} /> Energy Level
                        </h3>
                        
                        <div className="flex items-end gap-3 mb-4">
                            <span className="text-6xl font-extrabold text-white tracking-tighter leading-none">
                                {userContext.energy_level * 10}
                            </span>
                            <span className="text-lg font-bold text-brand pb-1">%</span>
                        </div>

                        <div className="w-full h-2.5 bg-slate-800/50 rounded-full overflow-hidden mb-6">
                            <div 
                                className="h-full bg-gradient-to-r from-brand to-orange-400 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,107,0,0.3)]"
                                style={{ width: `${userContext.energy_level * 10}%` }}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-800/30 border border-slate-700/30 p-3 rounded-xl">
                                <p className="text-[9px] font-bold text-slate-500 uppercase mb-0.5">Output</p>
                                <p className="text-base font-bold text-white uppercase">{userContext.activity_type}</p>
                            </div>
                            <div className="bg-slate-800/30 border border-slate-700/30 p-3 rounded-xl">
                                <p className="text-[9px] font-bold text-slate-500 uppercase mb-0.5">Metabolism</p>
                                <p className="text-base font-bold text-white uppercase">Active</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Controls Card */}
                    <div className="bg-[#0f172a] border border-slate-800/60 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-6">Update Snapshot</h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="text-[9px] font-black text-slate-600 uppercase mb-2 block tracking-widest">Mood State</label>
                                <div className="flex flex-wrap gap-1.5">
                                    {['happy', 'stressed', 'tired', 'energetic'].map(m => (
                                        <button 
                                            key={m}
                                            onClick={() => handleUpdate('mood', m)}
                                            className={`px-4 py-2 rounded-xl text-[9px] font-black transition-all uppercase tracking-widest ${userContext.mood === m ? 'bg-brand text-white shadow-[0_0_20px_rgba(255,107,0,0.3)]' : 'bg-slate-900 text-slate-500 hover:bg-slate-800 border border-slate-800/50'}`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[9px] font-black text-slate-600 uppercase mb-2 block tracking-widest">Energy Scale</label>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <input 
                                            type="range" min="1" max="10" value={userContext.energy_level} 
                                            onChange={(e) => handleUpdate('energy_level', parseInt(e.target.value))}
                                            className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-[#2dd4bf]"
                                        />
                                    </div>
                                    <span className="text-2xl font-black text-white tabular-nums">{userContext.energy_level}</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-[9px] font-black text-slate-600 uppercase mb-2 block tracking-widest">System Snapshots</label>
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <div className="grid grid-cols-1 gap-2 flex-1">
                                            <input 
                                                type="number" 
                                                value={manualSteps} 
                                                onChange={(e) => setManualSteps(e.target.value)}
                                                placeholder="Steps.."
                                                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#2dd4bf]/50 placeholder:text-slate-700 font-bold"
                                            />
                                            <input 
                                                type="number" 
                                                placeholder="Sleep (H)..."
                                                value={manualSleep}
                                                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#2dd4bf]/50 placeholder:text-slate-700 font-bold"
                                                onChange={(e) => setManualSleep(e.target.value)}
                                            />
                                        </div>
                                        <button 
                                            onClick={updateManualSteps}
                                            disabled={isUpdating}
                                            className={`bg-[#2dd4bf] text-[#0f172a] px-4 rounded-xl hover:scale-[1.02] transition-all text-[10px] font-black uppercase tracking-widest shadow-[0_0_25px_rgba(45,212,191,0.3)] min-w-[80px] flex items-center justify-center ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {isUpdating ? <div className="w-3.5 h-3.5 border-2 border-[#0f172a]/20 border-t-[#0f172a] rounded-full animate-spin"></div> : (showToast ? 'DONE' : 'UPDATE')}
                                        </button>
                                    </div>

                                    <div className="relative group">
                                        <select 
                                            className="w-full bg-[#0f172a] border border-slate-800 rounded-xl px-4 py-4 text-xs text-white focus:outline-none focus:border-[#2dd4bf]/50 appearance-none font-black uppercase tracking-widest cursor-pointer hover:bg-slate-900/50 transition-colors"
                                            value={localFitness}
                                            onChange={(e) => setLocalFitness(e.target.value)}
                                        >
                                            <option value="" disabled>Select Fitness Zone</option>
                                            <option value="Sedentary">Sedentary</option>
                                            <option value="Active">Active</option>
                                            <option value="Efficient">Efficient</option>
                                            <option value="Elite">Elite</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-700 group-hover:text-teal-400 transition-colors">
                                            <TrendingUp size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={onGetRecommendation}
                                className="w-full bg-gradient-to-r from-[#50e37e] to-[#f4b82d] hover:opacity-90 text-[#0f172a] font-black py-4 rounded-2xl transition-all shadow-[0_10px_30px_rgba(80,227,126,0.2)] uppercase tracking-[0.2em] text-[10px]"
                            >
                                Re-Analyze System
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel: The Charts Grid */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 auto-rows-fr">
                    <div className="min-h-[160px]">
                        <StepsChart steps={userContext.steps} burned={userContext.calories_burned} />
                    </div>
                    <div className="min-h-[160px]">
                        <CaloriesChart burned={userContext.calories_burned} />
                    </div>
                    <div className="min-h-[160px]">
                        <SleepChart hours={userContext.lifestyle_inputs?.sleep_hours || 0} />
                    </div>
                    <div className="min-h-[160px]">
                        <ActivityChart level={userContext.vitals?.fitness_level || 'Active'} />
                    </div>
                </div>
            </div>

            {/* Bottom Row: Goals & Sync */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 pt-6 border-t border-slate-800/50">
                <div>
                     <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Target size={12} className="text-brand" /> System Goals
                    </h3>
                    <div className="flex gap-2 mb-3">
                        <input 
                            type="text" value={newGoal} onChange={(e) => setNewGoal(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                            className="flex-1 bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-2 text-xs font-medium text-white focus:outline-none focus:ring-1 focus:ring-brand/50"
                            placeholder="Add objective..."
                        />
                        <button onClick={addGoal} className="bg-brand/10 text-brand p-2 rounded-lg hover:bg-brand hover:text-white transition-all">
                            <Plus size={18} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        {userContext.health_goals?.slice(0, 3).map((goal, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-900/30 border border-slate-800/50 rounded-xl group transition-all hover:bg-slate-800/40">
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-1 rounded-full bg-brand shadow-[0_0_8px_rgba(255,107,0,0.5)]"></div>
                                    <span className="text-xs font-medium text-slate-200">{goal}</span>
                                </div>
                                <button onClick={() => removeGoal(goal)} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#111827] rounded-[2rem] p-6 border border-slate-800/60 flex items-center justify-between overflow-hidden relative">
                    <div className="absolute -bottom-4 -right-4 opacity-5">
                        <Brain size={100} className="text-cyan-500" />
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Neural Status</p>
                        <h4 className="text-xl font-bold text-white mb-3">Coherent State</h4>
                        <div className="flex items-center gap-2 text-cyan-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold uppercase tracking-wider">Sync Active</span>
                        </div>
                    </div>
                    <BarChart3 className="text-slate-800 w-20 h-20 stroke-[1px]" />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

