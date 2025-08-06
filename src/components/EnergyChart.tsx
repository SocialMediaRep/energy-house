import React, { useMemo, useState, useEffect } from 'react';
import { Info, X } from 'lucide-react';

interface EnergyChartProps {
  totalConsumption: number;
  activeConsumption: number;
  standbyConsumption: number;
  devices: any[];
}

interface DataPoint {
  timestamp: number;
  consumption: number;
}

type TimeRange = '1min' | '5min' | '30min';

export const EnergyChart: React.FC<EnergyChartProps> = ({
  totalConsumption,
  activeConsumption,
  standbyConsumption,
  devices
}) => {
  const [liveData, setLiveData] = useState<DataPoint[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('30min');

  // Calculate device statistics
  const activeDevices = Math.floor(activeConsumption / 100) || 1; // Rough estimate
  const standbyDevices = Math.floor(standbyConsumption / 10) || 0;
  const offDevices = 18 - activeDevices - standbyDevices; // Total assumed devices
  const hourlyCost = (totalConsumption / 1000) * 0.30; // CHF per kWh estimate
  const dailyCost = hourlyCost * 24;
  const monthlyCost = dailyCost * 30;
  const yearlyCost = dailyCost * 365;

  const [showCostModal, setShowCostModal] = useState(false);

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
    <div className="bg-white rounded-2xl border border-repower-gray-200 p-4 md:p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-8">
        <h2 className="text-lg md:text-2xl font-bold flex items-center">
          <div className="w-2 h-2 bg-repower-green-500 rounded-full mr-4"></div>
          <span className="hidden md:inline">Aktueller Stromverbrauch</span>
          <span className="md:hidden">Stromverbrauch</span>
        </h2>
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
                  { key: '1min' as TimeRange, label: '1 Min' },
                  { key: '5min' as TimeRange, label: '5 Min' },
                  { key: '30min' as TimeRange, label: '30 Min' }
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
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-low-contrast pr-2" >
                  {yAxisLabels.map((label, index) => (
                    <div key={index} className="text-right">
                      {label} kW
                    </div>
                  ))}
                </div>

                {/* Chart Area */}
                <div className="absolute inset-0 ml-8 md:ml-12">
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
              <div className="flex justify-between text-xs text-low-contrast mt-2 md:mt-4 ml-8 md:ml-12">
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
          <div className="md:col-span-1 grid grid-cols-2 md:grid-cols-1 gap-4 md:flex md:flex-col md:justify-center md:space-y-4">
            <div className="bg-repower-gray-50 rounded-lg p-4 md:p-6 text-center">
              <div className="text-body-sm text-low-contrast mb-1">
                Live <span className="text-caption">{formatTime(currentTime.getTime())}</span>
              </div>
              <div className="text-base font-medium text-high-contrast mb-1">
                Verbrauch
              </div>
              <div className="text-2xl font-light text-high-contrast">
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
              <div className="text-2xl font-light text-high-contrast">
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
              {/* Current Consumption */}
              <div className="mb-6">
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {(totalConsumption / 1000).toFixed(3)} kW
                  </div>
                  <div className="text-sm text-blue-700">Aktueller Verbrauch</div>
                </div>
              </div>

              {/* Cost Breakdown Table */}
              <div className="bg-white">
                <table className="w-full text-sm">
                  <tbody>
                    <tr>
                      <td className="py-3 px-4 text-repower-gray-700 font-medium">Strompreis</td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-semibold text-repower-dark">0.30</span>
                        <span className="text-repower-gray-500 ml-1">CHF/kWh</span>
                      </td>
                    </tr>
                    <tr className="bg-repower-gray-50">
                      <td className="py-3 px-4 text-repower-gray-700 font-medium">Kosten pro Stunde</td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-semibold text-repower-dark">{hourlyCost.toFixed(3)}</span>
                        <span className="text-repower-gray-500 ml-1">CHF</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-repower-gray-700 font-medium">Kosten pro Tag</td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-semibold text-repower-dark">{dailyCost.toFixed(2)}</span>
                        <span className="text-repower-gray-500 ml-1">CHF</span>
                      </td>
                    </tr>
                    <tr className="bg-repower-gray-50">
                      <td className="py-3 px-4 text-repower-gray-700 font-medium">Kosten pro Monat</td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-semibold text-repower-dark">{monthlyCost.toFixed(2)}</span>
                        <span className="text-repower-gray-500 ml-1">CHF</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-repower-gray-700 font-medium">Kosten pro Jahr</td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-semibold text-repower-dark">{yearlyCost.toFixed(2)}</span>
                        <span className="text-repower-gray-500 ml-1">CHF</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
                      <div className="text-sm font-bold text-repower-dark">
                        {hourlyCost.toFixed(3)} CHF/h
                      </div>
                      <div className="text-xs text-repower-gray-500">
                        {dailyCost.toFixed(2)} CHF/Tag
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Info Note */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-800">
                  <strong>💡 Hinweis:</strong> Die Kosten basieren auf dem aktuellen Verbrauch und einem Strompreis von 0.30 CHF/kWh. 
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