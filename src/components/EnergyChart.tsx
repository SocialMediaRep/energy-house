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

type TimeRange = '1min' | '5min' | '30min';

export const EnergyChart: React.FC<EnergyChartProps> = ({
  totalConsumption,
  activeConsumption,
  standbyConsumption
}) => {
  const [liveData, setLiveData] = useState<DataPoint[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('30min');

  // Calculate device statistics
  const activeDevices = Math.floor(activeConsumption / 100) || 1; // Rough estimate
  const standbyDevices = Math.floor(standbyConsumption / 10) || 0;
  const offDevices = 18 - activeDevices - standbyDevices; // Total assumed devices
  const dailyCost = (totalConsumption / 1000) * 24 * 0.30; // CHF per kWh estimate

  // Get data points and intervals based on selected time range
  const getTimeRangeConfig = (range: TimeRange) => {
    switch (range) {
      case '1min':
        return { points: 12, intervalMs: 5000, totalMs: 60000 }; // 12 points, 5s intervals, 1 minute
      case '5min':
        return { points: 30, intervalMs: 10000, totalMs: 300000 }; // 30 points, 10s intervals, 5 minutes
      case '30min':
        return { points: 30, intervalMs: 60000, totalMs: 1800000 }; // 30 points, 1min intervals, 30 minutes
    }
  };

  // Initialize with historical data points based on selected time range
  useEffect(() => {
    const config = getTimeRangeConfig(selectedTimeRange);
    const now = Date.now();
    const initialData: DataPoint[] = [];
    
    for (let i = config.points - 1; i >= 0; i--) {
      const baseConsumption = Math.max(50, totalConsumption * 0.8);
      initialData.push({
        timestamp: now - (i * config.intervalMs),
        consumption: baseConsumption + Math.sin(i * 0.3) * 30 + Math.random() * 20
      });
    }
    
    setLiveData(initialData);
  }, [selectedTimeRange, totalConsumption]);

  // Update chart when consumption changes
  useEffect(() => {
    const config = getTimeRangeConfig(selectedTimeRange);
    const now = Date.now();
    setLiveData(prev => {
      const newData = [...prev, {
        timestamp: now,
        consumption: totalConsumption
      }];
      
      return newData.slice(-config.points);
    });
  }, [totalConsumption, selectedTimeRange]);

  // Add new data point based on selected interval
  useEffect(() => {
    const config = getTimeRangeConfig(selectedTimeRange);
    const interval = setInterval(() => {
      const now = Date.now();
      setLiveData(prev => {
        const newData = [...prev, {
          timestamp: now,
          consumption: totalConsumption + (Math.random() - 0.5) * 15
        }];
        
        return newData.slice(-config.points);
      });
    }, config.intervalMs);

    return () => clearInterval(interval);
  }, [totalConsumption, selectedTimeRange]);

  const maxConsumption = useMemo(() => {
    if (liveData.length === 0) return Math.max(totalConsumption, 100);
    const maxFromData = Math.max(...liveData.map(d => d.consumption));
    // Round up to next 0.05 kW for cleaner y-axis
    return Math.ceil(maxFromData / 50) * 50;
  }, [liveData, totalConsumption]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const formatConsumption = (watts: number) => {
    return (watts / 1000).toFixed(3);
  };

  // Generate Y-axis labels (simplified)
  const getYAxisLabels = () => {
    const max = (maxConsumption / 1000).toFixed(2);
    const mid = (maxConsumption / 2000).toFixed(2);
    return [max, mid, '0.00']; // Top to bottom: Max, Middle, 0
  };

  // Generate SVG path for the area chart
  const generateAreaPath = () => {
    if (liveData.length < 2) return '';
    
    const width = 100;
    const height = 100;
    const stepX = width / (liveData.length - 1);
    
    let path = `M 0 ${height}`; // Start at bottom left
    
    liveData.forEach((point, index) => {
      const x = index * stepX;
      const y = height - (point.consumption / maxConsumption) * height;
      
      if (index === 0) {
        path += ` L ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    
    path += ` L ${width} ${height} Z`; // Close the path at bottom right
    
    return path;
  };

  // Generate SVG path for the line
  const generateLinePath = () => {
    if (liveData.length < 2) return '';
    
    const width = 100;
    const height = 100;
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
  const yAxisLabels = getYAxisLabels();

  return (
    <div className="bg-white rounded-2xl border border-repower-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="h3 flex items-center">
          <div className="w-2 h-2 bg-repower-green-500 rounded-full mr-3"></div>
          Aktueller Stromverbrauch
        </h2>
      </div>

      {/* Main Content Grid */}
      <div className="space-y-4">
        {/* Chart Section */}
        <div className="grid grid-cols-4 gap-4">
          {/* Time Range Selector - moved to left */}
          <div className="col-span-3">
            <div className="flex justify-start mb-4">
              <div className="flex bg-repower-gray-100 rounded-lg p-1">
                {[
                  { key: '1min' as TimeRange, label: '1 Min' },
                  { key: '5min' as TimeRange, label: '5 Min' },
                  { key: '30min' as TimeRange, label: '30 Min' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTimeRange(key)}
                    className={`px-4 py-2 rounded-md btn-text transition-all duration-200 hover:scale-105 ${
                      selectedTimeRange === key
                        ? 'bg-repower-red text-white shadow-md'
                        : 'text-repower-gray-600 hover:text-repower-dark hover:bg-repower-gray-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Container */}
            <div className="relative">
              {/* Chart */}
              <div className="h-48 relative bg-white border border-gray-200 rounded">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-caption text-low-contrast pr-2 py-4">
                  {yAxisLabels.map((label, index) => (
                    <div key={index} className="text-right">
                      {label} kW
                    </div>
                  ))}
                </div>

                {/* Chart Area */}
                <div className="absolute inset-0 ml-12">
                  {liveData.length > 1 && (
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {/* Area fill */}
                      <path
                        d={generateAreaPath()}
                        fill="rgba(59, 130, 246, 0.1)"
                        stroke="none"
                      />
                      {/* Line */}
                      <path
                        d={generateLinePath()}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>

              {/* X-axis time labels */}
              <div className="flex justify-between text-caption text-low-contrast mt-2 ml-12">
                {liveData.length > 0 && (
                  <>
                    <span>{formatTime(liveData[0]?.timestamp || Date.now())}</span>
                    <span>{formatTime(liveData[Math.floor(liveData.length / 2)]?.timestamp || Date.now())}</span>
                    <span>{formatTime(liveData[liveData.length - 1]?.timestamp || Date.now())}</span>
                  </>
                )}
              </div>
            </div>

          </div>

          {/* Live consumption - beside chart */}
          <div className="col-span-1 flex flex-col justify-center space-y-3">
            <div className="bg-repower-gray-50 rounded-lg p-4 text-center">
              <div className="text-body-sm text-low-contrast mb-1">
                Live <span className="text-caption">{formatTime(currentTime.getTime())}</span>
              </div>
              <div className="text-base font-medium text-high-contrast mb-1">
                Verbrauch
              </div>
              <div className="text-2xl font-light text-high-contrast">
                {formatConsumption(totalConsumption)} <span className="text-body-sm font-normal">kW</span>
              </div>
            </div>
            
            <div className="bg-repower-gray-50 rounded-lg p-4 text-center">
              <div className="text-body-sm text-low-contrast mb-1">
                Tägliche Kosten
              </div>
              <div className="text-2xl font-light text-high-contrast">
                {dailyCost.toFixed(2)} <span className="text-body-sm font-normal">CHF</span>
              </div>
              <div className="text-caption text-medium-contrast mt-1">
                bei aktuellem Verbrauch
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};