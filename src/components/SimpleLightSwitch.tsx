import React from 'react';
import { Lightbulb } from 'lucide-react';

interface SimpleLightSwitchProps {
  isOn: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const SimpleLightSwitch: React.FC<SimpleLightSwitchProps> = ({ 
  isOn, 
  onToggle, 
  disabled = false 
}) => {
  return (
    <div className="flex items-center space-x-3 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
      {/* Label */}
      <div className="flex items-center space-x-2">
        <Lightbulb 
          size={20} 
          className={`transition-colors duration-300 ${
            isOn ? 'text-yellow-500' : 'text-gray-400'
          }`}
        />
        <span className="text-sm font-medium text-gray-700">
          Licht (Alle Räume)
        </span>
      </div>

      {/* Simple Toggle Switch */}
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed ${
          isOn 
            ? 'bg-yellow-500' 
            : 'bg-gray-300 hover:bg-gray-400'
        }`}
        aria-label={`Licht ${isOn ? 'ausschalten' : 'einschalten'}`}
      >
        {/* Switch Handle */}
        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${
          isOn ? 'translate-x-6' : 'translate-x-0.5'
        }`}>
        </div>
      </button>

      {/* Status */}
      <span className={`text-xs font-medium transition-colors duration-300 ${
        isOn ? 'text-yellow-600' : 'text-gray-500'
      }`}>
        {isOn ? 'Ein' : 'Aus'}
      </span>

      {/* LED Energy Saving Tip */}
      <div className="text-xs text-gray-600 ml-auto">
        💡 LED sparen 80% Energie
      </div>
    </div>
  );
};