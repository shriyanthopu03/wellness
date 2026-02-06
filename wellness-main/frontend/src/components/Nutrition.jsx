import React from 'react';
import { Utensils, Apple, Coffee, PieChart, Plus, ChevronRight } from 'lucide-react';

const Nutrition = ({ userContext }) => {
    const [userConcern, setUserConcern] = React.useState("");

    const getRecommendations = () => {
        // Use user input concern if provided, otherwise fallback to profile goals
        const primaryConcern = userConcern.toLowerCase() || userContext.health_goals?.[0]?.toLowerCase() || 'wellness';
        
        const recommendations = {
            'weight loss': {
                advice: "Focus on calorie deficit. Aim for high-volume, low-calorie foods like leafy greens and lean proteins.",
                recipes: [
                    { name: "Zucchini Noodles with Pesto", time: "15m", tags: "Low Carb", kcal: 280 },
                    { name: "Baked Cod & Asparagus", time: "20m", tags: "Lean Protein", kcal: 320 }
                ]
            },
            'muscle gain': {
                advice: "You need a calorie surplus and plenty of protein. Aim for 1.6g-2g of protein per kg of body weight.",
                recipes: [
                    { name: "Chicken & Quinoa Bowl", time: "25m", tags: "High Protein", kcal: 580 },
                    { name: "Peanut Butter Protein Shake", time: "5m", tags: "Bulking", kcal: 450 }
                ]
            },
            'diabetes care': {
                advice: "Prioritize low-glycemic index foods. Include fiber-rich vegetables and avoid processed sugars.",
                recipes: [
                    { name: "Lentil & Spinach Stew", time: "30m", tags: "Low GI", kcal: 350 },
                    { name: "Almond-Crusted Salmon", time: "20m", tags: "Fiber Rich", kcal: 410 }
                ]
            },
            'stress reduction': {
                advice: "Magnesium-rich foods like spinach, nuts, and seeds can help regulate cortisol levels.",
                recipes: [
                    { name: "Dark Chocolate & Berry Mix", time: "5m", tags: "Antioxidants", kcal: 200 },
                    { name: "Chamomile Infused Oats", time: "10m", tags: "Calming", kcal: 310 }
                ]
            },
            'pcos': {
                 advice: "Focus on anti-inflammatory foods and complex carbs to manage insulin resistance.",
                 recipes: [
                     { name: "Berry & Flax Seed Smoothie", time: "5m", tags: "Anti-inflammatory", kcal: 240 },
                     { name: "Grilled Salmon Salad", time: "15m", tags: "Omega-3", kcal: 380 }
                 ]
            },
            'hypertension': {
                 advice: "Reduce sodium intake and increase potassium-rich foods like bananas, sweet potatoes, and beans.",
                 recipes: [
                     { name: "Quinoa & Black Bean Salad", time: "10m", tags: "Low Sodium", kcal: 310 },
                     { name: "Steamed Broccoli & Tofu", time: "15m", tags: "Heart Healthy", kcal: 260 }
                 ]
            }
        };

        // Semantic matching for user concern
        if (userConcern) {
            if (userConcern.includes("pcos")) return recommendations['pcos'];
            if (userConcern.includes("sugar") || userConcern.includes("diabetes")) return recommendations['diabetes care'];
            if (userConcern.includes("fat") || userConcern.includes("weight")) return recommendations['weight loss'];
            if (userConcern.includes("muscle") || userConcern.includes("gym")) return recommendations['muscle gain'];
            if (userConcern.includes("bp") || userConcern.includes("pressure") || userConcern.includes("salt")) return recommendations['hypertension'];
            if (userConcern.includes("stress") || userConcern.includes("anxiety")) return recommendations['stress reduction'];
        }

        return recommendations[primaryConcern] || {
            advice: "Maintain a balanced intake of macros. Stay hydrated and prioritize whole foods.",
            recipes: [
                { name: "Mediterranean Buddha Bowl", time: "20m", tags: "Balanced", kcal: 420 },
                { name: "Greek Yogurt Parfait", time: "5m", tags: "Probiotics", kcal: 250 }
            ]
        };
    };

    const recs = getRecommendations();

    const meals = [
        { name: "Scrambled Eggs & Avocado", calories: 350, time: "8:30 AM", type: "Breakfast" },
        { name: "Grilled Chicken Salad", calories: 450, time: "1:00 PM", type: "Lunch" },
        { name: "Almonds & Green Tea", calories: 150, time: "4:00 PM", type: "Snack" },
    ];

    const caloriesConsumed = meals.reduce((sum, meal) => sum + meal.calories, 0);
    const caloriesLeft = Math.max(0, (userContext.vitals.daily_calories || 2000) - caloriesConsumed);
    const progress = Math.min(100, (caloriesConsumed / (userContext.vitals.daily_calories || 2000)) * 100);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Macro Overview */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
                <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-brand" strokeDasharray="364.4" strokeDashoffset={(364.4 * (100 - progress)) / 100} />
                        </svg>
                        <div className="absolute text-center">
                            <span className="block text-2xl font-black text-gray-900">{caloriesLeft}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Left</span>
                        </div>
                    </div>
                </div>
                
                <div className="md:col-span-3 grid grid-cols-3 gap-6">
                    <MacroStat label="Proteins" value="84g" target="120g" color="blue" />
                    <MacroStat label="Carbs" value="145g" target="200g" color="orange" />
                    <MacroStat label="Fats" value="42g" target="65g" color="yellow" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* AI Recommendations */}
                <div className="bg-brand-light/20 rounded-3xl p-8 border border-brand-light flex flex-col">
                    <div className="inline-flex p-3 bg-white rounded-2xl text-brand mb-6 shadow-sm w-fit">
                        <Coffee size={24} />
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-brand-dark mb-2">Tell AroMi your health concern:</label>
                        <input 
                            type="text" 
                            placeholder="e.g., PCOS, high sugar, muscle gain..." 
                            value={userConcern}
                            onChange={(e) => setUserConcern(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-brand-light rounded-xl focus:ring-2 focus:ring-brand outline-none text-sm"
                        />
                    </div>

                    <h3 className="text-xl font-bold text-brand-dark mb-4">AroMi Advice</h3>
                    <p className="text-gray-700 text-sm leading-relaxed mb-6">
                        "{recs.advice}"
                    </p>
                    <div className="space-y-3 flex-1">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Suggested for you</h4>
                        {recs.recipes.map((recipe, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-brand-light/50 group cursor-pointer hover:shadow-md transition-all">
                                <h5 className="font-bold text-gray-800 group-hover:text-brand">{recipe.name}</h5>
                                <p className="text-xs text-gray-500">{recipe.time} • {recipe.tags} • {recipe.kcal} kcal</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Meal Journal */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Meal Journal</h3>
                        <button className="p-2 bg-brand text-white rounded-xl shadow-lg shadow-brand/20 hover:scale-105 transition-transform">
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {meals.map((meal, i) => (
                            <div key={i} className="flex iems-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200 cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-brand">
                                        <Apple size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">{meal.name}</h4>
                                        <span className="text-xs text-brand font-bold">{meal.type} • {meal.time}</span>
                                    </div>
                                </div>
                                <span className="font-black text-gray-700">{meal.calories} kcal</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const MacroStat = ({ label, value, target, color }) => {
    const colorClasses = {
        blue: 'bg-blue-500',
        orange: 'bg-orange-500',
        yellow: 'bg-yellow-500'
    };
    const barClass = colorClasses[color] || 'bg-brand';

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-gray-800">{label}</span>
                <span className="text-xs font-bold text-gray-400">{value} / {target}</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                    className={`h-full ${barClass} rounded-full transition-all duration-1000`} 
                    style={{ width: `${(parseInt(value) / parseInt(target)) * 100}%` }}
                ></div>
            </div>
        </div>
    );
};

export default Nutrition;
