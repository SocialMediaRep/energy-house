import React from 'react';
import { Power } from 'lucide-react';

interface GlobalPowerControlProps {
  onToggleAll: (status: 'on' | 'off') => void;
}

export const GlobalPowerControl: React.FC<GlobalPowerControlProps> = ({
  onToggleAll
}) => {

  const handleToggle = () => {
    onToggleAll('off');
  };

  return (
    <button
      onClick={handleToggle}
      className="group relative flex items-center justify-center space-x-2 w-full py-2 bg-repower-gray-100 border border-repower-gray-200 hover:bg-repower-red rounded-lg transition-all duration-200 cursor-pointer"
      title="Alle Geräte ausschalten"
      aria-label="Alle Geräte ausschalten"
    >
      <Power 
        size={20} 
        strokeWidth={2} 
        className="text-repower-dark group-hover:text-white transition-colors duration-200" 
      />
      <span className="text-sm font-bold text-repower-dark group-hover:text-white transition-colors duration-200">
        Alle AUS
      </span>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        Alle Geräte ausschalten
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </button>
  );
};