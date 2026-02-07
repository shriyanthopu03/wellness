import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getSleepBreakdown } from '../../services/realtimeData';
import { Brain } from 'lucide-react';

interface SleepChartProps {
  sleepHours?: number;
  quality?: string;
}

const SleepChart: React.FC<SleepChartProps> = ({ sleepHours = 8, quality = "Good" }) => {
  const data = getSleepBreakdown(sleepHours || 8);

  return (
    <div className="bg-slate-900/60 backdrop-blur-md p-4 sm:p-5 rounded-[2rem] border border-slate-800/50 shadow-2xl flex items-center justify-between h-full transition-all hover:bg-slate-800/80 group overflow-hidden relative">
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <div className="p-3 bg-slate-800/50 rounded-2xl border border-slate-700/50 group-hover:border-purple-500/30 transition-all flex-shrink-0">
          <Brain className="text-purple-400 w-5 h-5 sm:w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Sleep Quality</p>
          <h4 className="text-lg sm:text-xl font-black text-white tracking-tighter uppercase italic leading-none mb-2">{quality || 'Good'}</h4>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider whitespace-nowrap">{sleepHours || 8}h cycle</span>
          </div>
        </div>
      </div>
      <div className="w-20 h-20 sm:w-24 sm:h-24 opacity-40 group-hover:opacity-100 transition-all rotate-90 flex-shrink-0 ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={25}
              outerRadius={40}
              paddingAngle={10}
              dataKey="value"
              stroke="none"
              animationDuration={2500}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  className="filter drop-shadow-[0_0_5px_rgba(255,255,255,0.1)]"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SleepChart;
