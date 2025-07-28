import React, { useState } from 'react';
import { Device } from '../types';
import { useDevices } from '../hooks/useDevices';
import { rooms } from '../data/rooms';
import { HouseLayout } from './HouseLayout';
import { DeviceModal } from './DeviceModal';
import { EnergyChart } from './EnergyChart';
import { Zap, ArrowRight, Play } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { devices, toggleDevice, getCurrentConsumption, getActiveConsumption, getStandbyConsumption } = useDevices();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const roomsWithDevices = rooms.map(room => ({
    ...room,
    devices: devices.filter(device => device.id.startsWith(room.id.replace(/([A-Z])/g, '-$1').toLowerCase() + '-'))
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Energy Chart Section */}
      <section className="sticky top-0 z-40 bg-gray-50 py-8 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EnergyChart 
            totalConsumption={getCurrentConsumption()}
            activeConsumption={getActiveConsumption()}
            standbyConsumption={getStandbyConsumption()}
          />
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* House Layout */}
        <HouseLayout 
          rooms={roomsWithDevices}
          onToggleDevice={toggleDevice}
          onShowDeviceDetails={setSelectedDevice}
        />
      </main>

      {/* Device Modal */}
      <DeviceModal 
        device={selectedDevice}
        onClose={() => setSelectedDevice(null)}
      />
    </div>
  );
};