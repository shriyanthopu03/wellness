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
            setAnswer("Sorry, I couldn't process your request right now. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
                    <HelpCircle className="text-indigo-600" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Ask Any Doubt</h2>
                <p className="text-gray-500 mt-2">Clear your confusion about health, science, or anything on your mind.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <form onSubmit={handleAsk} className="relative">
                    <textarea 
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="E.g., Why is the sky blue? or Is keto safe?"
                        className="w-full p-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[120px] resize-none text-lg"
                    />
                    <button 
                        type="submit" 
                        disabled={loading || !question.trim()}
                        className="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors shadow-md"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>

            {loading && (
                <div className="text-center py-8">
                    <div className="animate-pulse flex flex-col items-center gap-2">
                        <div className="h-2 w-48 bg-gray-200 rounded"></div>
                        <div className="h-2 w-32 bg-gray-200 rounded"></div>
                        <span className="text-gray-400 text-sm mt-2">Analyzing medical context...</span>
                    </div>
                </div>
            )}

            {answer && (
                <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-xl shadow-sm">
                    <h3 className="font-bold text-indigo-900 mb-2">AroMi says:</h3>
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{answer}</p>
                </div>
            )}
            
            <div className="text-center text-xs text-gray-400 mt-8">
                Disclaimer: AroMi is an AI assistant, not a doctor. This information is for educational purposes only.
            </div>
        </div>
    );
};

export default Doubts;
