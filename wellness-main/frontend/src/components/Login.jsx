import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Sparkles, User, ArrowRight } from 'lucide-react';
import { userAPI } from '../services/api';

const Login = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const userId = email.replace(/[@.]/g, '_');

        try {
            if (isLogin) {
                // Login validation: must exist in database
                const userData = await userAPI.login(email);
                onLogin(userData);
            } else {
                // Sign up: create new user
                const newUserContext = {
                    user_id: userId,
                    name: fullName || email.split('@')[0],
                    age: 25,
                    gender: "other",
                    height: 170,
                    weight: 70,
                    mood: "neutral",
                    energy_level: 5,
                    activity_type: "sedentary",
                    lifestyle_inputs: {
                        sleep_hours: 8,
                        diet_type: "None",
                        activity_level: "sedentary"
                    },
                    health_goals: [],
                    steps: 0,
                    calories_burned: 0,
                    todos: [],
                    vitals: {
                        heart_rate: 72,
                        bmi: 24.2,
                        daily_calories: 2000,
                        fitness_level: "Unknown",
                        sleep_quality: "Good"
                    }
                };
                const result = await userAPI.signup(newUserContext);
                onLogin(result.user);
            }
        } catch (err) {
            setError(err.response?.data?.detail || "System rejected provided credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Neural Background Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.05),transparent)] pointer-events-none"></div>
            
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"
            />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10"
            >
                <div className="text-center mb-12">
                    <motion.div 
                        initial={{ rotate: -20, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="inline-flex items-center justify-center p-5 bg-brand/10 border border-brand/20 rounded-3xl mb-8 shadow-lg"
                    >
                        <Sparkles className="text-brand" size={48} />
                    </motion.div>
                    
                    <h2 className="text-5xl font-black text-white mb-3 tracking-tighter uppercase italic">
                        AroMi<span className="text-brand text-4xl not-italic">.AI</span>
                    </h2>
                    <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px]">
                        {isLogin ? 'Neural Interface Access' : 'Create System Profile'}
                    </p>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-widest py-3 rounded-2xl mb-8 text-center"
                    >
                        [Error]: {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative"
                        >
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                            <input 
                                type="text" 
                                placeholder="FULL NAME"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-5 pl-14 pr-6 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-brand transition-all font-bold text-sm"
                                required={!isLogin}
                            />
                        </motion.div>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="EMAIL ID"
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-5 pl-14 pr-6 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-brand transition-all font-bold text-sm"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="PASSWORD"
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-5 pl-14 pr-6 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-brand transition-all font-bold text-sm"
                            required
                        />
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit"
                            disabled={loading}
                            className={`w-full group flex items-center justify-center gap-4 py-5 bg-brand text-slate-900 rounded-[2.5rem] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand/20 ${loading ? 'opacity-50' : ''}`}
                        >
                            <span className="text-sm font-black uppercase tracking-[0.2em]">{isLogin ? 'Login Now' : 'Register Profile'}</span>
                            {loading ? <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div> : <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />}
                        </button>
                    </div>
                </form>

                <div className="mt-10 text-center">
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-slate-500 hover:text-brand transition-all text-[10px] font-black uppercase tracking-widest border-b border-transparent hover:border-brand pb-1"
                    >
                        {isLogin ? "If new user? Signup" : "Return to Interface"}
                    </button>
                </div>
            </motion.div>
            
            {/* Scroll/Mouse following subtle effect can go here */}
        </div>
    );
};

export default Login;
