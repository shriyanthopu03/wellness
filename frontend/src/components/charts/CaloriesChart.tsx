import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateInitialData, getNextDataPoint, ChartDataPoint } from '../../services/realtimeData';

const CaloriesChart: React.FC = () => {
  const [data, setData] = useState<ChartDataPoint[]>(generateInitialData(20, 1500, 2500));

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const lastValue = prevData[prevData.length - 1].value;
        const nextPoint = getNextDataPoint(lastValue, 1000, 3000);
        return [...prevData.slice(1), nextPoint];
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 shadow-xl h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-100">Calories Burned</h3>
        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Intensity Trend • Daily Target</p>
      </div>

      <div className="flex-grow min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
              itemStyle={{ color: '#34d399' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#34d399"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorCal)"
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <span className="text-3xl font-black text-white">{data[data.length - 1].value}</span>
          <span className="text-xs text-slate-500 ml-1 font-bold">kcal</span>
        </div>
        <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
          +12% vs yesterday
        </div>
      </div>
    </div>
  );
};

export default CaloriesChart;
