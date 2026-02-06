import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

const Welcome = ({ onStart }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-500 via-emerald-600 to-green-800 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background Shapes */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-300/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            
            <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 md:p-12 text-center text-white shadow-2xl relative z-10 mx-4">
                <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-6">
                    <Sparkles className="text-yellow-300" size={32} />
                </div>
                
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 md:mb-6 tracking-tight">
                    AroMi<span className="text-teal-200">.AI</span>
                </h1>
                
                <p className="text-lg md:text-2xl text-gray-100 mb-6 md:mb-8 font-light leading-relaxed">
                    Your adaptive companion for physical vitality, mental clarity, and lifestyle balance.
                </p>

                <div className="space-y-4">
                    <p className="text-sm font-medium text-teal-100 uppercase tracking-widest">
                        Powered by Gemini AI (Beta)
                    </p>
                    
                    <button 
                        onClick={onStart}
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-teal-800 text-lg font-bold rounded-full hover:bg-teal-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        Start Your Journey
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
