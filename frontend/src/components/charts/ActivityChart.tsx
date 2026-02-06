import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { generateInitialData, getNextDataPoint, ChartDataPoint } from '../../services/realtimeData';

const ActivityChart: React.FC = () => {
  const [data, setData] = useState<ChartDataPoint[]>(generateInitialData(15, 20, 90));

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const lastValue = prevData[prevData.length - 1].value;
        const nextPoint = getNextDataPoint(lastValue, 10, 100);
        return [...prevData.slice(1), nextPoint];
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 shadow-xl h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-100">Activity Level</h3>
        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Live Metabolic Rate (MET)</p>
      </div>

      <div className="flex-grow min-h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="time" hide />
            <YAxis hide domain={[0, 110]} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
              itemStyle={{ color: '#818cf8' }}
            />
            <Line
              type="stepAfter"
              dataKey="value"
              stroke="#818cf8"
              strokeWidth={4}
              dot={false}
              animationDuration={200}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-col">
        <div className="text-4xl font-black text-indigo-400">
          {data[data.length - 1].value}%
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
          <div 
            className="h-full bg-indigo-500 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${data[data.length - 1].value}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityChart;
