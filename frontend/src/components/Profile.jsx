import React, { useState } from 'react';
import { User, Activity, Battery, Smile, Save } from 'lucide-react';

const Profile = ({ userContext, setUserContext }) => {
    const [formData, setFormData] = useState({ 
        ...userContext,
        lifestyle_inputs: { ...userContext.lifestyle_inputs },
        health_goals: [...userContext.health_goals],
        vitals: { ...userContext.vitals }
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: child === 'sleep_hours' || child === 'heart_rate' ? parseFloat(value) : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: ['energy_level', 'age', 'height', 'weight'].includes(name) ? parseFloat(value) : value
            }));
        }
    };

    const handleGoalToggle = (goal) => {
        setFormData(prev => ({
            ...prev,
            health_goals: prev.health_goals.includes(goal)
                ? prev.health_goals.filter(g => g !== goal)
                : [...prev.health_goals, goal]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const { age, gender, height, weight, lifestyle_inputs } = formData;
        
        if (!age || !height || !weight) {
            setStatus('Please fill in age, height, and weight for calculations.');
            return;
        }

        // BMI Calculation
        const heightInM = height / 100;
        const bmi = parseFloat((weight / (heightInM * heightInM)).toFixed(1));

        // BMR Calculation (Mifflin-St Jeor)
        let bmr;
        if (gender === 'male') {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }

        // TDEE (Daily Calories)
        const activityFactors = {
            'sedentary': 1.2,
            'light': 1.375,
            'moderate': 1.55,
            'active': 1.725,
            'very_active': 1.9
        };
        const factor = activityFactors[lifestyle_inputs.activity_level] || 1.2;
        const daily_calories = Math.round(bmr * factor);

        // Fitness Level Heuristic
        let fitness_level = 'Fair';
        if (bmi >= 18.5 && bmi <= 24.9) {
            if (factor >= 1.725) fitness_level = 'Excellent';
            else if (factor >= 1.55) fitness_level = 'Good';
            else fitness_level = 'Fair';
        } else if (bmi >= 25 && bmi <= 29.9) {
            if (factor >= 1.725) fitness_level = 'Good';
            else fitness_level = 'Fair';
        } else {
            fitness_level = 'Needs Attention';
        }

        const updatedData = {
            ...formData,
            vitals: { 
                ...formData.vitals, 
                bmi: bmi,
                daily_calories: daily_calories,
                fitness_level: fitness_level
            }
        };
        setUserContext(updatedData);
        setStatus('Profile updated! Your Daily Calories: ' + daily_calories + ' kcal. Fitness Level: ' + fitness_level);
        setTimeout(() => setStatus(''), 5000);
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-5xl mx-auto pb-20">
            <div className="bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-800 overflow-hidden relative group">
                {/* Brand Header */}
                <div className="bg-brand p-16 text-slate-950 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="p-8 bg-slate-950/10 rounded-[2.5rem] border border-slate-950/10 shadow-inner group-hover:scale-105 transition-transform duration-700">
                            <User size={80} className="text-slate-950" />
                        </div>
                        <div className="text-center md:text-left">
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900/60 mb-2 block italic">Neural Identity Profile</span>
                            <h2 className="text-6xl font-black uppercase tracking-tighter italic leading-none">{formData.name || 'Anonymous User'}</h2>
                            <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
                                {formData.health_goals.map((goal, i) => (
                                    <span key={i} className="px-5 py-2 bg-slate-950/10 border border-slate-950/20 rounded-xl text-[10px] font-black uppercase tracking-widest italic">{goal}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-12 md:p-16">
                    <form onSubmit={handleSubmit} className="space-y-16">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                            {/* Personal Nexus Section */}
                            <section className="space-y-10">
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter italic mb-10 flex items-center gap-4">
                                    <User className="text-brand" size={24} />
                                    Identity Link
                                    <div className="h-px flex-1 bg-slate-800"></div>
                                </h3>
                                <div className="space-y-6">
                                    <InputField label="Identity Name" name="name" value={formData.name} onChange={handleChange} />
                                    <div className="grid grid-cols-2 gap-6">
                                        <InputField label="Current Age" name="age" value={formData.age} onChange={handleChange} type="number" />
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2 italic">Sex Pattern</label>
                                            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-6 py-5 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 focus:border-brand outline-none transition-all font-black uppercase tracking-widest text-[10px]">
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2 italic">Body Mass (KG)</label>
                                        <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full px-6 py-5 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 focus:border-brand outline-none transition-all font-black" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2 italic">Stature (CM)</label>
                                        <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full px-6 py-5 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 focus:border-brand outline-none transition-all font-black" />
                                    </div>
                                    <div className="bg-slate-950 p-8 rounded-[2rem] border border-slate-800 shadow-inner flex flex-col justify-center space-y-4">
                                        <p className="flex justify-between text-[11px] font-black">
                                            <span className="text-slate-600 uppercase tracking-widest italic">Body Mass Index</span>
                                            <span className="text-brand text-lg">{formData.vitals.bmi || '--'}</span>
                                        </p>
                                        <div className="h-px bg-slate-900 w-full"></div>
                                        <p className="flex justify-between text-[11px] font-black">
                                            <span className="text-slate-600 uppercase tracking-widest italic">Caloric Equilibrium</span>
                                            <span className="text-brand text-lg">{formData.vitals.daily_calories || '--'}</span>
                                        </p>
                                        <div className="h-px bg-slate-900 w-full"></div>
                                        <p className="flex justify-between text-[11px] font-black">
                                            <span className="text-slate-600 uppercase tracking-widest italic">Physiological Tier</span>
                                            <span className="text-brand text-lg">{formData.vitals.fitness_level || '--'}</span>
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Lifestyle Section */}
                            <section className="space-y-10">
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter italic mb-10 flex items-center gap-4">
                                    <Battery className="text-brand" size={24} />
                                    Operational Logic
                                    <div className="h-px flex-1 bg-slate-800"></div>
                                </h3>
                                <div className="space-y-10">
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center px-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 italic"> Neural Charge Level</label>
                                            <span className="text-brand font-black text-sm italic">{formData.energy_level}/10</span>
                                        </div>
                                        <input type="range" name="energy_level" min="1" max="10" value={formData.energy_level} onChange={handleChange} className="w-full h-2 bg-slate-950 border border-slate-800 rounded-full appearance-none cursor-pointer accent-brand" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2 italic">Movement Protocol</label>
                                        <select name="lifestyle_inputs.activity_level" value={formData.lifestyle_inputs.activity_level} onChange={handleChange} className="w-full px-6 py-5 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 focus:border-brand outline-none transition-all font-black uppercase tracking-widest text-[10px]">
                                            <option value="sedentary">Sedentary (Idle State)</option>
                                            <option value="light">Minimal Sync</option>
                                            <option value="moderate">Nominal Routine</option>
                                            <option value="active">High Performance</option>
                                            <option value="very_active">Peak Overclock</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2 italic">Substrate Intake Type</label>
                                        <select name="lifestyle_inputs.diet_type" value={formData.lifestyle_inputs.diet_type} onChange={handleChange} className="w-full px-6 py-5 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 focus:border-brand outline-none transition-all font-black uppercase tracking-widest text-[10px]">
                                            <option value="balanced">Balanced Matrix</option>
                                            <option value="vegan">Plant-Based Logic</option>
                                            <option value="keto">Ketogenic Frame</option>
                                            <option value="high-protein">Structural Build</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2 italic">Recharge Cycle (HRS)</label>
                                        <input type="number" name="lifestyle_inputs.sleep_hours" value={formData.lifestyle_inputs.sleep_hours} onChange={handleChange} className="w-full px-6 py-5 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 focus:border-brand outline-none transition-all font-black" />
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Objectives Selection */}
                        <section className="space-y-10">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic mb-10 flex items-center gap-4">
                                <Activity className="text-brand" size={24} />
                                Strategic Objectives
                                <div className="h-px flex-1 bg-slate-800"></div>
                            </h3>
                            <div className="flex flex-wrap gap-4">
                                {['weight loss', 'muscle gain', 'stress reduction', 'diabetes care', 'better sleep', 'heart health'].map(goal => (
                                    <button
                                        key={goal}
                                        type="button"
                                        onClick={() => handleGoalToggle(goal)}
                                        className={`px-8 py-4 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-[0.2em] italic ${
                                            formData.health_goals.includes(goal)
                                                ? 'bg-brand text-slate-950 border-brand shadow-2xl shadow-brand/20 scale-105'
                                                : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-brand/40 hover:text-slate-300'
                                        }`}
                                    >
                                        {goal}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <div className="pt-10 border-t border-slate-800">
                            <button
                                type="submit"
                                className="w-full py-8 bg-brand text-slate-950 font-black rounded-[2.5rem] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-brand/20 flex items-center justify-center gap-6 uppercase tracking-[0.4em] text-sm italic"
                            >
                                <Save size={24} />
                                Synchronize Neural Identity
                            </button>
                            {status && (
                                <div className="mt-8 p-6 bg-slate-950 border border-brand/20 text-brand text-center text-[10px] font-black uppercase tracking-widest rounded-2xl animate-pulse italic">
                                    {status}
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
