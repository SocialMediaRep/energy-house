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
    <div className="flex justify-center mb-6">
      <button
        onClick={handleToggle}
        className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg ${
          someDevicesOn
            ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-200'
            : 'bg-green-500 text-white hover:bg-green-600 shadow-green-200'
        }`}
        title={someDevicesOn ? 'Alle Geräte ausschalten' : 'Alle Geräte einschalten'}
      >
        <Power size={24} />
        <span>
          {someDevicesOn ? 'Alle AUS' : 'Alle EIN'}
        </span>
      </button>
    </div>
  );
};