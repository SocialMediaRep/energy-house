import React, { useState, useEffect } from 'react';
import { Device } from '../types';
import { useDevices } from '../hooks/useDevices';
import { rooms } from '../data/rooms';
import { HouseLayout } from './HouseLayout';
import { DeviceModal } from './DeviceModal';
import { EnergyChart } from './EnergyChart';
import { SimpleLightSwitch } from './SimpleLightSwitch';
import { GlobalPowerControl } from './GlobalPowerControl';

export const Dashboard: React.FC = () => {
  const { devices, toggleDevice, toggleAllDevices, getCurrentConsumption, getActiveConsumption, getStandbyConsumption } = useDevices();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  // Track scroll position to show sticky header only when chart is not visible
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const chartSection = document.querySelector('.energy-chart-section');
      
      if (chartSection) {
        const chartBottom = chartSection.offsetTop + chartSection.offsetHeight;
        // Show sticky header when chart is completely out of view (with small buffer)
        setShowStickyHeader(scrollTop > chartBottom - 50);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const roomsWithDevices = rooms.map(room => ({
    ...room,
    devices: devices.filter(device => device.id.startsWith(room.id.replace(/([A-Z])/g, '-$1').toLowerCase() + '-'))
  }));

  // Find global lights device
  const globalLights = devices.find(device => device.id === 'global-lights');
  
  // Calculate stats for global control (excluding global lights)
  const regularDevices = devices.filter(device => device.id !== 'global-lights');
  const activeRegularDevices = regularDevices.filter(device => device.status !== 'off').length;

  return (
    <div className="min-h-screen bg-white">

      {/* Desktop: Fixed Energy Chart Section */}
      <section className="hidden md:block top-0 z-40 py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <EnergyChart 
            totalConsumption={getCurrentConsumption()}
            activeConsumption={getActiveConsumption()}
            standbyConsumption={getStandbyConsumption()}
            devices={devices}
            onToggleAll={toggleAllDevices}
          />
        </div>
      </section>

      {/* Mobile: Energy Chart (not sticky) */}
      <section className="md:hidden bg-gray-50 py-6 border-b border-gray-200 energy-chart-section ">
        <div className="px-4">
          <EnergyChart 
            totalConsumption={getCurrentConsumption()}
            activeConsumption={getActiveConsumption()}
            standbyConsumption={getStandbyConsumption()}
            devices={devices}
            onToggleAll={toggleAllDevices}
          />
        </div>
      </section>

      {/* Mobile: Sticky Compact Header */}
     {showStickyHeader && ( <div className={`md:hidden sticky top-0 z-40 transition-all duration-300 ${
        showStickyHeader 
          ? 'translate-y-0 opacity-100 shadow-lg bg-white border-b border-gray-200' 
          : '-translate-y-full opacity-0 pointer-events-none absolute'
      }`}>
        <div className="px-6 py-4">
          <div className="flex items-center gap-4 bg-gradient-to-r from-slate-50 to-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-6">
              {/* Current Consumption */}
              <div className="text-center bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                <div className="text-xl font-bold text-repower-dark">
                  {(getCurrentConsumption() / 1000).toFixed(2)} kW
                </div>
                <div className="text-xs font-medium text-repower-gray-600 mt-1">Verbrauch</div>
              </div>
              
              {/* Daily Cost */}
              <div className="text-center bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                <div className="text-xl font-bold text-repower-green-500">
                  {((getCurrentConsumption() / 1000) * 0.30).toFixed(3)} CHF
                </div>
                <div className="text-xs font-medium text-repower-gray-600 mt-1">Stündlich</div>
              </div>
            </div>
            
            {/* Status Indicator */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getCurrentConsumption() > 0 ? 'bg-green-500' : 'bg-gray-300'} animate-pulse`}></div>
              <span className="text-xs font-medium text-repower-gray-600">
                {getCurrentConsumption() > 0 ? 'Aktiv' : 'Inaktiv'}
              </span>
            </div>
          </div>
        </div>
      </div>)}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 pt-0 pb-2">
        {/* Simple Light Switch */}
        {globalLights && (
          <div className="mb-4 md:mb-12">
            <div>
              <SimpleLightSwitch 
                isOn={globalLights.status === 'on'}
                onToggle={() => toggleDevice('global-lights')}
              />
            </div>
          </div>
        )}

        {/* House Layout */}
        <div className="mt-2 md:mt-0">
          <HouseLayout 
          rooms={roomsWithDevices}
          onToggleDevice={toggleDevice}
          onShowDeviceDetails={setSelectedDevice}
          />
        </div>
      </main>

      {/* Floating Action Button */}

      {/* Device Modal */}
      <DeviceModal 
        device={selectedDevice}
        onClose={() => setSelectedDevice(null)}
      />
    </div>
  );
};