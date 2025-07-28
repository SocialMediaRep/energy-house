import React, { useMemo } from 'react';
import { Device } from '../types';

interface DeviceChartProps {
  device: Device;
}

interface DataPoint {
  timestamp: number;
  consumption: number;
  phase: 'startup' | 'running' | 'idle' | 'off';
  label: string;
}

export const DeviceChart: React.FC<DeviceChartProps> = ({ device }) => {
  // Generate static exemplary pattern based on device type
  const exemplaryData = useMemo(() => {
    const data: DataPoint[] = [];
    const baseTime = Date.now() - (30 * 60 * 1000); // 30 minutes ago
    const intervals = 30; // 30 data points (1 minute each)
    
    // Generate device-specific exemplary patterns
    for (let i = 0; i < intervals; i++) {
      const timestamp = baseTime + (i * 60 * 1000); // 1 minute intervals
      let consumption = 0;
      let phase: 'startup' | 'running' | 'idle' | 'off' = 'off';
      let label = '';
      
      switch (device.category) {
        case 'entertainment': // TV, Soundbar, Console
          if (i < 2) {
            // Startup phase
            phase = 'startup';
            consumption = device.wattage * 1.3;
            label = 'Einschalten';
          } else if (i < 25) {
            // Running phase with content variations
            phase = 'running';
            const contentVariation = 1 + Math.sin(i * 0.3) * 0.2; // Simulate different content brightness
            consumption = device.wattage * contentVariation;
            label = 'Wiedergabe';
          } else {
            // Standby or off
            if (device.hasStandby) {
              phase = 'idle';
              consumption = device.standbyWattage;
              label = 'Standby';
            } else {
              phase = 'off';
              consumption = 0;
              label = 'Aus';
            }
          }
          break;
          
        case 'electronics': // PC, Smartphone
          if (device.name.includes('PC')) {
            if (i < 3) {
              // Boot sequence
              phase = 'startup';
              consumption = device.wattage * 1.5;
              label = 'Hochfahren';
            } else if (i < 20) {
              // Variable workload
              phase = 'running';
              const workload = 0.3 + Math.sin(i * 0.4) * 0.4 + Math.cos(i * 0.7) * 0.2;
              consumption = device.wattage * Math.max(0.2, Math.min(1.0, workload));
              label = 'Arbeiten';
            } else if (i < 25) {
              // Idle but on
              phase = 'idle';
              consumption = device.wattage * 0.3;
              label = 'Leerlauf';
            } else {
              // Standby
              phase = 'idle';
              consumption = device.standbyWattage;
              label = 'Standby';
            }
          } else {
            // Smartphone - simple charging pattern
            if (i < 15) {
              phase = 'running';
              consumption = device.wattage;
              label = 'Laden';
            } else {
              phase = 'off';
              consumption = 0;
              label = 'Vollgeladen';
            }
          }
          break;
          
        case 'cooking': // Microwave, Oven
          if (i < 1) {
            phase = 'startup';
            consumption = device.wattage * 1.1;
            label = 'Aufheizen';
          } else if (i < 8) {
            // Cooking cycle
            phase = 'running';
            consumption = device.wattage + Math.sin(i * 0.8) * device.wattage * 0.1;
            label = 'Kochen';
          } else {
            phase = 'off';
            consumption = 0;
            label = 'Aus';
          }
          break;
          
        case 'cooling': // Fridge, Freezer
          // Refrigeration cycles
          const cyclePosition = (i % 10) / 10; // 10-minute cycles
          if (cyclePosition < 0.4) {
            // Compressor running
            phase = 'running';
            consumption = device.wattage;
            label = 'Kühlen';
          } else {
            // Compressor off, but still "on"
            phase = 'idle';
            consumption = device.wattage * 0.1;
            label = 'Bereit';
          }
          break;
          
        case 'cleaning': // Washer, Dryer, Dishwasher
          if (i < 2) {
            // Fill water
            phase = 'startup';
            consumption = device.wattage * 0.6;
            label = 'Befüllen';
          } else if (i < 8) {
            // Wash cycle
            phase = 'running';
            consumption = device.wattage * 1.2;
            label = 'Waschen';
          } else if (i < 12) {
            // Spin cycle
            phase = 'running';
            consumption = device.wattage * 1.4;
            label = 'Schleudern';
          } else if (i < 15) {
            // Drain
            phase = 'running';
            consumption = device.wattage * 0.4;
            label = 'Abpumpen';
          } else {
            phase = 'off';
            consumption = 0;
            label = 'Fertig';
          }
          break;
          
        case 'heating': // Boiler, Shower
          if (i < 2) {
            // Initial heating
            phase = 'startup';
            consumption = device.wattage * 1.2;
            label = 'Aufheizen';
          } else if (i < 15) {
            // Maintaining temperature
            phase = 'running';
            const heatCycle = Math.sin(i * 0.5) * 0.3 + 0.7;
            consumption = device.wattage * heatCycle;
            label = 'Heizen';
          } else {
            phase = 'idle';
            consumption = device.wattage * 0.1;
            label = 'Bereit';
          }
          break;
          
        case 'network': // Router
          // Always on with activity spikes
          phase = 'running';
          const networkActivity = 1 + Math.random() * 0.5;
          consumption = device.wattage * networkActivity;
          label = 'Netzwerk';
          break;
          
        case 'mobility': // E-Bike, E-Car, E-Scooter
          if (i < 20) {
            // Charging curve: high initially, then tapers off
            const chargeLevel = i / 20;
            phase = 'running';
            consumption = device.wattage * (1 - chargeLevel * 0.7);
            label = 'Laden';
          } else {
            // Trickle charge
            phase = 'idle';
            consumption = device.wattage * 0.05;
            label = 'Erhaltung';
          }
          break;
          
        default:
          // Generic pattern
          if (i < 2) {
            phase = 'startup';
            consumption = device.wattage * 1.1;
            label = 'Start';
          } else if (i < 20) {
            phase = 'running';
            consumption = device.wattage + Math.sin(i * 0.3) * device.wattage * 0.1;
            label = 'Betrieb';
          } else {
            phase = 'off';
            consumption = 0;
            label = 'Aus';
          }
      }
      
      data.push({
        timestamp,
        consumption: Math.max(0, consumption),
        phase,
        label
      });
    }
    
    return data;
  }, [device]);

  const maxConsumption = useMemo(() => {
    return Math.max(...exemplaryData.map(d => d.consumption), device.wattage * 1.5, 100);
  }, [exemplaryData, device.wattage]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };

  const getStatusColor = (phase: 'startup' | 'running' | 'idle' | 'off') => {
    switch (phase) {
      case 'startup': return '#ef4444'; // red
      case 'running': return '#10b981'; // green
      case 'idle': return '#f59e0b'; // orange
      default: return '#6b7280'; // gray
    }
  };

  const getPhaseLabel = (phase: 'startup' | 'running' | 'idle' | 'off') => {
    switch (phase) {
      case 'startup': return 'Anlauf';
      case 'running': return 'Betrieb';
      case 'idle': return 'Bereit';
      default: return 'Aus';
    }
  };

  // Generate SVG path for the line
  const generatePath = () => {
    if (exemplaryData.length < 2) return '';
    
    const width = 100;
    const height = 100;
    const stepX = width / (exemplaryData.length - 1);
    
    let path = '';
    
    exemplaryData.forEach((point, index) => {
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
  const startTime = new Date(currentTime.getTime() - 30 * 60 * 1000);

  // Get typical consumption values for this device
  const typicalStartup = Math.round(device.wattage * 1.3);
  const typicalRunning = device.wattage;
  const typicalIdle = device.hasStandby ? device.standbyWattage : Math.round(device.wattage * 0.1);

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold text-slate-800 mb-1">Typisches Verhalten</h4>
          <div className="text-sm text-gray-600">
            Exemplarischer 30-Minuten-Zyklus für {device.name}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Beispiel-Verlauf</div>
          <div className="text-sm font-medium text-gray-700">
            30 Min Zyklus
          </div>
        </div>
      </div>

      {/* Device-specific consumption breakdown */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white p-3 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs font-medium text-gray-700">Betrieb</span>
          </div>
          <div className="text-lg font-bold text-green-600 mt-1">
            {typicalRunning}W
          </div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-xs font-medium text-gray-700">Anlauf</span>
          </div>
          <div className="text-lg font-bold text-red-600 mt-1">
            {typicalStartup}W
          </div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-xs font-medium text-gray-700">Bereit</span>
          </div>
          <div className="text-lg font-bold text-orange-600 mt-1">
            {typicalIdle}W
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-40 relative bg-white rounded-xl p-3 overflow-hidden border border-gray-200">
        {/* Background grid */}
        <div className="absolute inset-3 opacity-10">
          <div className="w-full h-full grid grid-cols-6 grid-rows-4 gap-0">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="border-r border-b border-gray-400 last:border-r-0"></div>
            ))}
          </div>
        </div>

        {/* Bar Chart with phase colors */}
        <div className="absolute inset-3 flex items-end justify-between">
          {exemplaryData.map((data, index) => (
            <div
              key={data.timestamp}
              className="flex-1 flex flex-col items-center justify-end mr-1 last:mr-0"
              title={`${data.label}: ${Math.round(data.consumption)}W`}
            >
              <div
                className="w-full rounded-t-sm transition-all duration-300"
                style={{
                  height: `${Math.max(2, (data.consumption / maxConsumption) * 100)}%`,
                  backgroundColor: getStatusColor(data.phase),
                  opacity: 0.8
                }}
              />
            </div>
          ))}
        </div>

        {/* Line Chart Overlay */}
        {exemplaryData.length > 1 && (
          <div className="absolute inset-3">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id={`exemplaryLineGradient-${device.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#64748b" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#1e293b" stopOpacity="1" />
                </linearGradient>
              </defs>
              <path
                d={generatePath()}
                fill="none"
                stroke={`url(#exemplaryLineGradient-${device.id})`}
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-sm"
              />
            </svg>
          </div>
        )}
        
        {/* Max value indicator */}
        <div className="absolute top-2 left-3 text-xs text-gray-500 bg-white px-2 py-1 rounded border">
          Max: {Math.round(maxConsumption)}W
        </div>

        {/* Device category indicator */}
        <div className="absolute top-2 right-3 text-xs text-white bg-slate-600 px-2 py-1 rounded">
          {device.category === 'entertainment' ? 'Unterhaltung' :
           device.category === 'electronics' ? 'Elektronik' :
           device.category === 'cooking' ? 'Kochen' :
           device.category === 'cooling' ? 'Kühlung' :
           device.category === 'cleaning' ? 'Reinigung' :
           device.category === 'heating' ? 'Heizung' :
           device.category === 'network' ? 'Netzwerk' :
           device.category === 'mobility' ? 'Mobilität' :
           'Sonstiges'}
        </div>
      </div>

      {/* Time labels */}
      <div className="flex justify-between text-xs text-gray-500 mt-2 px-3">
        <span>Start</span>
        <span>15 Min</span>
        <span>30 Min</span>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-4 mt-3 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-gray-600">Anlauf</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-gray-600">Betrieb</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-orange-500 rounded"></div>
          <span className="text-gray-600">Bereit</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-gray-500 rounded"></div>
          <span className="text-gray-600">Aus</span>
        </div>
      </div>

      {/* Device behavior description */}
      <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
        <div className="text-sm text-blue-800">
          <strong>Typisches Verhalten:</strong> {
            device.category === 'entertainment' ? 'Einschaltspitze, dann konstanter Verbrauch je nach Inhell' :
            device.category === 'electronics' && device.name.includes('PC') ? 'Hoher Startverbrauch beim Booten, dann variable Last je nach Nutzung' :
            device.category === 'cooking' ? 'Sofortiger hoher Verbrauch während der Nutzung' :
            device.category === 'cooling' ? 'Zyklischer Betrieb - Kompressor läuft periodisch' :
            device.category === 'cleaning' ? 'Verschiedene Phasen: Befüllen, Waschen, Schleudern' :
            device.category === 'heating' ? 'Aufheizphase, dann Temperatur halten' :
            device.category === 'network' ? 'Konstanter Grundverbrauch mit Aktivitätsspitzen' :
            device.category === 'mobility' ? 'Ladekurve: Hoch am Anfang, dann abnehmend' :
            'Anlaufphase, dann konstanter Betrieb'
          }
        </div>
      </div>
    </div>
  );
};