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
    // Special styling for global devices
    if (device.id.startsWith('global-')) {
      switch (device.status) {
        case 'on': return 'bg-yellow-50 border-yellow-200';
        case 'standby': return 'bg-yellow-50 border-yellow-200';
        default: return 'bg-white border-gray-200';
      }
    }
    
    switch (device.status) {
      case 'on': return 'bg-green-50 border-green-200';
      case 'standby': return 'bg-orange-50 border-orange-200';
      default: return 'bg-white border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (device.status) {
      case 'on': return currentWattage > 0 ? `${currentWattage}W` : 'Ein';
      case 'standby': return currentWattage > 0 ? `${currentWattage}W (Standby)` : '(Standby)';
      default: return 'Aus';
    }
  };

  const getStatusTextColor = () => {
    if (device.id.startsWith('global-')) {
      switch (device.status) {
        case 'on': return 'text-yellow-600 font-medium';
        case 'standby': return 'text-yellow-600';
        default: return 'text-gray-500';
      }
    }
    
    switch (device.status) {
      case 'on': return 'text-green-600 font-medium';
      case 'standby': return 'text-orange-600';
      default: return 'text-gray-500';
    }
  };

  const getStatusDot = () => {
    if (device.id.startsWith('global-')) {
      switch (device.status) {
        case 'on': return 'bg-yellow-500';
        case 'standby': return 'bg-yellow-400';
        default: return 'bg-gray-300';
      }
    }
    
    switch (device.status) {
      case 'on': return 'bg-green-500';
      case 'standby': return 'bg-orange-400';
      default: return 'bg-gray-300';
    }
  };

  const isGlobalDevice = device.id.startsWith('global-');

  return (
    <div 
      className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${getStatusColor()}`}
      onClick={() => onToggle(device.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle(device.id);
        }
      }}
      aria-label={`${device.name} Status: ${getStatusText()}`}
    >
      {/* Device Name */}
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        {/* Status Dot */}
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusDot()}`}></div>
        
        <span className="text-body font-normal text-gray-800 truncate">
          {device.name}
        </span>
      </div>

      {/* Status/Wattage Display */}
      <div className="flex items-center space-x-3">
        <span className={`text-body-sm ${getStatusTextColor()}`}>
          {getStatusText()}
        </span>
        
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
          className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
          aria-label={`Details für ${device.name} anzeigen`}
          title="Geräte-Details anzeigen"
        >
          <Icons.Info size={14} />
        </button>
      </div>
    </div>
  );
};