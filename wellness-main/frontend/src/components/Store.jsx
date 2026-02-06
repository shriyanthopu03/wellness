import React, { useEffect, useState } from 'react';
import { ShoppingBag, Star } from 'lucide-react';
import axios from 'axios';

const Store = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/store').then(res => setItems(res.data));
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-800">Wellness Store</h2>
                <div className="bg-brand-light text-brand px-3 py-1 rounded-full text-sm font-semibold">
                    Member Deals Active
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                        <div className="h-48 overflow-hidden bg-gray-100">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-4">
                            <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{item.category}</div>
                            <h3 className="font-bold text-gray-800 text-lg mb-2">{item.name}</h3>
                            <div className="flex items-center justify-between">
                                <span className="text-brand font-bold text-lg">{item.price}</span>
                                <button className="bg-gray-900 text-white p-2 rounded-lg hover:bg-brand transition-colors">
                                    <ShoppingBag size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Store;
