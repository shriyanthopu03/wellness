import React from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip } from 'recharts';
import { generateStaticData } from '../../services/realtimeData';
import { TrendingUp } from 'lucide-react';

interface StepsChartProps {
  steps?: number;
  burned?: number;
}

const StepsChart: React.FC<StepsChartProps> = ({ steps = 0, burned = 0 }) => {
  const data = generateStaticData(steps || 0, 12);

  return (
    <div className="bg-slate-900/60 backdrop-blur-md p-4 sm:p-5 rounded-[2rem] border border-slate-800/50 shadow-2xl flex items-center justify-between h-full transition-all hover:bg-slate-800/80 group overflow-hidden relative">
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <div className="p-3 bg-slate-800/50 rounded-2xl border border-slate-700/50 group-hover:border-cyan-500/30 transition-all flex-shrink-0">
          <TrendingUp className="text-cyan-400 w-5 h-5 sm:w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Steps Today</p>
          <h4 className="text-xl sm:text-2xl font-black text-white tracking-tighter uppercase italic leading-none mb-2">
            {steps.toLocaleString()}
          </h4>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider whitespace-nowrap">{Math.floor(burned)} kcal</span>
          </div>
        </div>
      </div>
      <div className="w-16 h-12 sm:w-24 sm:h-16 opacity-30 group-hover:opacity-80 transition-all flex-shrink-0 ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="stepsLine" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#06b6d4" 
              strokeWidth={3}
              fill="url(#stepsLine)" 
              animationDuration={2500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StepsChart;
