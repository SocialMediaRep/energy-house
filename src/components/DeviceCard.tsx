import React from 'react';
import * as Icons from 'lucide-react';
import { iconMap } from '../utils/lucide-icons';
import { Device } from '../types';

interface DeviceCardProps {
  device: Device;
  onToggle: (deviceId: string) => void;
  onShowDetails: (device: Device) => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ 
  device, 
  onToggle, 
  onShowDetails 
}) => {
  const IconComponent = iconMap[device.icon as keyof typeof iconMap] as React.ComponentType<any>;
  const currentWattage = device.status === 'on' ? device.wattage : 
                        device.status === 'standby' ? device.standbyWattage : 0;
  
  const getStatusColor = () => {
    switch (device.status) {
      case 'on': return 'bg-green-600 border-green-500 text-white shadow-lg';
      case 'standby': return 'bg-orange-50 border-orange-200 text-gray-900';
      default: return 'bg-gray-50 border-gray-200 hover:shadow-md';
    }
  };

  const getIconColor = () => {
    switch (device.status) {
      case 'on': return 'bg-green-500 text-white';
      case 'standby': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIndicator = () => {
    switch (device.status) {
      case 'on': return 'bg-green-400 border-green-600';
      case 'standby': return 'bg-orange-400 border-orange-50';
      default: return 'bg-gray-300 border-gray-50';
    }
  };

  const getStatusBadge = () => {
    switch (device.status) {
      case 'on': return { bg: 'bg-green-600', text: 'text-white', label: 'Ein', dot: 'bg-white' };
      case 'standby': return { bg: 'bg-orange-500', text: 'text-white', label: 'Standby', dot: 'bg-white' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Aus', dot: 'bg-gray-400' };
    }
  };

  const getInfoButtonColor = () => {
    switch (device.status) {
      case 'on': return 'bg-green-500 text-white hover:bg-green-400 focus:ring-green-300';
      case 'standby': return 'bg-orange-100 text-orange-600 hover:bg-orange-200 hover:text-orange-800 focus:ring-orange-300';
      default: return 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 focus:ring-gray-300';
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div 
      className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 ${getStatusColor()}`}
      onClick={() => onToggle(device.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle(device.id);
        }
      }}
      aria-label={`${device.name} Status: ${statusBadge.label}`}
    >
      <div className="flex items-center space-x-4">
        {/* Device Icon with Status Indicator */}
        <div className="relative">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
            getIconColor()
          }`}>
            <IconComponent size={20} />
          </div>
          
          {/* Power Status Indicator */}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${getStatusIndicator()}`}>
            {device.status === 'on' && (
              <div className="w-full h-full rounded-full animate-pulse bg-green-300"></div>
            )}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className={`font-medium text-sm truncate ${
              device.status === 'on' ? 'text-white' : 'text-gray-900'
            }`}>
              {device.name}
            </h4>
            <span className={`text-xs font-medium ${
              device.status === 'on' ? 'text-gray-300' : 'text-gray-500'
            }`}>
              {currentWattage}W
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            {/* Power Status Badge */}
            <div className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${statusBadge.bg} ${statusBadge.text}`}>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${statusBadge.dot}`}></div>
                <span>{statusBadge.label}</span>
              </div>
            </div>

            {/* Info Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShowDetails(device);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  onShowDetails(device);
                }
              }}
              className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${getInfoButtonColor()}`}
              aria-label={`Details für ${device.name} anzeigen`}
              title="Geräte-Details anzeigen"
            >
              <Icons.Info size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};