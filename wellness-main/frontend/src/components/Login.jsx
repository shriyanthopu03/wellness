import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Sparkles, User, ArrowRight } from 'lucide-react';

const Login = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you would validate credentials here
        onLogin({ email, name: email.split('@')[0] || "User" });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-500 via-emerald-600 to-green-800 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Animated Ambient Background Elements */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, -45, 0],
                    opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-teal-300/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"
            />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10"
            >
                <div className="text-center mb-10">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
                        className="inline-flex items-center justify-center p-4 bg-white/20 rounded-2xl mb-6 shadow-inner"
                    >
                        <Sparkles className="text-yellow-300" size={40} />
                    </motion.div>
                    
                    <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
                        AroMi<span className="text-teal-200">.AI</span>
                    </h2>
                    <p className="text-teal-50 font-medium opacity-80 uppercase tracking-widest text-xs">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="relative"
                        >
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-200/60" size={20} />
                            <input 
                                type="text" 
                                placeholder="Full Name"
                                className="w-full bg-white/5 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-teal-100/40 focus:outline-none focus:ring-2 focus:ring-teal-300/50 focus:bg-white/10 transition-all"
                                required
                            />
                        </motion.div>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-200/60" size={20} />
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                            className="w-full bg-white/5 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-teal-100/40 focus:outline-none focus:ring-2 focus:ring-teal-300/50 focus:bg-white/10 transition-all"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-200/60" size={20} />
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full bg-white/5 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-teal-100/40 focus:outline-none focus:ring-2 focus:ring-teal-300/50 focus:bg-white/10 transition-all"
                            required
                        />
                    </div>

                    <button 
                        type="submit"
                        className="w-full group relative flex items-center justify-center gap-3 px-8 py-4 bg-white text-teal-800 text-lg font-bold rounded-2xl hover:bg-teal-50 transition-all duration-300 transform hover:scale-[1.02] shadow-lg active:scale-[0.98]"
                    >
                        {isLogin ? 'Sign In' : 'Sign Up'}
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-teal-100/80 hover:text-white transition-colors text-sm font-medium border-b border-transparent hover:border-teal-200/50 pb-1"
                    >
                        {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign In"}
                    </button>
                </div>
            </motion.div>
            
            {/* Scroll/Mouse following subtle effect can go here */}
        </div>
    );
};

export default Login;
