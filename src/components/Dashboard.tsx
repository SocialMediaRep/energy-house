import React, { useState } from 'react';
import { Device } from '../types';
import { useDevices } from '../hooks/useDevices';
import { rooms } from '../data/rooms';
import { HouseLayout } from './HouseLayout';
import { DeviceModal } from './DeviceModal';
import { EnergyChart } from './EnergyChart';
import { Zap, ArrowRight, Play } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { devices, loading, error, toggleDevice, getCurrentConsumption, getActiveConsumption, getStandbyConsumption } = useDevices();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const roomsWithDevices = rooms.map(room => ({
    ...room,
    devices: devices.filter(device => device.id.startsWith(room.id.replace(/([A-Z])/g, '-$1').toLowerCase() + '-'))
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Geräte...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Fehler beim Laden</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Bitte klicken Sie auf "Connect to Supabase" oben rechts, um die Datenbank zu verbinden.
          </p>
        </div>
      </div>
    );
  }
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