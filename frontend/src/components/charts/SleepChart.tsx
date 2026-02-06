import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getSleepBreakdown } from '../../services/realtimeData';

const SleepChart: React.FC = () => {
  const data = getSleepBreakdown();

  return (
    <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 shadow-xl h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-100">Sleep Quality</h3>
        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Breakdown per cycle</p>
      </div>

      <div className="flex-grow min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              formatter={(value) => <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 text-center">
        <div className="text-sm font-bold text-slate-400">Total Sleep</div>
        <div className="text-2xl font-black text-white">7h 42m</div>
      </div>
    </div>
  );
};

export default SleepChart;
