import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateInitialData, getNextDataPoint, ChartDataPoint } from '../../services/realtimeData';
import { Play, Pause } from 'lucide-react';

const StepsChart: React.FC = () => {
  const [data, setData] = useState<ChartDataPoint[]>(generateInitialData(20, 40, 120));
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLive) {
      interval = setInterval(() => {
        setData((prevData) => {
          const lastValue = prevData[prevData.length - 1].value;
          const nextPoint = getNextDataPoint(lastValue, 30, 150);
          const newData = [...prevData.slice(1), nextPoint];
          return newData;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 shadow-xl h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-100">Steps Velocity</h3>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Steps per minute • Real-time</p>
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className={`p-2 rounded-xl transition-all ${
            isLive ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-800 text-slate-400'
          }`}
        >
          {isLive ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </div>

      <div className="flex-grow min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="time" 
              hide={true}
            />
            <YAxis 
              domain={[0, 'auto']} 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
              itemStyle={{ color: '#22d3ee' }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#22d3ee"
              strokeWidth={3}
              dot={false}
              animationDuration={300}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
            {isLive ? 'Live Stream' : 'Paused'}
          </span>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-white">{data[data.length - 1].value}</span>
          <span className="text-xs text-slate-500 ml-1 font-bold">SPM</span>
        </div>
      </div>
    </div>
  );
};

export default StepsChart;
