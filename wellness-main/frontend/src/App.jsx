import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import Profile from './components/Profile';
import WellnessPlan from './components/WellnessPlan';
import Store from './components/Store';
import Doubts from './components/Doubts';
import Fitness from './components/Fitness';
import Nutrition from './components/Nutrition';
import Mindfulness from './components/Mindfulness';
import Reminders from './components/Reminders';
import Reports from './components/Reports';
import Login from './components/Login';
import axios from 'axios';
import { userAPI } from './services/api';
import { LayoutDashboard, MessageSquare, HeartPulse, ShoppingBag, HelpCircle, UserCircle, Activity, Utensils, Wind, RefreshCw, Bell, Users, BarChart2 } from 'lucide-react';
import { useEffect } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [userContext, setUserContext] = useState({
    user_id: "user_123",
    name: "",
    age: 0,
    gender: "",
    height: 0,
    weight: 0,
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
    location: null,
    last_interaction: null
  });

  // Fetch initial data from DB on login
  useEffect(() => {
    if (isAuthenticated) {
        userAPI.getUser(userContext.user_id).then(data => {
            if (data) {
                setUserContext(data);
            }
        });
    }
  }, [isAuthenticated]);

  // Save data to DB whenever goals, todos, or profile changes
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Use a small delay/debounce for saving to avoid too many writes
    const timer = setTimeout(() => {
        userAPI.updateUser(userContext);
    }, 2000);

    return () => clearTimeout(timer);
  }, [
    userContext.health_goals, 
    userContext.todos, 
    userContext.name, 
    userContext.age, 
    userContext.weight, 
    userContext.height, 
    userContext.steps,
    userContext.mood,
    userContext.energy_level,
    userContext.lifestyle_inputs,
    userContext.vitals
  ]);

  // Real-time Data Sync Simulation
  useEffect(() => {
    if (!isAuthenticated) return;

    const syncInterval = setInterval(() => {
        setUserContext(prev => {
            // Simulate natural heart rate fluctuation (68-76 bpm)
            const hrChange = Math.floor(Math.random() * 3) - 1;
            const newHr = Math.max(60, Math.min(100, (prev.vitals?.heart_rate || 72) + hrChange));

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

    // Real API: Geolocation
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((pos) => {
            setUserContext(prev => ({ 
                ...prev, 
                location: `${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}` 
            }));
        });
    }

    return () => clearInterval(syncInterval);
  }, [isAuthenticated]);

  const [messages, setMessages] = useState([]);

  const handleLogin = (userData) => {
    setUserContext(prev => ({ 
        ...prev, 
        user_id: userData.user_id,
        name: userData.name 
    }));
    setIsAuthenticated(true);
  };

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
             <div className="mb-12 md:px-4 py-6">
                <h1 className="text-3xl font-black text-white tracking-tighter hidden md:block uppercase italic">
                    AroMi<span className="text-brand not-italic text-2xl">.AI</span>
                </h1>
                <span className="text-2xl font-black text-brand md:hidden">A.</span>
            </div>

            <nav className="flex-1 w-full space-y-1.5 overflow-y-auto pr-1 custom-scrollbar">
                <NavButton 
                    icon={<LayoutDashboard size={20}/>} 
                    label="Dashboard" 
                    active={activeTab === 'dashboard'} 
                    onClick={() => setActiveTab('dashboard')} 
                />
                 <NavButton 
                    icon={<Activity size={20}/>} 
                    label="Fitness" 
                    active={activeTab === 'fitness'} 
                    onClick={() => setActiveTab('fitness')} 
                />
                 <NavButton 
                    icon={<Utensils size={20}/>} 
                    label="Nutrition" 
                    active={activeTab === 'nutrition'} 
                    onClick={() => setActiveTab('nutrition')} 
                />
                 <NavButton 
                    icon={<Wind size={20}/>} 
                    label="Mindfulness" 
                    active={activeTab === 'mindfulness'} 
                    onClick={() => setActiveTab('mindfulness')} 
                />
                 <NavButton 
                    icon={<Bell size={20}/>} 
                    label="Reminders" 
                    active={activeTab === 'reminders'} 
                    onClick={() => setActiveTab('reminders')} 
                />
                 <NavButton 
                    icon={<BarChart2 size={20}/>} 
                    label="Health Reports" 
                    active={activeTab === 'reports'} 
                    onClick={() => setActiveTab('reports')} 
                />
                 <NavButton 
                    icon={<MessageSquare size={20}/>} 
                    label="AI Coach" 
                    active={activeTab === 'chat'} 
                    onClick={() => setActiveTab('chat')} 
                />
                 <NavButton 
                    icon={<HeartPulse size={20}/>} 
                    label="Daily Plan" 
                    active={activeTab === 'wellness'} 
                    onClick={() => setActiveTab('wellness')} 
                />
                 <NavButton 
                    icon={<HelpCircle size={20}/>} 
                    label="Ask Doubts" 
                    active={activeTab === 'doubts'} 
                    onClick={() => setActiveTab('doubts')} 
                />
                 <NavButton 
                    icon={<ShoppingBag size={20}/>} 
                    label="Store" 
                    active={activeTab === 'store'} 
                    onClick={() => setActiveTab('store')} 
                />
                 <NavButton 
                    icon={<UserCircle size={20}/>} 
                    label="Profile" 
                    active={activeTab === 'profile'} 
                    onClick={() => setActiveTab('profile')} 
                />
            </nav>

             <div className="mt-auto md:px-4 w-full py-6">
                <button 
                    onClick={() => setIsAuthenticated(false)} 
                    className="flex items-center gap-3 w-full p-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-red-500 transition-colors border border-transparent hover:border-red-500/20 rounded-2xl"
                >
                    <span className="hidden md:inline">Log Out</span>
                </button>
            </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 ml-20 md:ml-64 p-4 md:p-10 min-h-screen bg-slate-950 relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] pointer-events-none"></div>
            
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                 <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                        {activeTab === 'profile' ? 'System Profile' : 
                        activeTab === 'fitness' ? 'Fitness Cycles' :
                        activeTab === 'nutrition' ? 'Nutrition Matrix' :
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

                 <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-2">
                            {userContext.location ? `COORD: ${userContext.location}` : 'GPS_OFFLINE'}
                        </span>
                        <div className="flex gap-1.5">
                            {[1,2,3,4,5].map(i => <div key={i} className={`h-1 w-6 rounded-full ${i <= 4 ? 'bg-brand' : 'bg-slate-800'}`}></div>)}
                        </div>
                    </div>
                    
                    <div className="h-10 w-[1px] bg-slate-800 mx-2 hidden md:block"></div>

                    <button 
                        onClick={() => {
                            setIsSyncing(true);
                            setTimeout(() => setIsSyncing(false), 2000);
                        }}
                        className={`p-3 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-brand/50 transition-all ${isSyncing ? 'animate-spin text-brand' : 'text-slate-400'}`}
                    >
                        <RefreshCw size={18} />
                    </button>
                    
                    <div className="flex flex-col items-center px-4 py-2 bg-brand/10 border border-brand/20 rounded-2xl">
                        <span className="text-[8px] font-black text-brand uppercase tracking-widest mb-0.5">Core_Mood</span>
                        <span className="text-xs font-black text-white uppercase tracking-tighter italic">
                            {userContext.mood}
                        </span>
                    </div>
                 </div>
            </header>

            <div className="max-w-7xl mx-auto w-full relative z-10">
                {activeTab === 'dashboard' && (
                     <Dashboard 
                        userContext={userContext} 
                        setUserContext={setUserContext}
                        onGetRecommendation={getProactiveRecommendation}
                    />
                )}

                {activeTab === 'fitness' && (
                    <Fitness userContext={userContext} setUserContext={setUserContext} />
                )}

                {activeTab === 'nutrition' && (
                    <Nutrition userContext={userContext} />
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
                    <Store />
                )}
                {activeTab === 'profile' && (
                    <Profile 
                        userContext={userContext} 
                        setUserContext={setUserContext} 
                    />
                )}            </div>
        </main>
    </div>
  );
}

const NavButton = ({ icon, label, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${
            active 
                ? 'bg-brand text-slate-950 shadow-lg shadow-brand/20 scale-105' 
                : 'text-slate-500 hover:text-white pro overflow-hidden relative'
        }`}
    >
        <span className="transition-transform group-hover:scale-110 duration-300 relative z-10">{icon}</span>
        <span className="hidden md:inline text-xs font-black uppercase tracking-[0.2em] relative z-10">{label}</span>
        {!active && <div className="absolute inset-0 bg-slate-800/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
    </button>
);


export default App;
