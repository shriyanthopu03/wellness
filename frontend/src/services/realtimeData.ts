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

export const getNextDataPoint = (lastValue: number, min: number, max: number, target?: number): ChartDataPoint => {
  const now = new Date();
  
  // If a target is provided, nudge the value towards the target
  let change;
  if (target !== undefined) {
    const direction = target > lastValue ? 1 : -1;
    const attraction = Math.abs(target - lastValue) * 0.1;
    change = (Math.random() - 0.4 + (direction * 0.2)) * (max - min) * 0.15 + (direction * attraction);
  } else {
    // Standard random walk algorithm for smoother transitions
    change = (Math.random() - 0.5) * (max - min) * 0.2;
  }
  
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
 * Mock Sleep Breakdown Data based on total hours
 */
export const getSleepBreakdown = (totalHours: number = 7.7): SleepData[] => {
  const deepPct = 25;
  const remPct = 20;
  const awakePct = 5;
  const lightPct = 50;

  return [
    { name: 'Deep Sleep', value: Math.round(totalHours * (deepPct / 100) * 10) / 10, color: '#22d3ee' },
    { name: 'Light Sleep', value: Math.round(totalHours * (lightPct / 100) * 10) / 10, color: '#34d399' },
    { name: 'REM', value: Math.round(totalHours * (remPct / 100) * 10) / 10, color: '#818cf8' },
    { name: 'Awake', value: Math.round(totalHours * (awakePct / 100) * 10) / 10, color: '#f87171' },
  ];
};

export const generateStaticData = (value: number, count: number): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  const now = new Date();
  for (let i = count; i > 0; i--) {
    const time = new Date(now.getTime() - i * 3600000);
    // More professional varying pattern (multi-sine wave)
    const val = value * (0.9 + (Math.sin(i * 0.8) * 0.05) + (Math.cos(i * 1.5) * 0.05));
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit' }),
      value: Math.floor(val),
    });
  }
  return data;
};
