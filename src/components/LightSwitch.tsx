import React from 'react';
import { Lightbulb, Sun, Moon } from 'lucide-react';

interface LightSwitchProps {
  isOn: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const LightSwitch: React.FC<LightSwitchProps> = ({ 
  isOn, 
  onToggle, 
  disabled = false 
}) => {
  return (
    <div className="flex flex-col items-center space-y-3">
      {/* Light Status Indicator */}
      <div className="flex items-center space-x-2">
        <div className={`transition-all duration-300 ${
          isOn ? 'text-yellow-500' : 'text-gray-400'
        }`}>
          {isOn ? <Sun size={20} /> : <Moon size={16} />}
        </div>
        <span className={`text-sm font-medium transition-colors duration-300 ${
          isOn ? 'text-yellow-600' : 'text-gray-500'
        }`}>
          {isOn ? 'Licht an' : 'Licht aus'}
        </span>
      </div>

      {/* Interactive Switch */}
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`relative w-20 h-10 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed ${
          isOn 
            ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg shadow-yellow-200' 
            : 'bg-gray-300 hover:bg-gray-400'
        }`}
        aria-label={`Licht ${isOn ? 'ausschalten' : 'einschalten'}`}
      >
        {/* Switch Handle */}
        <div className={`absolute top-1 w-8 h-8 bg-white rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${
          isOn ? 'translate-x-10' : 'translate-x-1'
        }`}>
          <Lightbulb 
            size={16} 
            className={`transition-colors duration-300 ${
              isOn ? 'text-yellow-500' : 'text-gray-400'
            }`}
          />
        </div>

        {/* Glow Effect when On */}
        {isOn && (
          <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-20 animate-pulse"></div>
        )}
      </button>

      {/* Power Consumption Display */}
      <div className={`text-xs transition-colors duration-300 ${
        isOn ? 'text-yellow-600' : 'text-gray-400'
      }`}>
        {isOn ? '300W' : '0W'}
      </div>
    </div>
  );
};