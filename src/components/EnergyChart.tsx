import React, { useMemo, useState, useEffect } from 'react';
import { Info, X } from 'lucide-react';
import { GlobalPowerControl } from './GlobalPowerControl';

interface EnergyChartProps {
  totalConsumption: number;
  activeConsumption: number;
  standbyConsumption: number;
  devices: any[];
  onToggleAll: (status: 'on' | 'off') => void;
}

interface DataPoint {
  timestamp: number;
  consumption: number;
}

type TimeRange = '30s' | '1min' | '5min';

export const EnergyChart: React.FC<EnergyChartProps> = ({
  totalConsumption,
  activeConsumption,
  standbyConsumption,
  devices,
  onToggleAll
}) => {
  const [liveData, setLiveData] = useState<DataPoint[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('1min');
  const [showCostModal, setShowCostModal] = useState(false);

  // Constants for maximum data history (5 minutes)
  const MAX_HISTORY_MS = 5 * 60 * 1000; // 5 minutes in milliseconds
  const MAX_HISTORY_POINTS = 100; // Maximum number of data points to keep

  // Calculate device statistics
  const activeDevices = devices.filter(device => device.status === 'on').length;
  const standbyDevices = devices.filter(device => device.status === 'standby').length;
  const offDevices = devices.filter(device => device.status === 'off').length;
  const hourlyCost = (totalConsumption / 1000) * 0.30;
  const dailyCost = hourlyCost * 24;
  const monthlyCost = dailyCost * 30;
  const yearlyCost = dailyCost * 365;

  // Get data points and intervals based on selected time range
  const getTimeRangeConfig = (range: TimeRange) => {
    switch (range) {
      case '30s':
        return { points: 15, intervalMs: 2000, totalMs: 30000 }; // 15 points, 2s intervals, 30 seconds
      case '1min':
        return { points: 20, intervalMs: 3000, totalMs: 60000 }; // 20 points, 3s intervals, 1 minute
      case '5min':
        return { points: 30, intervalMs: 10000, totalMs: 300000 }; // 30 points, 10s intervals, 5 minutes
    }
  };

  // Initialize with some historical data only once
  useEffect(() => {
    if (liveData.length === 0) {
      const now = Date.now();
      const initialData: DataPoint[] = [];
      
      // Create initial historical data for the last 30 seconds
      for (let i = 15; i >= 1; i--) {
        const timeOffset = i * 2000; // 2 second intervals
        const baseConsumption = Math.max(50, totalConsumption * 0.9);
        const variation = Math.sin(i * 0.2) * 15 + Math.random() * 10;
        initialData.push({
          timestamp: now - timeOffset,
          consumption: Math.max(0, baseConsumption + variation)
        });
      }
      
      // Add current consumption as the latest point
      initialData.push({
        timestamp: now,
        consumption: totalConsumption + (Math.random() - 0.5) * 2
      });
      
      setLiveData(initialData);
    }
  }, []);

  // REAL-TIME UPDATE: Immediate response to consumption changes
  useEffect(() => {
    const now = Date.now();
    const cutoffTime = now - MAX_HISTORY_MS;
    
    console.log(`⚡ REAL-TIME UPDATE: ${totalConsumption}W (${devices.filter(d => d.status !== 'off').length} active devices)`);
    
    // ALWAYS ADD NEW DATA POINT - never overwrite
    setLiveData(prev => {
      // Create new data point with current timestamp
      const newPoint = {
        timestamp: now,
        consumption: totalConsumption + (Math.random() - 0.5) * 2 // Small realistic variation
      };
      
      // Add new point to existing data
      const updatedData = [...prev, newPoint];
      
      // Remove old points outside the time window
      const filteredData = updatedData.filter(point => point.timestamp >= cutoffTime);
      
      // Ensure we don't exceed maximum history points for performance
      const finalData = filteredData.slice(-MAX_HISTORY_POINTS);
      
      return finalData;
    });
  }, [totalConsumption, devices]);

  // BACKGROUND UPDATES: Periodic updates for smooth animation when no changes
  useEffect(() => {
    const cutoffTime = Date.now() - MAX_HISTORY_MS;
    
    // Background updates for natural variation when no device changes
    const interval = setInterval(() => {
      const now = Date.now();
      
      setLiveData(prev => {
        if (prev.length === 0) return prev;
        
        const lastPoint = prev[prev.length - 1];
        const timeSinceLastUpdate = now - lastPoint.timestamp;
        
        // Only add background variation if no recent real-time updates (less than 1 second)
        if (timeSinceLastUpdate < 1000) {
          return prev;
        }
        
        // Add subtle background point with natural variation
        const newPoint = {
          timestamp: now,
          consumption: totalConsumption + (Math.random() - 0.5) * 3
        };
        
        const updatedData = [...prev, newPoint];
        
        // Remove old points and limit array size
        const filteredData = updatedData.filter(point => point.timestamp >= cutoffTime);
        const finalData = filteredData.slice(-MAX_HISTORY_POINTS);
        
        return finalData;
      });
    }, 3000); // Background updates every 3 seconds

    return () => clearInterval(interval);
  }, [totalConsumption]);

  // Filter displayed data based on selected time range
  const displayedData = useMemo(() => {
    const config = getTimeRangeConfig(selectedTimeRange);
    const now = Date.now();
    const cutoffTime = now - config.totalMs;
    
    // Filter liveData to show only the selected time range
    const filteredData = liveData.filter(point => point.timestamp >= cutoffTime);
    
    // If we don't have enough data points for the selected range, return what we have
    return filteredData;
  }, [liveData, selectedTimeRange]);

  const maxConsumption = useMemo(() => {
    if (displayedData.length === 0) return Math.max(totalConsumption, 100);
    const maxFromData = Math.max(...displayedData.map(d => d.consumption));
    // Include current consumption in max calculation and round up
    const maxValue = Math.max(maxFromData, totalConsumption);
    return Math.ceil(maxValue / 50) * 50;
  }, [displayedData, totalConsumption]);

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
    if (displayedData.length < 2) return '';
    
    const width = 100;
    const height = 100;
    const stepX = width / (displayedData.length - 1);
    
    let path = `M 0 ${height}`; // Start at bottom left
    
    displayedData.forEach((point, index) => {
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
    if (displayedData.length < 2) return '';
    
    const width = 100;
    const height = 100;
    const stepX = width / (displayedData.length - 1);
    
    let path = '';
    
    displayedData.forEach((point, index) => {
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
    <div className="bg-white rounded-2xl border border-repower-gray-200 p-4 md:p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-8">
        <h2 className="text-lg md:text-2xl font-bold flex items-center">
          <div className="w-2 h-2 bg-repower-green-500 rounded-full mr-4"></div>
          <span className="hidden md:inline">Aktueller Stromverbrauch</span>
          <span className="md:hidden">Stromverbrauch</span>
        </h2>
         {/* Alle AUS Button */}
            <div className="mt-8">
              <GlobalPowerControl onToggleAll={onToggleAll} />
            </div>
      </div>

      {/* Main Content Grid */}
      <div className="space-y-4 md:space-y-8">
        {/* Chart Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
          {/* Time Range Selector - moved to left */}
          <div className="md:col-span-3">
            <div className="flex justify-start mb-4 md:mb-6">
              <div className="flex bg-repower-gray-100 rounded-lg p-1">
                {[
                  { key: '30s' as TimeRange, label: '30 Sek' },
                  { key: '1min' as TimeRange, label: '1 Min' },
                  { key: '5min' as TimeRange, label: '5 Min' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTimeRange(key)}
                    className={`px-2 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-all duration-200 hover:scale-105 ${
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
              <div className="h-32 md:h-48 relative bg-white border border-gray-200 rounded">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-low-contrast pr-2">
                  {yAxisLabels.map((label, index) => (
                    <div key={index} className="text-right">
                      {label} kW
                    </div>
                  ))}
                </div>

                {/* Chart Area */}
                <div className="absolute inset-0 ml-8 md:ml-12">
                  {displayedData.length > 1 && (
                    <svg className="w-full h-full transition-all duration-200" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgba(34, 122, 197, 0.3)" />
                          <stop offset="100%" stopColor="rgba(34, 122, 197, 0.08)" />
                        </linearGradient>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#1064b9" />
                          <stop offset="50%" stopColor="#227ac5" />
                          <stop offset="100%" stopColor="#1656a3" />
                        </linearGradient>
                      </defs>
                      {/* Area fill */}
                      <path
                        d={generateAreaPath()}
                        fill="url(#areaGradient)"
                        stroke="none"
                      />
                      {/* Line */}
                      <path
                        d={generateLinePath()}
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="drop-shadow-sm"
                      />
                    </svg>
                  )}
                  
                  {/* Real-time indicator */}
                  {displayedData.length > 0 && (
                    <div className="absolute top-2 right-2 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-sm"></div>
                      <span className="text-xs text-blue-600 font-semibold tracking-wide">LIVE</span>
                    </div>
                  )}
                </div>
              </div>

              {/* X-axis time labels */}
              <div className="flex justify-between text-xs text-low-contrast mt-2 md:mt-4 ml-8 md:ml-12">
                <span>{formatTime(displayedData[0]?.timestamp || Date.now())}</span>
                <span>{formatTime(displayedData[Math.floor(displayedData.length / 2)]?.timestamp || Date.now())}</span>
                <span>{formatTime(displayedData[displayedData.length - 1]?.timestamp || Date.now())}</span>
              </div>
            </div>

          </div>

          {/* Live consumption - beside chart */}
          <div className="md:col-span-1 grid grid-cols-2 md:grid-cols-1 gap-4 md:flex md:flex-col md:justify-center md:space-y-4">
            <div className="bg-repower-gray-50 rounded-lg p-4 md:p-6 text-center">
              <div className="text-body-sm text-low-contrast mb-1">
                Live <span className="text-caption">{formatTime(currentTime.getTime())}</span>
              </div>
              <div className="text-base font-medium text-high-contrast mb-1">
                Verbrauch
              </div>
              <div className="text-2xl font-light text-high-contrast transition-all duration-300">
                {formatConsumption(totalConsumption)} <span className="text-sm font-normal">kW</span>
              </div>
            </div>
            
            <div className="bg-repower-gray-50 rounded-lg p-4 md:p-6 text-center">
              <div className="text-body-sm text-low-contrast mb-1">
                Stündliche Kosten
                <button
                  onClick={() => setShowCostModal(true)}
                  className="ml-2 p-1 rounded-full hover:bg-repower-gray-200 transition-colors"
                  title="Kostenaufstellung anzeigen"
                >
                  <Info size={12} className="text-repower-gray-500" />
                </button>
              </div>
              <div className="text-2xl font-light text-high-contrast transition-all duration-300">
                {hourlyCost.toFixed(3)} <span className="text-sm font-normal">CHF</span>
              </div>
              <div className="text-caption text-medium-contrast mt-1">
                bei aktuellem Verbrauch
              </div>
            </div>
            
           
          </div>
        </div>

      </div>

      {/* Cost Breakdown Modal */}
      {showCostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-100 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-repower-dark">Kostenaufstellung</h3>
                <button
                  onClick={() => setShowCostModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Schließen"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Current Consumption - styled like dashboard */}
              <div className="mb-6 bg-repower-gray-50 rounded-lg p-4 md:p-6 text-center">
                <div className="text-body-sm text-low-contrast mb-1">
                  Aktueller Verbrauch
                </div>
                <div className="text-2xl font-light text-high-contrast">
                  {(totalConsumption / 1000).toFixed(3)} <span className="text-sm font-normal">kW</span>
                </div>
              </div>

              {/* Cost Calculation - only hourly */}
              <div className="mb-6">
                <h4 className="font-semibold text-repower-dark mb-3">Kostenberechnung:</h4>
                
                <div className="p-3 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-repower-dark">Stündliche Kosten</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-repower-dark">
                        {hourlyCost.toFixed(3)} CHF/h
                      </div>
                      <div className="text-xs text-repower-gray-500 font-mono">
                        {(totalConsumption / 1000).toFixed(3)} kW × 0.30 CHF/kWh
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remove old cost calculation section */}
              <div className="mb-6 hidden">
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {(totalConsumption / 1000).toFixed(3)} kW
                  </div>
                  <div className="text-sm text-blue-700">Aktueller Verbrauch</div>
                </div>

                <div className="p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Kostenberechnung:</h4>
                  <div className="text-sm text-gray-800 font-mono space-y-1">
                    <div>{(totalConsumption / 1000).toFixed(3)} kW × 0.30 CHF/kWh = <span className="font-bold">{hourlyCost.toFixed(3)} CHF/h</span></div>
                    <div>{hourlyCost.toFixed(3)} CHF/h × 24h = <span className="font-bold">{dailyCost.toFixed(2)} CHF/Tag</span></div>
                  </div>
                </div>
              </div>

              {/* Breakdown by Device Status */}
              <div className="mt-6 space-y-3">
                <h4 className="font-semibold text-repower-dark mb-3">Verbrauch nach Status</h4>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-700">Aktive Geräte</span>
                  </div>
                  <span className="text-sm font-bold text-green-600">{(activeConsumption / 1000).toFixed(3)} kW</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    <span className="text-sm font-medium text-orange-700">Standby-Geräte</span>
                  </div>
                  <span className="text-sm font-bold text-orange-600">{(standbyConsumption / 1000).toFixed(3)} kW</span>
                </div>
              </div>

              {/* Device List */}
              <div className="mt-6">
                <h4 className="font-semibold text-repower-dark mb-4">Geräte-Aufschlüsselung</h4>
                
                <div className="space-y-2">
                  {devices
                    .filter(device => device.status !== 'off')
                    .sort((a, b) => {
                      const aConsumption = a.status === 'on' ? a.wattage : a.standbyWattage;
                      const bConsumption = b.status === 'on' ? b.wattage : b.standbyWattage;
                      return bConsumption - aConsumption;
                    })
                    .map(device => {
                      const consumption = device.status === 'on' ? device.wattage : device.standbyWattage;
                      const hourlyCostDevice = (consumption / 1000) * 0.30;
                      const dailyCostDevice = hourlyCostDevice * 24;
                      
                      return (
                        <div key={device.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              device.status === 'on' ? 'bg-green-500' : 'bg-orange-400'
                            }`}></div>
                            <div>
                              <div className="text-sm font-medium text-repower-dark">{device.name}</div>
                              <div className="text-xs text-repower-gray-500">
                                {consumption}W • {device.status === 'on' ? 'Ein' : 'Standby'}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-repower-dark">
                              {hourlyCostDevice.toFixed(3)} CHF/h
                            </div>
                            <div className="text-xs text-repower-gray-500">
                              {dailyCostDevice.toFixed(2)} CHF/Tag
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  
                  {devices.filter(device => device.status !== 'off').length === 0 && (
                    <div className="text-center py-8 text-repower-gray-500">
                      <div className="text-sm">Keine aktiven Geräte</div>
                    </div>
                  )}
                </div>
                
                {/* Summary */}
                <div className="mt-4 p-3 bg-repower-gray-50 rounded-lg border border-repower-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-repower-dark">
                      Gesamt ({devices.filter(device => device.status !== 'off').length} Geräte)
                    </span>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-repower-dark">
                        {hourlyCost.toFixed(3)} CHF/h
                      </div>
                      <div className="text-xs text-repower-gray-500">
                        {dailyCost.toFixed(2)} CHF/Tag
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-xs text-yellow-800">
                  <strong>Hinweis:</strong> Die Kostenberechnung basiert auf einem geschätzten Tarif von 0.30 CHF/kWh. 
                  Tatsächliche Kosten können je nach Tarif und Nutzungsverhalten variieren.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};