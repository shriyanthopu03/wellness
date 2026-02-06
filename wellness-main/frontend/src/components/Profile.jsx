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
        <div className="flex-1 p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-brand p-8 text-white">
                        <h2 className="text-3xl font-bold flex items-center gap-3">
                            <User size={32} />
                            Personalized Health Profile
                        </h2>
                        <p className="mt-2 text-teal-50 opacity-90">AI-driven adjustments start with your data</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {status && (
                            <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                {status}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Physical Details */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Physical Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Age</label>
                                        <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Weight (kg)</label>
                                        <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Height (cm)</label>
                                        <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg" />
                                    </div>
                                    <div className="flex flex-col justify-end pb-2">
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-500">Calculated BMI: <span className="font-bold text-brand">{formData.vitals.bmi || '--'}</span></p>
                                            <p className="text-xs text-gray-500">Daily Calories: <span className="font-bold text-brand">{formData.vitals.daily_calories || '--'} kcal</span></p>
                                            <p className="text-xs text-gray-500">Fitness Level: <span className="font-bold text-brand">{formData.vitals.fitness_level || '--'}</span></p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Lifestyle */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Lifestyle Inputs</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2"><Battery size={16}/> Energy Level ({formData.energy_level}/10)</label>
                                        <input type="range" name="energy_level" min="1" max="10" value={formData.energy_level} onChange={handleChange} className="w-full h-2 bg-gray-200 rounded-lg accent-brand" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Activity Level</label>
                                        <select name="lifestyle_inputs.activity_level" value={formData.lifestyle_inputs.activity_level} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                                            <option value="sedentary">Sedentary (Little/No exercise)</option>
                                            <option value="light">Lightly Active (1-3 days/week)</option>
                                            <option value="moderate">Moderately Active (3-5 days/week)</option>
                                            <option value="active">Active (6-7 days/week)</option>
                                            <option value="very_active">Very Active (Heavy training)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Diet Type</label>
                                        <select name="lifestyle_inputs.diet_type" value={formData.lifestyle_inputs.diet_type} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                                            <option value="balanced">Balanced</option>
                                            <option value="vegan">Vegan</option>
                                            <option value="keto">Keto</option>
                                            <option value="high-protein">High Protein</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Sleep (Hours/Night)</label>
                                        <input type="number" name="lifestyle_inputs.sleep_hours" value={formData.lifestyle_inputs.sleep_hours} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg" />
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Health Goals */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Health Goals</h3>
                            <div className="flex flex-wrap gap-3">
                                {['weight loss', 'muscle gain', 'stress reduction', 'diabetes care', 'better sleep', 'heart health'].map(goal => (
                                    <button
                                        key={goal}
                                        type="button"
                                        onClick={() => handleGoalToggle(goal)}
                                        className={`px-4 py-2 rounded-full border transition-all ${
                                            formData.health_goals.includes(goal)
                                                ? 'bg-brand text-white border-brand shadow-md'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-brand'
                                        }`}
                                    >
                                        {goal.charAt(0).toUpperCase() + goal.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <button
                            type="submit"
                            className="w-full py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            <Save size={20} />
                            Save Personalized Profile
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
