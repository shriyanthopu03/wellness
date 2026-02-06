import React, { useEffect, useState } from 'react';
import { Utensils, Award, Dumbbell, Sparkles, Camera, Loader2 } from 'lucide-react';
import axios from 'axios';

const WellnessPlan = ({ userContext }) => {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [mealInsight, setMealInsight] = useState("");
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
                analyzeMeal(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const analyzeMeal = async (base64Image) => {
        setAnalyzing(true);
        try {
            const response = await axios.post('http://localhost:8000/analyze-meal', {
                user_id: userContext.user_id,
                image_data: base64Image,
                context: userContext
            });
            setMealInsight(response.data.insight);
        } catch (error) {
            console.error("Analysis failed", error);
            setMealInsight("Sorry, I couldn't analyze the image. Please try again with a clearer photo.");
        } finally {
            setAnalyzing(false);
        }
    };

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const response = await axios.post('http://localhost:8000/wellness-plan', userContext);
                setPlan(response.data);
            } catch (error) {
                console.error("Failed to load plan", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlan();
    }, [userContext.energy_level, userContext.mood]);

    if (loading) return <div className="p-8 text-center text-gray-500">Generating your personalized plan... <Sparkles className="inline animate-spin ml-2"/></div>;

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                <h2 className="text-2xl font-bold mb-2">Daily Wisdom</h2>
                <p className="text-lg italic opacity-90">"{plan?.daily_tip}"</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
                    <div className="flex items-center gap-3 mb-4 text-orange-600">
                        <Dumbbell size={24} />
                        <h3 className="text-xl font-bold">Workout of the Day</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                        {plan?.workout_plan}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100">
                    <div className="flex items-center gap-3 mb-4 text-green-600">
                        <Utensils size={24} />
                        <h3 className="text-xl font-bold">Nutrition Focus</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                        {plan?.diet_suggestion}
                    </p>
                </div>
            </div>

            {/* AI Meal Analyzer */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-brand-light/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Camera size={120} />
                </div>
                
                <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                    <Camera className="text-brand" size={28} />
                    AI Meal Analyzer
                </h3>

                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <p className="text-gray-600">
                            Upload a photo of your meal, and AroMi will analyze its nutritional value and alignment with your goals.
                        </p>
                        
                        <div className="relative group">
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageChange}
                                className="hidden" 
                                id="meal-upload"
                                disabled={analyzing}
                            />
                            <label 
                                htmlFor="meal-upload" 
                                className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl p-12 cursor-pointer transition-all hover:border-brand hover:bg-brand/5 ${analyzing ? 'opacity-50 pointer-events-none' : ''}`}
                            >
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="w-full max-h-48 object-contain rounded-2xl mb-4" />
                                ) : (
                                    <Camera size={48} className="text-gray-300 mb-2 group-hover:text-brand transition-colors" />
                                )}
                                <span className="text-sm font-bold text-gray-500 group-hover:text-brand">
                                    {previewUrl ? "Change Photo" : "Upload Meal Image"}
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 min-h-[200px] flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">AroMi Insights</span>
                        {analyzing ? (
                            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-500">
                                <Loader2 className="animate-spin text-brand" size={32} />
                                <p className="text-sm font-medium">Analyzing ingredients & macros...</p>
                            </div>
                        ) : mealInsight ? (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {mealInsight}
                                </p>
                                <div className="p-4 bg-brand/10 rounded-2xl border border-brand/20">
                                    <p className="text-xs text-brand font-bold">
                                        Tip: Log this meal to your journal to track your progress!
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-400 italic text-sm text-center">
                                Upload a meal photo to get started...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WellnessPlan;
