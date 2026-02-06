/**
 * Real-time Data Service (Mock)
 * This service simulates a WebSocket or live API stream using setInterval.
 */

export interface ChartDataPoint {
  time: string;
  value: number;
}

export interface SleepData {
  name: string;
  value: number;
  color: string;
}

export const generateInitialData = (count: number, min: number, max: number): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  const now = new Date();
  for (let i = count; i > 0; i--) {
    const time = new Date(now.getTime() - i * 60000);
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: Math.floor(Math.random() * (max - min + 1)) + min,
    });
  }
  return data;
};

export const getNextDataPoint = (lastValue: number, min: number, max: number): ChartDataPoint => {
  const now = new Date();
  // Random walk algorithm for smoother transitions
  const change = (Math.random() - 0.5) * (max - min) * 0.2;
  let newValue = lastValue + change;
  
  // Keep within bounds
  if (newValue < min) newValue = min + Math.random() * 5;
  if (newValue > max) newValue = max - Math.random() * 5;
  
  return {
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    value: Math.floor(newValue),
  };
};

/**
 * Mock Sleep Breakdown Data
 */
export const getSleepBreakdown = (): SleepData[] => [
  { name: 'Deep Sleep', value: 25, color: '#22d3ee' }, // cyan-400
  { name: 'Light Sleep', value: 55, color: '#34d399' }, // emerald-400
  { name: 'REM', value: 15, color: '#818cf8' }, // indigo-400
  { name: 'Awake', value: 5, color: '#f87171' }, // red-400
];
