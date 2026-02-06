import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import axios from 'axios';

const Chat = ({ messages, setMessages, userContext }) => {
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
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
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMsg = { role: 'assistant', content: "Sorry, I'm having trouble connecting right now." };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col h-[calc(100vh-180px)] md:h-[600px] lg:h-[700px]">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-brand-light/30 rounded-t-2xl flex items-center gap-3">
                <div className="bg-brand p-2 rounded-full">
                    <Bot className="text-white" size={24} />
                </div>
                <div>
                    <h2 className="font-bold text-gray-800">AroMi Coach</h2>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-xs text-gray-500">Online | Adaptive Mode</span>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 mt-10">
                        <p>Hi {userContext.name}! I'm ready to help you thrive today.</p>
                    </div>
                )}
                
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div 
                            className={`max-w-[80%] p-4 rounded-2xl ${
                                msg.role === 'user' 
                                    ? 'bg-brand text-white rounded-br-none shadow-md shadow-brand/20' 
                                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                            }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-none flex items-center gap-2">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="p-4 border-t border-gray-100">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none"
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading || !input.trim()}
                        className="bg-brand hover:bg-brand-dark disabled:bg-gray-300 text-white p-3 rounded-xl transition-colors shadow-md shadow-brand/20"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat;
