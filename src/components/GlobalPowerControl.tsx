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
    <button
      onClick={handleToggle}
      className="fixed bottom-6 right-6 w-14 h-14 bg-gray-100 hover:bg-red-500 text-gray-600 hover:text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center cursor-pointer z-50 group"
      title="Alle Geräte ausschalten"
      aria-label="Alle Geräte ausschalten"
    >
      <Power size={24} strokeWidth={2} className="transition-colors duration-200" />
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        Alle Geräte ausschalten
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </button>
  );
};