import React, { useState } from 'react';
import { Activity, Battery, Smile, User, Heart, Brain, Zap, Target, TrendingUp } from 'lucide-react';

const Dashboard = ({ userContext, setUserContext, onGetRecommendation }) => {
    
    const handleUpdate = (field, value) => {
        setUserContext(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6">
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
                            icon={<Heart className="text-red-500"/>} 
                            label="Heart Rate" 
                            value={`${userContext.vitals.heart_rate || 0} bpm`} 
                            trend="+2% since yesterday" 
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
                    
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <TrendingUp className="text-brand" size={20} />
                            Health Trend Analysis
                        </h3>
                        <div className="flex items-end justify-between h-48 gap-4">
                            {[60, 45, 80, 55, 90, 70, 75].map((h, i) => (
                                <div key={i} className="flex-1 group relative">
                                    <div 
                                        className="w-full bg-brand/10 rounded-t-xl group-hover:bg-brand/30 transition-all cursor-help" 
                                        style={{ height: `${h}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {h}%
                                        </div>
                                    </div>
                                    <div className="text-[10px] font-bold text-gray-400 mt-2 text-center uppercase">
                                        {['m', 't', 'w', 't', 'f', 's', 's'][i]}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Smart Goals Progress */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Target className="text-blue-500" size={20} />
                    Current Goals & Progress
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {userContext.health_goals?.map(goal => (
                        <div key={goal} className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="font-bold text-gray-700 capitalize text-sm">{goal}</span>
                                <span className="text-xs font-bold text-brand">65%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-brand rounded-full" style={{ width: '65%' }}></div>
                            </div>
                        </div>
                    ))}
                    {(!userContext.health_goals || userContext.health_goals.length === 0) && (
                        <p className="text-sm text-gray-400 italic">No goals set. Update your profile to add goals.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const InsightCard = ({ icon, label, value, trend }) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="p-4 bg-gray-50 rounded-2xl">{icon}</div>
        <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
            <h4 className="text-2xl font-black text-gray-900">{value}</h4>
            <p className="text-[10px] font-bold text-green-500 mt-1">{trend}</p>
        </div>
    </div>
);


export default Dashboard;
