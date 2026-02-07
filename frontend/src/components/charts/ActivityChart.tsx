import React from 'react';
import { BarChart, Bar, ResponsiveContainer, YAxis } from 'recharts';
import { generateStaticData } from '../../services/realtimeData';
import { Target } from 'lucide-react';

interface ActivityChartProps {
  level?: string;
}

const ActivityChart: React.FC<ActivityChartProps> = ({ level = "Unknown" }) => {
  const data = generateStaticData(50, 6);

  return (
    <div className="bg-slate-900/60 backdrop-blur-md p-4 sm:p-5 rounded-[2rem] border border-slate-800/50 shadow-2xl flex items-center justify-between h-full transition-all hover:bg-slate-800/80 group overflow-hidden relative">
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <div className="p-3 bg-slate-800/50 rounded-2xl border border-slate-700/50 group-hover:border-blue-500/30 transition-all flex-shrink-0">
          <Target className="text-blue-400 w-5 h-5 sm:w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Fitness Zone</p>
          <h4 className="text-lg sm:text-xl font-black text-white tracking-tighter uppercase italic leading-none mb-2">{level}</h4>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider whitespace-nowrap">Level: Efficient</span>
          </div>
        </div>
      </div>
      <div className="w-16 h-10 sm:w-20 sm:h-12 opacity-30 group-hover:opacity-100 transition-all flex items-end gap-[2px] flex-shrink-0 ml-4">
        {data.map((d, i) => (
          <div 
            key={i} 
            className="w-full bg-blue-500 rounded-sm" 
            style={{ height: `${d.value}%` }}
          />
        ))}
      </div>
    </div>
  );
};

export default ActivityChart;
