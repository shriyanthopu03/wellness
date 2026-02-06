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
            // Compress and resize image before sending
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Convert to lower quality jpeg to reduce base64 string length
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                    setPreviewUrl(compressedBase64);
                    analyzeMeal(compressedBase64);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const analyzeMeal = async (base64Image) => {
        setAnalyzing(true);
        setMealInsight(""); // Clear previous
        try {
            const response = await axios.post('http://localhost:8000/analyze-meal', {
                user_id: userContext.user_id,
                image_data: base64Image,
                context: userContext
            });
            setMealInsight(response.data.insight);
        } catch (error) {
            console.error("Analysis failed", error);
            const errorMsg = error.response?.data?.insight || "Sorry, I couldn't analyze the image. Please try again with a clearer photo or smaller image.";
            setMealInsight(errorMsg);
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

    if (loading) return (
        <div className="p-20 text-center flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 border-4 border-brand/20 border-t-brand rounded-full animate-spin"></div>
            <p className="text-slate-500 font-black uppercase tracking-[0.2em] animate-pulse">Generating Matrix...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in pb-12 max-w-6xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 text-slate-100 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-brand/10 transition-colors"></div>
                <div className="relative z-10">
                    <h2 className="text-xs font-black text-brand uppercase tracking-[0.3em] mb-4">Neural Tip of the Day</h2>
                    <p className="text-2xl font-black italic tracking-tight leading-snug">"{plan?.daily_tip}"</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-slate-800 flex flex-col group hover:border-blue-500/30 transition-all">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20">
                            <Dumbbell size={28} />
                        </div>
                        <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest">Training Protocol</h3>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-sm font-medium">
                        {plan?.workout_plan}
                    </p>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-slate-800 flex flex-col group hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
                            <Utensils size={28} />
                        </div>
                        <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest">Nutritional Flow</h3>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-sm font-medium">
                        {plan?.diet_suggestion}
                    </p>
                </div>
            </div>

            {/* AI Meal Analyzer */}
            <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                    <Camera size={200} />
                </div>
                
                <h3 className="text-xl font-black text-slate-100 mb-10 flex items-center gap-4 uppercase tracking-[0.2em]">
                    <div className="p-3 bg-brand/10 text-brand rounded-2xl border border-brand/20 shadow-lg">
                        <Camera size={24} />
                    </div>
                    Vision Analyzer
                </h3>

                <div className="grid lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <p className="text-slate-500 text-sm font-medium leading-relaxed uppercase tracking-wide">
                            Input a visual of your substrate. AroMi will compute calorie density and macro alignment with your objective profile.
                        </p>
                        
                        <div className="relative group/upload">
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
                                className={`flex flex-col items-center justify-center border-2 border-dashed border-slate-800 bg-slate-800/20 rounded-[2rem] p-12 cursor-pointer transition-all group-hover/upload:border-brand group-hover/upload:bg-brand/5 ${analyzing ? 'opacity-50 pointer-events-none' : ''}`}
                            >
                                {previewUrl ? (
                                    <div className="relative w-full max-h-60 overflow-hidden rounded-2xl mb-4 border border-slate-700">
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                    </div>
                                ) : (
                                    <Camera size={56} className="text-slate-700 mb-4 group-hover/upload:text-brand transition-all group-hover/upload:scale-110" />
                                )}
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] group-hover/upload:text-brand transition-colors">
                                    {previewUrl ? "Re-Input Data" : "Initiate Optical Scan"}
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="bg-slate-800/30 rounded-[2.5rem] p-8 border border-slate-800/80 min-h-[300px] flex flex-col relative">
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Processing Result</span>
                            <div className="w-2 h-2 rounded-full bg-brand animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.5)]"></div>
                        </div>

                        {analyzing ? (
                            <div className="flex-1 flex flex-col items-center justify-center gap-6">
                                <div className="relative">
                                    <Loader2 className="animate-spin text-brand" size={48} />
                                    <div className="absolute inset-0 bg-brand/20 blur-xl animate-pulse"></div>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Analyzing Composition...</p>
                            </div>
                        ) : mealInsight ? (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-medium bg-slate-900/40 p-6 rounded-2xl border border-slate-800 italic">
                                    "{mealInsight}"
                                </div>
                                <div className="p-5 bg-brand/5 rounded-2xl border border-brand/10">
                                    <p className="text-[10px] text-brand font-black uppercase tracking-[0.2em] leading-relaxed">
                                        Optimization Recommendation: Integrate this data into your daily log for profile recalibration.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-slate-600 italic text-sm text-center font-medium px-8">
                                Awaiting optical input for analysis sequence...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WellnessPlan;
