import React, { useEffect, useState } from 'react';
import { ShoppingBag, Star, X, Trash2, Plus, Minus, CheckCircle, ShoppingCart } from 'lucide-react';
import axios from 'axios';

const Store = ({ cart, setCart }) => {
    const [items, setItems] = useState([]);
    const [notification, setNotification] = useState(null);
    const [showCart, setShowCart] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8000/store').then(res => setItems(res.data));
    }, []);

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
        setNotification(`${item.name} added to cart!`);
        setTimeout(() => setNotification(null), 3000);
    };

    const removeFromCart = (itemId) => {
        setCart(prev => prev.filter(i => i.id !== itemId));
    };

    const updateQuantity = (itemId, delta) => {
        setCart(prev => prev.map(i => {
            if (i.id === itemId) {
                const newQty = Math.max(1, (i.quantity || 1) + delta);
                return { ...i, quantity: newQty };
            }
            return i;
        }));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            const price = parseInt(item.price.replace(/[^\d]/g, ''));
            return total + (price * (item.quantity || 1));
        }, 0);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-10 relative">
            {/* Cart Button Floating */}
            <button 
                onClick={() => setShowCart(true)}
                className="fixed bottom-10 right-10 z-40 bg-brand text-slate-950 p-6 rounded-full shadow-[0_0_30px_rgba(255,107,0,0.3)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
            >
                <ShoppingCart size={28} />
                {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-white text-slate-950 text-[10px] font-black h-6 w-6 rounded-full flex items-center justify-center border-2 border-slate-950">
                        {cart.reduce((acc, i) => acc + (i.quantity || 1), 0)}
                    </span>
                )}
            </button>

            {/* Cart Panel Slide-over */}
            {showCart && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowCart(false)}></div>
                    <div className="absolute right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl animate-in slide-in-from-right duration-300">
                        <div className="h-full flex flex-col">
                            <div className="p-8 border-b border-slate-800 flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Order Stack</h3>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Ready for deployment</p>
                                </div>
                                <button onClick={() => setShowCart(false)} className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
                                    <X size={24} className="text-slate-400" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                {cart.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center">
                                        <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mb-6">
                                            <ShoppingBag size={32} className="text-slate-600" />
                                        </div>
                                        <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Stack Is Empty</p>
                                        <button onClick={() => setShowCart(false)} className="mt-4 text-brand text-[10px] font-black uppercase tracking-widest hover:underline">Return to Inventory</button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {cart.map(item => (
                                            <div key={item.id} className="bg-slate-800/50 border border-slate-800 rounded-2xl p-4 group">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <span className="text-[8px] font-black text-brand uppercase tracking-widest mb-1 block">{item.category}</span>
                                                        <h4 className="text-sm font-black text-white uppercase leading-tight">{item.name}</h4>
                                                    </div>
                                                    <button onClick={() => removeFromCart(item.id)} className="text-slate-600 hover:text-red-500 transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4 bg-slate-900 rounded-xl p-1 px-3 border border-slate-800">
                                                        <button onClick={() => updateQuantity(item.id, -1)} className="text-slate-400 hover:text-white"><Minus size={14}/></button>
                                                        <span className="text-xs font-black text-white w-4 text-center">{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.id, 1)} className="text-slate-400 hover:text-white"><Plus size={14}/></button>
                                                    </div>
                                                    <span className="text-sm font-black text-brand tracking-tighter">{item.price}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {cart.length > 0 && (
                                <div className="p-8 bg-slate-900 border-t border-slate-800">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aggregate Total</span>
                                        <span className="text-2xl font-black text-white tracking-tighter">₹{calculateTotal().toLocaleString()}</span>
                                    </div>
                                    <button 
                                        className="w-full bg-brand text-slate-950 font-black py-4 rounded-2xl uppercase tracking-widest text-xs shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                                        onClick={() => {
                                            alert("Order Logged. Initializing payment protocol...");
                                            setCart([]);
                                            setShowCart(false);
                                        }}
                                    >
                                        <CheckCircle size={18} />
                                        Authorize Checkout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {notification && (
                <div className="fixed top-10 right-10 z-50 bg-brand text-slate-950 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10">
                    <ShoppingBag size={14} />
                    {notification}
                </div>
            )}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-100 uppercase tracking-tighter">Bio-Fuel Matrix</h2>
                    <p className="text-xs text-slate-500 font-black uppercase tracking-[0.2em] mt-1">High-performance supplements & recovery assets</p>
                </div>
                <div className="bg-brand/10 text-brand border border-brand/20 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">
                    Member Protocol Active
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map(item => (
                    <div key={item.id} className="bg-slate-900 rounded-[2rem] shadow-xl border border-slate-800 overflow-hidden hover:border-brand/30 transition-all group p-8">
                        <div className="mb-6">
                            <span className="bg-brand/10 text-brand text-[10px] font-black px-3 py-1.5 rounded-xl border border-brand/20 uppercase tracking-widest">{item.category}</span>
                        </div>
                        <div>
                            <h3 className="font-black text-slate-100 text-xl mb-4 group-hover:text-brand transition-colors uppercase tracking-tight leading-tight">{item.name}</h3>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
                                <span className="text-brand font-black text-2xl tracking-tighter">{item.price}</span>
                                <button 
                                    onClick={() => addToCart(item)}
                                    className="bg-slate-800 text-slate-100 p-4 rounded-2xl hover:bg-brand hover:text-slate-900 transition-all shadow-lg active:scale-90"
                                >
                                    <ShoppingBag size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {items.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-[2rem]">
                    <p className="text-slate-500 font-black uppercase tracking-widest animate-pulse text-sm">Synchronizing database...</p>
                </div>
            )}
        </div>
    );
};

export default Store;
