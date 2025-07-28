import React from 'react';
import { LightSwitch } from './LightSwitch';
import { Home, Zap, Euro } from 'lucide-react';

interface GlobalLightControlProps {
  isOn: boolean;
  onToggle: () => void;
  totalRooms?: number;
}

export const GlobalLightControl: React.FC<GlobalLightControlProps> = ({ 
  isOn, 
  onToggle, 
  totalRooms = 6 
}) => {
  const wattage = isOn ? 300 : 0;
  const costPerHour = isOn ? 0.09 : 0;
  const dailyCost = costPerHour * 24;

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isOn 
              ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-200' 
              : 'bg-gray-200 text-gray-500'
          }`}>
            <Home size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Hausbeleuchtung</h3>
            <p className="text-sm text-gray-600">Zentrale Lichtsteuerung</p>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
          isOn 
            ? 'bg-yellow-500 text-white shadow-md' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {totalRooms} Räume {isOn ? 'beleuchtet' : 'dunkel'}
        </div>
      </div>

      {/* Main Switch */}
      <div className="flex justify-center mb-6">
        <LightSwitch isOn={isOn} onToggle={onToggle} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-white rounded-xl border border-yellow-100">
          <div className="flex items-center justify-center mb-2">
            <Zap className={`w-5 h-5 ${isOn ? 'text-yellow-500' : 'text-gray-400'}`} />
          </div>
          <div className={`text-lg font-bold transition-colors duration-300 ${
            isOn ? 'text-yellow-600' : 'text-gray-400'
          }`}>
            {wattage}W
          </div>
          <div className="text-xs text-gray-500">Verbrauch</div>
        </div>

        <div className="text-center p-3 bg-white rounded-xl border border-yellow-100">
          <div className="flex items-center justify-center mb-2">
            <Euro className={`w-5 h-5 ${isOn ? 'text-green-500' : 'text-gray-400'}`} />
          </div>
          <div className={`text-lg font-bold transition-colors duration-300 ${
            isOn ? 'text-green-600' : 'text-gray-400'
          }`}>
            {costPerHour.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">CHF/Stunde</div>
        </div>

        <div className="text-center p-3 bg-white rounded-xl border border-yellow-100">
          <div className="flex items-center justify-center mb-2">
            <Euro className={`w-5 h-5 ${isOn ? 'text-blue-500' : 'text-gray-400'}`} />
          </div>
          <div className={`text-lg font-bold transition-colors duration-300 ${
            isOn ? 'text-blue-600' : 'text-gray-400'
          }`}>
            {dailyCost.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">CHF/Tag</div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-4 p-3 bg-white rounded-xl border border-yellow-100">
        <div className="text-xs text-gray-600 text-center">
          💡 <strong>Tipp:</strong> LED-Lampen sparen bis zu 80% Energie gegenüber Glühbirnen
        </div>
      </div>
    </div>
  );
};