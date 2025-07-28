import React from 'react';
import { Room, Device } from '../types';
import { RoomCard } from './RoomCard';

interface HouseLayoutProps {
  rooms: Room[];
  onToggleDevice: (deviceId: string) => void;
  onShowDeviceDetails: (device: Device) => void;
}

export const HouseLayout: React.FC<HouseLayoutProps> = ({ 
  rooms, 
  onToggleDevice, 
  onShowDeviceDetails 
}) => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Room grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {rooms.map(room => (
          <RoomCard
            key={room.id}
            room={room}
            onToggleDevice={onToggleDevice}
            onShowDeviceDetails={onShowDeviceDetails}
          />
        ))}
      </div>
    </div>
  );
};