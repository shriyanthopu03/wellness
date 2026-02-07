import React from 'react';
import { Utensils, Apple, Coffee, PieChart, Plus, ChevronRight } from 'lucide-react';

const Nutrition = ({ userContext }) => {
    const [userConcern, setUserConcern] = React.useState("");

    // Dynamic Macro Calculation based on weight and activity
    const weight = userContext.weight || 70;
    const goal = userContext.health_goals?.[0]?.toLowerCase() || 'maintenance';
    const activity = userContext.lifestyle_inputs?.activity_level || 'moderate';

    const getDailyNeeds = () => {
        const calories = userContext.vitals?.daily_calories || 2000;
        
        // Protein: 0.8g to 2.2g based on goal
        let proteinPerKg = 1.0;
        if (goal.includes('muscle')) proteinPerKg = 1.8;
        if (goal.includes('weight')) proteinPerKg = 1.4;
        
        const protein = Math.round(weight * proteinPerKg);
        const fat = Math.round((calories * 0.25) / 9); // 25% from fat
        const carbs = Math.round((calories - (protein * 4) - (fat * 9)) / 4);

        return { calories, protein, carbs, fat };
    };

    const needs = getDailyNeeds();

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
    const caloriesLeft = Math.max(0, needs.calories - caloriesConsumed);
    const progress = Math.min(100, (caloriesConsumed / needs.calories) * 100);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-6xl mx-auto pb-20">
            {/* Macro Overview */}
            <div className="bg-slate-900 rounded-[3rem] p-12 shadow-2xl border border-slate-800 grid grid-cols-1 lg:grid-cols-4 gap-12 items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex flex-col items-center relative z-10">
                    <div className="relative w-48 h-48 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90 filter drop-shadow-[0_0_15px_rgba(45,212,191,0.2)]">
                            <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-800" />
                            <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="14" fill="transparent" className="text-brand" strokeDasharray="502" strokeDashoffset={(502 * (100 - progress)) / 100} strokeLinecap="round" />
                        </svg>
                        <div className="absolute text-center">
                            <span className="block text-5xl font-black text-white tracking-tighter italic">{caloriesLeft}</span>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1 block">Entropy Left</span>
                        </div>
                    </div>
                </div>
                
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    <MacroStat label="Peptides" value="56g" target={`${needs.protein}g`} color="blue" />
                    <MacroStat label="Glycogen" value="120g" target={`${needs.carbs}g`} color="orange" />
                    <MacroStat label="Lipids" value="32g" target={`${needs.fat}g`} color="brand" />
                </div>
            </div>

            {/* AI Advisor Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden group h-full">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-brand/5 blur-3xl"></div>
                        <h4 className="text-[10px] font-black text-brand uppercase tracking-[0.4em] mb-10 italic flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.6)]"></div>
                            Neural Diet Engine
                        </h4>
                        <div className="space-y-6 relative z-10">
                            <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block">Input Biological Constraint</label>
                            <div className="relative">
                                <input 
                                    value={userConcern}
                                    onChange={(e) => setUserConcern(e.target.value)}
                                    placeholder="E.g., OPTIMIZE FOR PCOS"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-5 text-sm text-slate-300 font-black tracking-tight focus:outline-none focus:border-brand/50 transition-all placeholder:text-slate-700 shadow-inner"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-brand/10 text-brand rounded-lg border border-brand/20">
                                    <Plus size={16} />
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-12 pt-10 border-t border-slate-800/50">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 block">Engine Advisory</span>
                            <p className="text-slate-300 text-sm leading-relaxed italic border-l-2 border-brand/40 pl-6 py-2">
                                "{recs.advice}"
                            </p>
                        </div>

                        <div className="mt-12 space-y-4">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recipe Protocols</h4>
                            {recs.recipes.map((recipe, idx) => (
                                <div key={idx} className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/50 group/item cursor-pointer hover:bg-slate-900 hover:border-brand/30 transition-all flex justify-between items-center">
                                    <div>
                                        <h5 className="font-black text-slate-100 uppercase tracking-tight italic text-sm group-hover/item:text-brand transition-colors">{recipe.name}</h5>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{recipe.time}</span>
                                            <span className="text-[9px] font-black text-brand uppercase tracking-widest">{recipe.kcal} kcal</span>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-700 group-hover/item:text-brand" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-10">
                    <div className="bg-slate-900 rounded-[3rem] p-10 shadow-2xl border border-slate-800 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-10 relative z-10">
                            <div>
                                <h3 className="text-2xl font-black text-slate-100 uppercase tracking-tighter italic">Consumption Log</h3>
                                <p className="text-[10px] text-slate-500 font-black mt-2 uppercase tracking-[0.4em]">Real-time Nutrient Absorption Audit</p>
                            </div>
                            <button className="p-5 bg-brand text-slate-950 rounded-[1.5rem] shadow-xl shadow-brand/20 hover:scale-105 active:scale-95 transition-all">
                                <Plus size={24} />
                            </button>
                        </div>

                        <div className="space-y-6 relative z-10">
                            {meals.map((meal, i) => (
                                <div key={i} className="flex items-center justify-between p-8 bg-slate-950/30 rounded-[2rem] hover:bg-slate-950/50 border border-slate-800/50 hover:border-brand/20 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-8">
                                        <div className="w-16 h-16 bg-slate-900 rounded-2xl shadow-xl flex items-center justify-center text-brand border border-slate-800 group-hover:scale-110 transition-all duration-500">
                                            <Apple size={28} />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-slate-200 uppercase tracking-tight italic group-hover:text-brand transition-colors">{meal.name}</h4>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-[10px] font-black text-brand uppercase tracking-widest px-2 py-0.5 bg-brand/5 border border-brand/10 rounded-md">{meal.type}</span>
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{meal.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block font-black text-slate-100 text-3xl tracking-tighter italic font-mono">{meal.calories}</span>
                                        <span className="block text-[9px] font-black text-slate-600 uppercase tracking-widest">Kcal</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MacroStat = ({ label, value, target, color }) => {
    const colorClasses = {
        blue: 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
        orange: 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]',
        brand: 'bg-brand shadow-[0_0_15px_rgba(45,212,191,0.3)]'
    };
    const barClass = colorClasses[color] || 'bg-brand shadow-[0_0_15px_rgba(45,212,191,0.3)]';

    return (
        <div className="bg-slate-950/50 p-8 rounded-[2rem] border border-slate-800/50">
            <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</span>
                <div className={`p-2 rounded-lg bg-slate-900 border border-slate-800`}>
                    <Utensils size={14} className="text-slate-600" />
                </div>
            </div>
            <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-black text-white tracking-tighter italic font-mono">{value}</span>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">/ {target}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/10">
                <div 
                    className={`h-full ${barClass} rounded-full transition-all duration-1000`} 
                    style={{ width: `${(parseInt(value) / parseInt(target)) * 100}%` }}
                ></div>
            </div>
        </div>
    );
};

export default Nutrition;
