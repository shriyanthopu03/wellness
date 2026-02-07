import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import Profile from './components/Profile';
import WellnessPlan from './components/WellnessPlan';
import Store from './components/Store';
import Doubts from './components/Doubts';
import Fitness from './components/Fitness';
import Mindfulness from './components/Mindfulness';
import Reminders from './components/Reminders';
import Reports from './components/Reports';
import Login from './components/Login';
import axios from 'axios';
import { userAPI } from './services/api';
import { LayoutDashboard, MessageSquare, HeartPulse, ShoppingBag, HelpCircle, UserCircle, Activity, Wind, RefreshCw, Bell, Users, BarChart2, LogOut } from 'lucide-react';
import { useEffect } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSyncing, setIsSyncing] = useState(false);
  const [cart, setCart] = useState([]);
  
  const [userContext, setUserContext] = useState({
    user_id: localStorage.getItem('aromi_user_id') || "user_123",
    name: "",
    age: null,
    gender: null,
    height: null,
    weight: null,
    mood: "neutral",
    energy_level: 5,
    activity_type: "sedentary",
    lifestyle_inputs: {
        sleep_hours: 0,
        diet_type: "None",
        activity_level: "sedentary"
    },
    health_goals: [],
    steps: 0,
    calories_burned: 0,
    todos: [],
    vitals: {
        heart_rate: 0,
        bmi: 0,
        daily_calories: 0,
        fitness_level: "Unknown",
        sleep_quality: "unknown"
    },
    last_interaction: null
  });

  // Check for existing session on mount
  useEffect(() => {
    const savedUserId = localStorage.getItem('aromi_user_id');
    if (savedUserId) {
        setIsAuthenticated(true);
        userAPI.getUser(savedUserId).then(data => {
            if (data) {
                setUserContext(data);
            }
        }).catch(err => {
            console.error("Session restoration failed:", err);
            localStorage.removeItem('aromi_user_id');
            setIsAuthenticated(false);
        });
    }
  }, []);

  const handleLogin = (userData) => {
    setUserContext(userData);
    setIsAuthenticated(true);
    localStorage.setItem('aromi_user_id', userData.user_id);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('aromi_user_id');
    setActiveTab('dashboard');
  };

  // Fetch initial data from DB on login (Only if not already loaded by login)
  useEffect(() => {
    if (isAuthenticated && !userContext.name) {
        userAPI.getUser(userContext.user_id).then(data => {
            if (data) {
                setUserContext(data);
            }
        });
    }
  }, [isAuthenticated, userContext.user_id]);

  // Save data to DB whenever goals, todos, or core profile changes
  // Exclude heart_rate from the dependency to avoid constant server writes
  useEffect(() => {
    if (!isAuthenticated) return;
    
    setIsSyncing(true);
    const timer = setTimeout(() => {
        userAPI.updateUser(userContext).then(() => {
            setIsSyncing(false);
        }).catch(err => {
            console.error("Auto-sync failed:", err);
            setIsSyncing(false);
        });
    }, 3000);

    return () => clearTimeout(timer);
  }, [
    userContext.health_goals, 
    userContext.todos, 
    userContext.name, 
    userContext.age, 
    userContext.weight, 
    userContext.height,
    userContext.mood,
    userContext.energy_level,
    userContext.activity_type,
    userContext.lifestyle_inputs,
    userContext.vitals?.bmi,
    userContext.vitals?.fitness_level,
    userContext.steps,
    userContext.calories_burned
  ]);

  // Real-time Data Sync Simulation
  useEffect(() => {
    if (!isAuthenticated) return;

    const syncInterval = setInterval(() => {
        setUserContext(prev => {
            if (!prev.vitals) return prev;
            // Simulate natural heart rate fluctuation (68-76 bpm)
            const hrChange = Math.floor(Math.random() * 3) - 1;
            const newHr = Math.max(60, Math.min(100, (prev.vitals.heart_rate || 72) + hrChange));

            return {
                ...prev,
                vitals: {
                    ...prev.vitals,
                    heart_rate: newHr
                }
            };
        });
    }, 5000); // Sync every 5 seconds

    // Real API: Battery Status (Sync with Energy Level)
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            const updateEnergy = () => {
                const level = Math.round(battery.level * 10);
                setUserContext(prev => ({ ...prev, energy_level: level }));
            };
            battery.addEventListener('levelchange', updateEnergy);
            updateEnergy();
        });
    }

    return () => clearInterval(syncInterval);
  }, [isAuthenticated]);

  const [messages, setMessages] = useState([]);

  const getProactiveRecommendation = async () => {
    try {
        const response = await axios.post('http://localhost:8000/recommendation', userContext);
        const rec = response.data;
        const botMsg = { 
            role: 'assistant', 
            content: `💡 **Tip:** ${rec.suggestion}\n\n*Why?* ${rec.reasoning}` 
        };
        setMessages(prev => [...prev, botMsg]);
        setActiveTab('chat'); // Switch to chat to see the tip
    } catch (error) {
        console.error("Error fetching recommendation:", error);
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans transition-all duration-500 fade-in text-slate-100">
        
        {/* Sidebar Navigation */}
        <aside className="fixed left-0 top-0 h-full w-20 md:w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800/50 z-50 flex flex-col items-center md:items-start p-4">
             <div className="mb-8 md:px-4 py-6">
                <h1 className="text-3xl font-black text-white tracking-tighter hidden md:block uppercase italic">
                    AroMi<span className="text-brand not-italic text-2xl">.AI</span>
                </h1>
                <span className="text-2xl font-black text-brand md:hidden">A.</span>
            </div>

            <nav className="flex-1 w-full space-y-4 overflow-y-auto pr-1 flex flex-col custom-scrollbar py-4">
                <NavButton 
                    icon={<LayoutDashboard size={22}/>} 
                    label="Dashboard" 
                    active={activeTab === 'dashboard'} 
                    onClick={() => setActiveTab('dashboard')} 
                />
                 <NavButton 
                    icon={<Activity size={22}/>} 
                    label="Fitness" 
                    active={activeTab === 'fitness'} 
                    onClick={() => setActiveTab('fitness')} 
                />
                 <NavButton 
                    icon={<Wind size={22}/>} 
                    label="Mindfulness" 
                    active={activeTab === 'mindfulness'} 
                    onClick={() => setActiveTab('mindfulness')} 
                />
                 <NavButton 
                    icon={<Bell size={22}/>} 
                    label="Reminders" 
                    active={activeTab === 'reminders'} 
                    onClick={() => setActiveTab('reminders')} 
                />
                 <NavButton 
                    icon={<BarChart2 size={22}/>} 
                    label="Prescription Analysis" 
                    active={activeTab === 'reports'} 
                    onClick={() => setActiveTab('reports')} 
                />
                 <NavButton 
                    icon={<MessageSquare size={22}/>} 
                    label="AI Coach" 
                    active={activeTab === 'chat'} 
                    onClick={() => setActiveTab('chat')} 
                />
                 <NavButton 
                    icon={<HeartPulse size={22}/>} 
                    label="Daily Plan" 
                    active={activeTab === 'wellness'} 
                    onClick={() => setActiveTab('wellness')} 
                />
                 <NavButton 
                    icon={<HelpCircle size={22}/>} 
                    label="Ask Doubts" 
                    active={activeTab === 'doubts'} 
                    onClick={() => setActiveTab('doubts')} 
                />
                 <div className="relative w-full">
                    <NavButton 
                        icon={<ShoppingBag size={22}/>} 
                        label="Store" 
                        active={activeTab === 'store'} 
                        onClick={() => setActiveTab('store')} 
                    />
                    {cart.length > 0 && (
                        <div className="absolute top-2 right-4 bg-brand text-slate-950 text-[10px] font-black h-4 w-4 rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-brand/40 pointer-events-none">
                            {cart.reduce((acc, i) => acc + (i.quantity || 1), 0)}
                        </div>
                    )}
                </div>
            </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 ml-20 md:ml-64 p-4 md:p-8 min-h-screen bg-[#0b0f1a] relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>
            
            {activeTab !== 'dashboard' && (
                <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                 <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                        {activeTab === 'profile' ? 'System Profile' : 
                        activeTab === 'fitness' ? 'Fitness Cycles' :
                        activeTab === 'mindfulness' ? 'Neural Calm' :
                        activeTab === 'reminders' ? 'Operational Tasks' :
                        activeTab === 'reports' ? 'Core Insights' :
                        activeTab === 'doubts' ? 'Query Hub' : 
                        activeTab === 'dashboard' ? 'Health Summary' : 
                        activeTab === 'chat' ? 'Coach Interface' : 
                        activeTab === 'wellness' ? 'Vision Optimizer' : 
                        'Inventory Matrix'}
                    </h2>
                    <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.4em] mt-1">Authorized Access: {userContext.name || 'Anonymous'}</p>
                 </div>

                 <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all duration-300 ${
                            activeTab === 'profile' 
                                ? 'bg-brand border-brand text-slate-950 font-black shadow-lg shadow-brand/20' 
                                : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-brand/40 hover:text-white'
                        }`}
                    >
                        <UserCircle size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Profile</span>
                    </button>

                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-800 bg-slate-900/50 text-slate-400 hover:border-red-500/40 hover:text-red-500 transition-all duration-300"
                    >
                        <LogOut size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Log Out</span>
                    </button>
                    
                    <div className="h-8 w-[1px] bg-slate-800 mx-2 hidden md:block"></div>

                    <div className="flex flex-col items-center px-4 py-2 bg-brand/10 border border-brand/20 rounded-2xl">
                        <span className="text-[8px] font-black text-brand uppercase tracking-widest mb-0.5">Status</span>
                        <span className="text-xs font-black text-white uppercase tracking-tighter italic flex items-center gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-brand animate-pulse"></div>
                            {userContext.mood}
                        </span>
                    </div>
                 </div>
            </header>
            )}
                {activeTab === 'dashboard' && (
                     <Dashboard 
                        userContext={userContext} 
                        setUserContext={setUserContext}
                        onGetRecommendation={getProactiveRecommendation}
                        setActiveTab={setActiveTab}
                        handleLogout={handleLogout}
                    />
                )}

                {activeTab === 'fitness' && (
                    <Fitness userContext={userContext} setUserContext={setUserContext} />
                )}

                {activeTab === 'mindfulness' && (
                    <Mindfulness userContext={userContext} />
                )}

                {activeTab === 'reminders' && (
                    <Reminders />
                )}

                {activeTab === 'reports' && (
                    <Reports userContext={userContext} />
                )}

                {activeTab === 'chat' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <section className="lg:col-span-2">
                            <Chat 
                                messages={messages} 
                                setMessages={setMessages} 
                                userContext={userContext}
                            />
                        </section>
                        <section className="hidden lg:block">
                            <div className="bg-slate-900/50 border border-slate-800/50 rounded-[2.5rem] p-8 h-full">
                                <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-8 pb-4 border-b border-slate-800">Operational Data</h3>
                                <ul className="space-y-6">
                                    <li className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Energy Sync</span>
                                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-brand rounded-full transition-all duration-1000" 
                                                style={{ width: `${(userContext.energy_level || 5) * 10}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs font-bold text-slate-300 mt-1">{userContext.energy_level || 5}/10 UNIT</span>
                                    </li>
                                    <li className="flex justify-between items-center py-4 border-b border-slate-800/30">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol</span>
                                        <span className="text-xs font-bold text-brand uppercase">{userContext.activity_type}</span>
                                    </li>
                                    <li className="flex justify-between items-center py-4 border-b border-slate-800/30">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</span>
                                        <span className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></div>
                                            <span className="text-xs font-bold text-white uppercase">SYNCHRONIZED</span>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'wellness' && (
                    <WellnessPlan userContext={userContext} />
                )}

                {activeTab === 'doubts' && (
                    <Doubts userContext={userContext} />
                )}

                {activeTab === 'store' && (
                    <Store cart={cart} setCart={setCart} />
                )}
                {activeTab === 'profile' && (
                    <Profile 
                        userContext={userContext} 
                        setUserContext={setUserContext} 
                    />
                )}
        </main>
    </div>
  );
}

const NavButton = ({ icon, label, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-5 p-5 rounded-2xl transition-all duration-300 group ${
            active 
                ? 'bg-brand text-slate-950 shadow-lg shadow-brand/20 scale-105' 
                : 'text-slate-500 hover:text-white overflow-hidden relative'
        }`}
    >
        <span className="transition-transform group-hover:scale-110 duration-300 relative z-10">{icon}</span>
        <span className="hidden md:inline text-[11px] font-black uppercase tracking-[0.2em] relative z-10">{label}</span>
        {!active && <div className="absolute inset-0 bg-slate-800/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
    </button>
);


export default App;
