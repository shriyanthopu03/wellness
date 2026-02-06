import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Mic, MicOff, Volume2 } from 'lucide-react';
import axios from 'axios';

const Chat = ({ messages, setMessages, userContext }) => {
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [wasVoiceRequest, setWasVoiceRequest] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
                setWasVoiceRequest(true); // Flag that this was a voice input
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
            setWasVoiceRequest(false);
        }
    };

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            // Cancel any current speech
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        const currentWasVoice = wasVoiceRequest; // Capture flag
        setInput("");
        setWasVoiceRequest(false);
        setIsLoading(true);

        try {
            // Call Backend API
            const response = await axios.post('http://localhost:8000/chat', {
                user_id: userContext.user_id,
                message: userMsg.content,
                context: userContext
            });

            const botMsg = { role: 'assistant', content: response.data.response };
            setMessages(prev => [...prev, botMsg]);
            
            // Voice response if it was a voice request
            if (currentWasVoice) {
                speak(response.data.response);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMsg = { role: 'assistant', content: "Sorry, I'm having trouble connecting right now." };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 flex flex-col h-[calc(100vh-180px)] md:h-[600px] lg:h-[700px] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-brand/20 p-3 rounded-2xl border border-brand/30">
                        <Bot className="text-brand" size={24} />
                    </div>
                    <div>
                        <h2 className="font-black text-slate-100 uppercase tracking-wider text-sm">AroMi Coach</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Neural Mode Active</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                        <Volume2 size={14} className="text-slate-400" />
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.05),transparent)]">
                {messages.length === 0 && (
                    <div className="text-center text-slate-500 mt-20">
                        <Bot className="mx-auto mb-4 text-slate-700" size={48} />
                        <p className="text-sm font-medium">Greetings, {userContext.name}.</p>
                        <p className="text-xs text-slate-600 mt-1">How can I optimize your wellness today?</p>
                    </div>
                )}
                
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div 
                            className={`max-w-[85%] p-4 rounded-2xl ${
                                msg.role === 'user' 
                                    ? 'bg-brand text-slate-900 font-bold rounded-tr-none shadow-lg shadow-brand/10' 
                                    : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
                            }`}
                        >
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-800/50 p-4 rounded-2xl rounded-tl-none border border-slate-700/50 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce delay-150"></span>
                            <span className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce delay-300"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="p-6 bg-slate-900 border-t border-slate-800">
                <div className="flex gap-3 items-center bg-slate-800/50 p-2 rounded-2xl border border-slate-700 focus-within:border-brand/50 transition-all">
                    <button 
                        type="button"
                        onClick={toggleListening}
                        className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-slate-400 hover:text-brand hover:bg-slate-700'}`}
                        title={isListening ? "Listening..." : "Voice Command"}
                    >
                        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="System protocol or voice query..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-slate-200 placeholder:text-slate-600 text-sm py-2"
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading || !input.trim()}
                        className="bg-brand hover:bg-brand-dark disabled:bg-slate-800 disabled:text-slate-600 text-slate-900 font-bold p-3 rounded-xl transition-all shadow-lg shadow-brand/20 active:scale-95"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat;
