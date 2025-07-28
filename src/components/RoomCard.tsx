import React from 'react';
import { Room, Device } from '../types';
import { DeviceCard } from './DeviceCard';

interface RoomCardProps {
  room: Room;
  onToggleDevice: (deviceId: string) => void;
  onShowDeviceDetails: (device: Device) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ 
  room, 
  onToggleDevice, 
  onShowDeviceDetails 
}) => {
  const totalConsumption = room.devices.reduce((total, device) => {
    const consumption = device.status === 'on' ? device.wattage : 
                       device.status === 'standby' ? device.standbyWattage : 0;
    return total + consumption;
  }, 0);

  const activeDevices = room.devices.filter(device => device.status !== 'off').length;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-medium text-gray-900 mb-1 tracking-tight">{room.name}</h3>
          <div className="flex items-center space-x-4 text-small text-gray-500">
            <span>{room.devices.length} Geräte</span>
            <span>{activeDevices} aktiv</span>
            <span className="font-medium text-gray-900">{totalConsumption}W</span>
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full ${
          totalConsumption > 0 ? 'bg-green-500' : 'bg-gray-300'
        }`}></div>
      </div>
      
      <div className="space-y-3">
        {room.devices.map(device => (
          <DeviceCard
            key={device.id}
            device={device}
            onToggle={onToggleDevice}
            onShowDetails={onShowDeviceDetails}
          />
        ))}
      </div>
    </div>
  );
};