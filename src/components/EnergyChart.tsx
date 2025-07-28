import React, { useMemo, useState, useEffect } from 'react';

interface EnergyChartProps {
  totalConsumption: number;
  activeConsumption: number;
  standbyConsumption: number;
}

interface DataPoint {
  timestamp: number;
  consumption: number;
}

export const EnergyChart: React.FC<EnergyChartProps> = ({
  totalConsumption,
  activeConsumption,
  standbyConsumption
}) => {
  const [liveData, setLiveData] = useState<DataPoint[]>([]);

  // Initialize with some historical data points
  useEffect(() => {
    const now = Date.now();
    const initialData: DataPoint[] = [];
    
    // Create 30 data points for the last 5 minutes (10-second intervals)
    for (let i = 29; i >= 0; i--) {
      const baseConsumption = Math.max(50, totalConsumption * 0.7);
      initialData.push({
        timestamp: now - (i * 10000), // 10 seconds apart
        consumption: baseConsumption + Math.sin(i * 0.3) * 50 + Math.random() * 30
      });
    }
    
    setLiveData(initialData);
  }, []);

  // Update chart when consumption changes
  useEffect(() => {
    const now = Date.now();
    setLiveData(prev => {
      const newData = [...prev, {
        timestamp: now,
        consumption: totalConsumption
      }];
      
      // Keep only last 30 data points (5 minutes)
      return newData.slice(-30);
    });
  }, [totalConsumption]);

  // Add new data point every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setLiveData(prev => {
        const newData = [...prev, {
          timestamp: now,
          consumption: totalConsumption + (Math.random() - 0.5) * 20 // Small variation
        }];
        
        // Keep only last 30 data points (5 minutes)
        return newData.slice(-30);
      });
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [totalConsumption]);

  const maxConsumption = useMemo(() => {
    if (liveData.length === 0) return Math.max(totalConsumption, 100);
    return Math.max(...liveData.map(d => d.consumption), totalConsumption, 100);
  }, [liveData, totalConsumption]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };

  // Generate SVG path for the line
  const generatePath = () => {
    if (liveData.length < 2) return '';
    
    const width = 100; // percentage
    const height = 100; // percentage
    const stepX = width / (liveData.length - 1);
    
    let path = '';
    
    liveData.forEach((point, index) => {
      const x = index * stepX;
      const y = height - (point.consumption / maxConsumption) * height;
      
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    
    return path;
  };

  const currentTime = new Date();
  const timeRange = `${formatTime(currentTime.getTime() - 5 * 60 * 1000)} - ${formatTime(currentTime.getTime())}`;

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Live Energieverbrauch</h3>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-3xl font-bold text-red-600">{totalConsumption}W</span>
            <span className="text-sm text-gray-500">aktuell</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Letzte 5 Min</div>
          <div className="text-sm font-medium text-gray-700">
            {timeRange}
          </div>
        </div>
      </div>

      {/* Consumption breakdown */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-red-50 p-6 rounded-xl border border-red-200">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-gray-700">Aktiv</span>
          </div>
          <div className="text-2xl font-bold text-red-600 mt-2">
            {activeConsumption}W
          </div>
        </div>
        <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm font-semibold text-gray-700">Standby</span>
          </div>
          <div className="text-2xl font-bold text-orange-600 mt-2">
            {standbyConsumption}W
          </div>
        </div>
      </div>

      {/* Live Chart with Line and Bars */}
      <div className="h-48 relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 overflow-hidden border border-gray-200">
        {/* Background grid */}
        <div className="absolute inset-4 opacity-20">
          <div className="w-full h-full grid grid-cols-6 grid-rows-4 gap-0">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="border-r border-b border-gray-300 last:border-r-0"></div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="absolute inset-4 flex items-end justify-between">
          {liveData.map((data, index) => (
            <div
              key={data.timestamp}
              className="flex-1 flex flex-col items-center justify-end mr-1 last:mr-0"
            >
              <div
                className={`w-full rounded-t-sm transition-all duration-500 ${
                  index === liveData.length - 1
                    ? 'bg-red-400 shadow-sm' 
                    : 'bg-red-300'
                }`}
                style={{
                  height: `${Math.max(2, (data.consumption / maxConsumption) * 100)}%`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Line Chart Overlay */}
        {liveData.length > 1 && (
          <div className="absolute inset-4">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#b91c1c" stopOpacity="1" />
                </linearGradient>
              </defs>
              <path
                d={generatePath()}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-sm"
              />
              {/* Current point indicator */}
              {liveData.length > 0 && (
                <circle
                  cx={((liveData.length - 1) / (liveData.length - 1)) * 100}
                  cy={100 - (liveData[liveData.length - 1].consumption / maxConsumption) * 100}
                  r="1.5"
                  fill="#b91c1c"
                  className="animate-pulse"
                />
              )}
            </svg>
          </div>
        )}
        
        {/* Current value indicator */}
        <div className="absolute top-3 right-4 bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>{totalConsumption}W</span>
          </div>
        </div>

        {/* Max value indicator */}
        <div className="absolute top-3 left-4 text-xs text-gray-600 bg-white px-2 py-1 rounded border shadow-sm">
          Max: {Math.round(maxConsumption)}W
        </div>
      </div>

      {/* Time labels */}
      <div className="flex justify-between text-sm text-gray-500 mt-3 px-4">
        <span>-5 Min</span>
        <span>-2.5 Min</span>
        <span>Jetzt</span>
      </div>
    </div>
  );
};