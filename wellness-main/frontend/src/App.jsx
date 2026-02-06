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
import Community from './components/Community';
import Reports from './components/Reports';
import Login from './components/Login';
import axios from 'axios';
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

  // Real-time Data Sync Simulation
  useEffect(() => {
    if (!isAuthenticated) return;

    const syncInterval = setInterval(() => {
        setUserContext(prev => {
            // Simulate natural heart rate fluctuation (68-76 bpm)
            const hrChange = Math.floor(Math.random() * 3) - 1;
            const newHr = Math.max(60, Math.min(100, prev.vitals.heart_rate + hrChange));

            // Simulate steps if "walking" or "workout"
            let stepAdd = 0;
            if (prev.activity_type === 'walking') stepAdd = Math.floor(Math.random() * 10) + 5;
            if (prev.activity_type === 'workout') stepAdd = Math.floor(Math.random() * 20) + 15;

            return {
                ...prev,
                steps: prev.steps + stepAdd,
                calories_burned: prev.calories_burned + (stepAdd * 0.04),
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
    setUserContext(prev => ({ ...prev, name: userData.name }));
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
    <div className="min-h-screen bg-gray-50 flex font-sans transition-all duration-500 fade-in">
        
        {/* Sidebar Navigation */}
        <aside className="fixed left-0 top-0 h-full w-20 md:w-64 bg-white border-r border-gray-200 z-50 flex flex-col items-center md:items-start p-4">
             <div className="mb-8 md:px-4">
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight hidden md:block">
                    AroMi<span className="text-brand">.AI</span>
                </h1>
                <span className="text-2xl font-extrabold text-brand md:hidden">A.</span>
            </div>

            <nav className="flex-1 w-full space-y-2 overflow-y-auto pr-1 custom-scrollbar">
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
                    icon={<Users size={20}/>} 
                    label="Community" 
                    active={activeTab === 'community'} 
                    onClick={() => setActiveTab('community')} 
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

             <div className="mt-auto md:px-4 w-full">
                <button 
                    onClick={() => setIsAuthenticated(false)} 
                    className="flex items-center gap-3 w-full p-3 text-sm text-gray-500 hover:text-red-500 transition-colors"
                >
                    <span className="hidden md:inline">Log Out</span>
                </button>
            </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 ml-20 md:ml-64 p-4 md:p-8 min-h-screen">
            <header className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                 <h2 className="text-xl md:text-2xl font-bold text-gray-800 capitalize">
                    {activeTab === 'profile' ? 'Profile Settings' : 
                     activeTab === 'fitness' ? 'Fitness Tracking' :
                     activeTab === 'nutrition' ? 'Nutrition & Diet' :
                     activeTab === 'mindfulness' ? 'Mental Health' :
                     activeTab === 'reminders' ? 'Reminders & Alerts' :
                     activeTab === 'community' ? 'Community Hub' :
                     activeTab === 'reports' ? 'Clinical Insights' :
                     activeTab === 'doubts' ? 'Ask a Health Expert' : 
                     activeTab === 'dashboard' ? 'Your Dashboard' : 
                     activeTab === 'chat' ? 'AI Conversation' : 
                     activeTab === 'wellness' ? 'Daily Wellness Plan' : 
                     'Wellness Store'}
                 </h2>
                 <div className="flex items-center gap-3">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
                            {userContext.location ? `📍 ${userContext.location}` : 'Gps Inactive'}
                        </span>
                        <div className="flex gap-1">
                            {[1,2,3,4,5].map(i => <div key={i} className={`h-1.5 w-4 rounded-full ${i <= 4 ? 'bg-brand' : 'bg-gray-200'}`}></div>)}
                        </div>
                    </div>
                    <button 
                        onClick={() => {
                            setIsSyncing(true);
                            setTimeout(() => setIsSyncing(false), 2000);
                        }}
                        className={`p-2 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all ${isSyncing ? 'animate-spin text-brand' : 'text-gray-400'}`}
                    >
                        <RefreshCw size={18} />
                    </button>
                    <span className="bg-brand-light text-brand px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        {userContext.mood.toUpperCase()}
                    </span>
                 </div>
            </header>

            <div className="max-w-7xl mx-auto w-full">
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

                {activeTab === 'community' && (
                    <Community />
                )}

                {activeTab === 'reports' && (
                    <Reports userContext={userContext} />
                )}

                {activeTab === 'chat' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <section className="lg:col-span-2">
                            <Chat 
                                messages={messages} 
                                setMessages={setMessages} 
                                userContext={userContext}
                            />
                        </section>
                        <section className="hidden lg:block">
                            <div className="bg-brand-light/30 rounded-2xl p-6 h-full border border-brand-light">
                                <h3 className="font-bold text-brand-dark mb-4">Current Context</h3>
                                <ul className="space-y-4 text-sm text-gray-600">
                                    <li className="flex justify-between">
                                        <span>Energy:</span>
                                        <span className="font-semibold">{userContext.energy_level}/10</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Mood:</span>
                                        <span className="font-semibold capitalize">{userContext.mood}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Activity:</span>
                                        <span className="font-semibold capitalize">{userContext.activity_type}</span>
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
        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
            active 
                ? 'bg-brand text-white shadow-md shadow-brand/20' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 pro'
        }`}
    >
        <span className="mx-auto md:mx-0">{icon}</span>
        <span className="hidden md:inline font-medium">{label}</span>
    </button>
);

export default App;
