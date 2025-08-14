import React from 'react';
import { Power } from 'lucide-react';

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
  const someDevicesOn = activeDevices > 0;

  const handleToggle = () => {
    if (someDevicesOn) {
      onToggleAll('off');
    } else {
      onToggleAll('on');
    }
  };

  return (
    <div className="fixed top-0 right-0 z-50 p-6">
      <button
        onClick={handleToggle}
        className="group flex items-center space-x-2 h-10 px-4 bg-gray-100 hover:bg-red-500 border border-gray-300 rounded-lg transition-all duration-200 cursor-pointer"
        title="Alle Geräte ausschalten"
        aria-label="Alle Geräte ausschalten"
      >
        <Power 
          size={20} 
          strokeWidth={2} 
          className="text-gray-600 group-hover:text-white transition-colors duration-200" 
        />
        <span className="text-sm font-bold text-gray-900 group-hover:text-white transition-colors duration-200">
          Alle AUS
        </span>
        
        {/* Tooltip */}
        <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          Alle Geräte ausschalten
          <div className="absolute bottom-full right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
        </div>
      </button>
    </div>
  );
};