import React, { useState } from 'react';
import { Activity, Battery, Smile, User, Heart, Brain, Zap, Target, TrendingUp, Plus, Trash2, CheckCircle, Circle, Calculator } from 'lucide-react';

const Dashboard = ({ userContext, setUserContext, onGetRecommendation }) => {
    const [newGoal, setNewGoal] = useState('');
    const [newTodo, setNewTodo] = useState('');
    const [manualSteps, setManualSteps] = useState('');

    const handleUpdate = (field, value) => {
        setUserContext(prev => ({ ...prev, [field]: value }));
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

    const updateManualSteps = () => {
        const steps = parseInt(manualSteps);
        if (!isNaN(steps)) {
            setUserContext(prev => ({
                ...prev,
                steps: steps,
                calories_burned: steps * 0.04 // Basic formula: 0.04 cal per step
            }));
            setManualSteps('');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Status Update Card */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 lg:col-span-1">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                        <Zap className="text-brand" size={20} />
                        Quick Update
                    </h2>

                    <div className="space-y-6">
                        {/* Mood Selector */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Smile size={14} /> Mood
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {['neutral', 'happy', 'stressed', 'energetic', 'tired'].map(m => (
                                    <button 
                                        key={m}
                                        onClick={() => handleUpdate('mood', m)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${userContext.mood === m ? 'bg-brand text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                    >
                                        {m.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Energy Level Slider */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Battery size={14} /> Energy ({userContext.energy_level}/10)
                            </label>
                            <input 
                                type="range" min="1" max="10" value={userContext.energy_level} 
                                onChange={(e) => handleUpdate('energy_level', parseInt(e.target.value))}
                                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand"
                            />
                        </div>

                        {/* Activity Selector */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Activity size={14} /> Activity
                            </label>
                            <select 
                                value={userContext.activity_type} 
                                onChange={(e) => handleUpdate('activity_type', e.target.value)}
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none"
                            >
                                <option value="sedentary">Sedentary</option>
                                <option value="walking">Walking</option>
                                <option value="workout">Working Out</option>
                            </select>
                        </div>

                        <button 
                            onClick={onGetRecommendation}
                            className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-brand/20"
                        >
                            Generate AI Insight
                        </button>
                    </div>
                </div>

                {/* Vitals & Health Insights */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InsightCard 
                            icon={<TrendingUp className="text-brand"/>} 
                            label="Steps Today" 
                            value={userContext.steps?.toLocaleString() || "0"} 
                            trend={`${(userContext.calories_burned || 0).toFixed(0)} kcal burned`} 
                        />
                        <InsightCard 
                            icon={<Zap className="text-orange-500"/>} 
                            label="Daily Target" 
                            value={`${userContext.vitals.daily_calories || 0} kcal`} 
                            trend="Based on your profile" 
                        />
                         <InsightCard 
                            icon={<Target className="text-blue-500"/>} 
                            label="Fitness Level" 
                            value={userContext.vitals.fitness_level || 'Unknown'} 
                            trend="Calculated from activity" 
                        />
                        <InsightCard 
                            icon={<Brain className="text-purple-500"/>} 
                            label="Sleep Quality" 
                            value={userContext.vitals.sleep_quality || 'Unknown'} 
                            trend="Deep sleep: 2.5h" 
                        />
                    </div>
                    
                    {/* Calories Calculator Mini-Widget */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-brand/10 rounded-xl">
                                <Calculator size={20} className="text-brand" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-800">Manual Step Sync</h4>
                                <p className="text-xs text-gray-400">Update steps to recalculate calories</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <input 
                                type="number"
                                placeholder="Steps..."
                                value={manualSteps}
                                onChange={(e) => setManualSteps(e.target.value)}
                                className="w-24 px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                            />
                            <button 
                                onClick={updateManualSteps}
                                className="bg-brand text-white text-xs font-bold px-4 py-2 rounded-xl"
                            >
                                Sync
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Dynamic Goals */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Target className="text-brand" size={20} />
                            Active Goals
                        </h3>
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                placeholder="Add goal..."
                                value={newGoal}
                                onChange={(e) => setNewGoal(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                                className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:outline-none"
                            />
                            <button onClick={addGoal} className="bg-brand/10 text-brand p-1.5 rounded-lg hover:bg-brand hover:text-white transition-colors">
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        {userContext.health_goals?.map(goal => (
                            <div key={goal} className="group flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-brand/20 transition-all">
                                <div className="space-y-2 flex-1 mr-4">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-bold text-gray-700 capitalize">{goal}</span>
                                        <span className="text-brand font-black">65%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
                                        <div className="h-full bg-brand rounded-full" style={{ width: '65%' }}></div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => removeGoal(goal)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        {(!userContext.health_goals || userContext.health_goals.length === 0) && (
                            <div className="text-center py-8">
                                <p className="text-sm text-gray-400 italic">No goals set yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Todo List */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <CheckCircle className="text-green-500" size={20} />
                            Daily Todo
                        </h3>
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                placeholder="Add task..."
                                value={newTodo}
                                onChange={(e) => setNewTodo(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                                className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:outline-none"
                            />
                            <button onClick={addTodo} className="bg-green-100 text-green-600 p-1.5 rounded-lg hover:bg-green-500 hover:text-white transition-colors">
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {userContext.todos?.map(todo => (
                            <div key={todo.id} className="flex items-center justify-between group p-3 hover:bg-gray-50 rounded-xl transition-all">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => toggleTodo(todo.id)}>
                                        {todo.completed ? 
                                            <CheckCircle size={18} className="text-green-500" /> : 
                                            <Circle size={18} className="text-gray-300" />
                                        }
                                    </button>
                                    <span className={`text-sm ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>
                                        {todo.text}
                                    </span>
                                </div>
                                <button 
                                    onClick={() => removeTodo(todo.id)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                        {(!userContext.todos || userContext.todos.length === 0) && (
                            <div className="text-center py-8 text-gray-400">
                                <p className="text-sm italic">Nothing on the list. Enjoy your day!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const InsightCard = ({ icon, label, value, trend }) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:scale-[1.02]">
        <div className="p-4 bg-gray-50 rounded-2xl">{icon}</div>
        <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
            <h4 className="text-2xl font-black text-gray-900">{value}</h4>
            <p className="text-[10px] font-bold text-brand mt-1">{trend}</p>
        </div>
    </div>
);


export default Dashboard;
