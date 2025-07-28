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
    <div className="flex items-center space-x-4 bg-white rounded-2xl p-4 md:p-8 border border-repower-gray-200 shadow-sm">
      {/* Label */}
      <div className="flex items-center space-x-3">
        <Lightbulb 
          size={20} 
          className={`transition-colors duration-300 ${
            isOn ? 'text-repower-orange-500' : 'text-repower-gray-400'
          }`}
        />
        <span className="text-sm md:text-base font-medium text-medium-contrast">
          Licht (Alle Räume)
        </span>
      </div>

      {/* Simple Toggle Switch */}
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed ${
          isOn 
            ? 'bg-repower-orange-500' 
            : 'bg-repower-gray-300 hover:bg-repower-gray-400'
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
      <span className={`text-sm md:text-base font-medium transition-colors duration-300 ${
        isOn ? 'text-repower-orange-600' : 'text-low-contrast'
      }`}>
        {isOn ? 'Ein' : 'Aus'}
      </span>

      {/* LED Energy Saving Tip */}
      <div className="hidden md:block text-caption text-low-contrast ml-auto bg-repower-gray-50 px-3 py-2 rounded-md">
        💡 <span className="font-medium">Tipp:</span> LED sparen 80% Energie
      </div>
    </div>
  );
};