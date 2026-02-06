import React, { useState } from 'react';
import { HelpCircle, Send } from 'lucide-react';
import axios from 'axios';

const Doubts = ({ userContext }) => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAsk = async (e) => {
        e.preventDefault();
        if (!question.trim()) return;

        setLoading(true);
        setAnswer(null);

        try {
            const response = await axios.post('http://localhost:8000/clarify-doubt', {
                user_id: userContext.user_id,
                question: question,
                context: userContext
            });
            setAnswer(response.data.answer);
        } catch (error) {
            console.error("Error asking doubt:", error);
            setAnswer("Neural Link Failure. Retrying connection... (Sorry, I couldn't process your request right now.)");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center relative">
                <div className="absolute inset-0 bg-brand/5 blur-[100px] -z-10 rounded-full"></div>
                <div className="inline-flex items-center justify-center p-5 bg-brand/10 rounded-[2rem] border border-brand/20 mb-8 shadow-2xl shadow-brand/10">
                    <HelpCircle className="text-brand" size={48} />
                </div>
                <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic mb-4">Neural Query</h2>
                <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.4em]">Decrypt the unknown through AroMi's logic core</p>
            </div>

            <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl border border-slate-800 relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <form onSubmit={handleAsk} className="relative z-10">
                    <textarea 
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="E.g., BIO-CHEMICAL STABILITY OF KETO?"
                        className="w-full p-8 bg-slate-950 border border-slate-800 rounded-[2rem] focus:ring-2 focus:ring-brand/50 focus:border-brand/50 focus:outline-none min-h-[160px] resize-none text-xl font-medium text-slate-100 tracking-tight transition-all placeholder:text-slate-700 shadow-inner"
                    />
                    <button 
                        type="submit" 
                        disabled={loading || !question.trim()}
                        className="absolute bottom-6 right-6 bg-brand hover:scale-110 active:scale-95 disabled:grayscale disabled:opacity-30 disabled:scale-100 text-slate-950 p-4 rounded-2xl transition-all shadow-xl shadow-brand/20 z-20"
                    >
                        <Send size={24} />
                    </button>
                </form>
            </div>

            {loading && (
                <div className="flex flex-col items-center gap-6 py-12">
                    <div className="flex gap-2">
                        <div className="w-2 h-8 bg-brand rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-12 bg-brand rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-8 bg-brand rounded-full animate-bounce"></div>
                    </div>
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Synchronizing logic gates...</span>
                </div>
            )}

            {answer && (
                <div className="bg-slate-900 border-l-4 border-brand p-10 rounded-r-[2rem] shadow-2xl animate-in slide-in-from-left duration-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-3xl"></div>
                    <h3 className="font-black text-brand mb-6 uppercase tracking-widest text-xs italic flex items-center gap-3">
                        <div className="h-px w-8 bg-brand/30"></div>
                        Neural Response
                    </h3>
                    <p className="text-slate-200 leading-relaxed whitespace-pre-wrap text-lg font-medium tracking-tight">
                        {answer}
                    </p>
                </div>
            )}
            
            <div className="text-center">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] border-t border-slate-800 pt-8 max-w-lg mx-auto">
                    AroMi is an AI assistant, not a medical professional. Output data is for computational guidance only.
                </p>
            </div>
        </div>
    );
};

export default Doubts;
