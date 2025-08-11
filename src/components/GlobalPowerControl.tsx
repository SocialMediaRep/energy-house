import React from 'react';
import { Power, Zap, Activity } from 'lucide-react';

interface GlobalPowerControlProps {
  onToggleAll: (status: 'on' | 'off') => void;
  totalDevices: number;
  activeDevices: number;
  totalConsumption: number;
}

export const GlobalPowerControl: React.FC<GlobalPowerControlProps> = ({
  onToggleAll,
  totalDevices,
  activeDevices,
  totalConsumption
}) => {
  const allDevicesOn = activeDevices === totalDevices;
  const someDevicesOn = activeDevices > 0;

  const handleToggle = () => {
    if (someDevicesOn) {
      onToggleAll('off');
    } else {
      onToggleAll('on');
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-4 md:p-6 border-2 border-gray-200 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
            someDevicesOn 
              ? 'bg-green-500 text-white shadow-lg shadow-green-200' 
              : 'bg-gray-200 text-gray-500'
          }`}>
            <Activity size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Alle Geräte</h3>
            <p className="text-sm text-gray-600">Zentrale Steuerung</p>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
          allDevicesOn 
            ? 'bg-green-100 text-green-700' 
            : someDevicesOn
            ? 'bg-orange-100 text-orange-700'
            : 'bg-gray-100 text-gray-600'
        }`}>
          {activeDevices} von {totalDevices} aktiv
        </div>
      </div>

      {/* Main Control */}
      <div className="flex items-center justify-between">
        {/* Power Button */}
        <button
          onClick={handleToggle}
          className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
            someDevicesOn
              ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-200'
              : 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-200'
          }`}
          title={someDevicesOn ? 'Alle Geräte ausschalten' : 'Alle Geräte einschalten'}
        >
          <Power size={20} />
          <span className="font-semibold">
            {someDevicesOn ? 'Alle AUS' : 'Alle EIN'}
          </span>
        </button>

        {/* Stats */}
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className={`flex items-center space-x-1 text-lg font-bold transition-colors duration-300 ${
              someDevicesOn ? 'text-green-600' : 'text-gray-400'
            }`}>
              <Zap size={16} />
              <span>{(totalConsumption / 1000).toFixed(2)} kW</span>
            </div>
            <div className="text-xs text-gray-500">Gesamtverbrauch</div>
          </div>
          
          <div className="text-center">
            <div className={`text-lg font-bold transition-colors duration-300 ${
              someDevicesOn ? 'text-blue-600' : 'text-gray-400'
            }`}>
              {((totalConsumption / 1000) * 0.30).toFixed(3)} CHF
            </div>
            <div className="text-xs text-gray-500">pro Stunde</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Geräte-Status</span>
          <span>{Math.round((activeDevices / totalDevices) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              allDevicesOn ? 'bg-green-500' : someDevicesOn ? 'bg-orange-400' : 'bg-gray-300'
            }`}
            style={{ width: `${(activeDevices / totalDevices) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
        <div className="text-xs text-blue-700 text-center">
          💡 <strong>Tipp:</strong> {someDevicesOn 
            ? 'Schalten Sie ungenutzte Geräte aus, um Energie zu sparen' 
            : 'Alle Geräte sind ausgeschaltet - maximale Energieeffizienz!'
          }
        </div>
      </div>
    </div>
  );
};