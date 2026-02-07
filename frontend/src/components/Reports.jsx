import React, { useState } from 'react';
import { Camera, Loader2, Sparkles } from 'lucide-react';
import axios from 'axios';

const Reports = ({ userContext }) => {
    const [prescriptionAnalysis, setPrescriptionAnalysis] = useState("");
    const [analyzing, setAnalyzing] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handlePrescriptionUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
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
                    
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
                    setPreviewUrl(compressedBase64);
                    analyzePrescription(compressedBase64);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const analyzePrescription = async (base64Image) => {
        setAnalyzing(true);
        setPrescriptionAnalysis("");
        try {
            const response = await axios.post('/api/analyze-prescription', {
                user_id: userContext.user_id,
                image_data: base64Image,
                context: userContext
            });
            
            // Handle both success and error messages returned as success from backend
            if (response.data.analysis) {
                setPrescriptionAnalysis(response.data.analysis);
            } else {
                setPrescriptionAnalysis("The AI Vision Core returned an empty response. Please try with a clearer photo.");
            }
        } catch (error) {
            console.error("Prescription analysis failed:", error);
            const status = error.response?.status;
            const detail = error.response?.data?.detail || error.message;
            setPrescriptionAnalysis(`Neural Link Disruption (${status || 'Network Error'}): ${detail}. Please check if the backend is running and you have an active internet connection.`);
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
            {/* Prescription Upload & Analysis Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/10 transition-colors"></div>
                
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Prescription Analysis</h3>
                            <p className="text-slate-500 text-[10px] font-black mt-2 uppercase tracking-[0.4em]">Neural Decoding for Personalized Recovery</p>
                        </div>
                        
                        <label className="flex items-center gap-3 px-8 py-4 bg-brand text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-brand/20 cursor-pointer">
                            <Camera size={18} />
                            Upload Prescription
                            <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handlePrescriptionUpload}
                            />
                        </label>
                    </div>

                    {!prescriptionAnalysis && !analyzing && (
                        <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-[2rem] bg-slate-950/20">
                            <Sparkles className="mx-auto text-slate-700 mb-4" size={48} />
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Awaiting Medical Telemetry...</p>
                        </div>
                    )}

                    {analyzing && (
                        <div className="py-20 text-center flex flex-col items-center justify-center gap-6">
                            <Loader2 className="w-12 h-12 text-brand animate-spin" />
                            <p className="text-slate-500 font-black uppercase tracking-[0.3em] animate-pulse">Scanning Bio-Patterns...</p>
                        </div>
                    )}

                    {prescriptionAnalysis && (
                        <div className="space-y-8 animate-in slide-in-from-top-4 duration-500">
                            <div className="p-8 bg-slate-950/50 border border-slate-800 rounded-[2rem] relative group">
                                <div className="absolute -top-3 left-8 px-4 py-1 bg-brand text-slate-950 text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                    AI Insight Matrix
                                </div>
                                <div className="text-slate-300 leading-relaxed whitespace-pre-wrap font-medium tracking-tight mt-2 prose prose-invert max-w-none">
                                    {prescriptionAnalysis}
                                </div>
                            </div>

                            {previewUrl && (
                                <div className="max-w-xs mx-auto rounded-2xl overflow-hidden border border-slate-800 shadow-2xl opacity-50 hover:opacity-100 transition-opacity">
                                    <img src={previewUrl} alt="Prescription Preview" className="w-full grayscale hover:grayscale-0 transition-all duration-700" />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;
