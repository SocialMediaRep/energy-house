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
    <div className="flex items-center space-x-4 bg-white rounded-2xl p-3 md:p-8 border border-repower-gray-200 shadow-sm">
    <button
      onClick={handleToggle}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 hover:scale-105 active:scale-95 ${
        someDevicesOn
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-green-500 text-white hover:bg-green-600'
      }`}
      title={someDevicesOn ? 'Alle Geräte ausschalten' : 'Alle Geräte einschalten'}
    >
      <Power size={16} />
      <span>
        {someDevicesOn ? 'Alle AUS' : 'Alle EIN'}
      </span>
    </button>
      </div>
  );
};