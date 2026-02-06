import React, { useEffect, useState } from 'react';
import { ShoppingBag, Star } from 'lucide-react';
import axios from 'axios';

const Store = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/store').then(res => setItems(res.data));
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-10">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-100 uppercase tracking-tighter">Inventory Matrix</h2>
                    <p className="text-xs text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Curated bio-optimization assets</p>
                </div>
                <div className="bg-brand/10 text-brand border border-brand/20 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">
                    Member Protocol Active
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map(item => (
                    <div key={item.id} className="bg-slate-900 rounded-[2rem] shadow-xl border border-slate-800 overflow-hidden hover:border-brand/30 transition-all group">
                        <div className="h-56 overflow-hidden bg-slate-800 relative">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                            <div className="absolute top-4 left-4">
                                <span className="bg-slate-900/80 backdrop-blur-md text-slate-100 text-[10px] font-black px-3 py-1.5 rounded-xl border border-white/10 uppercase tracking-widest">{item.category}</span>
                            </div>
                        </div>
                        <div className="p-8">
                            <h3 className="font-black text-slate-100 text-xl mb-4 group-hover:text-brand transition-colors uppercase tracking-tight leading-tight">{item.name}</h3>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
                                <span className="text-brand font-black text-2xl tracking-tighter">{item.price}</span>
                                <button className="bg-slate-800 text-slate-100 p-4 rounded-2xl hover:bg-brand hover:text-slate-900 transition-all shadow-lg active:scale-90">
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
