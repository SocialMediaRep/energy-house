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
      className="group relative inline-flex items-center justify-center space-x-2 w-full py-2 px-0 bg-red-600 hover:bg-red-700 rounded-full transition-all duration-200 cursor-pointer shadow-lg"
      style={{
        backgroundColor: '#EA1C00',
        borderRadius: '32px',
        boxShadow: '0 0 24px 0 rgba(0, 0, 0, 0.05), 0 16px 130px 0 rgba(96, 53, 103, 0.05)'
      }}
      title="Alle Geräte ausschalten"
      aria-label="Alle Geräte ausschalten"
    >
      <Power 
        size={20} 
        strokeWidth={2} 
        className="text-white transition-colors duration-200" 
      />
      <span className="text-sm font-bold text-repower-dark group-hover:text-white transition-colors duration-200">
      <span className="text-sm font-bold text-white transition-colors duration-200">
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