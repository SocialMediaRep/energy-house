import React, { useState } from 'react';
import { Device } from '../types';
import { useDevices } from '../hooks/useDevices';
import { rooms } from '../data/rooms';
import { HouseLayout } from './HouseLayout';
import { DeviceModal } from './DeviceModal';
import { EnergyChart } from './EnergyChart';
import { SimpleLightSwitch } from './SimpleLightSwitch';
import { Zap, ArrowRight, Play } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { devices, loading, error, toggleDevice, getCurrentConsumption, getActiveConsumption, getStandbyConsumption } = useDevices();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const roomsWithDevices = rooms.map(room => ({
    ...room,
    devices: devices.filter(device => device.id.startsWith(room.id.replace(/([A-Z])/g, '-$1').toLowerCase() + '-'))
  }));

  // Find global lights device
  const globalLights = devices.find(device => device.id === 'global-lights');

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
          <h2 className="text-2xl font-medium text-gray-900 mb-2">Fehler beim Laden</h2>
          <p className="text-base text-gray-600 mb-4">{error}</p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 max-w-md mx-auto">
            <h3 className="h6 text-red-900 mb-2">Datenbank-Problem</h3>
            <p className="text-body-sm text-red-800 mb-3">
              Die Geräte-Tabelle existiert noch nicht in Ihrer Supabase-Datenbank.
            </p>
            <div className="text-left">
              <p className="text-body-sm font-medium text-red-900 mb-2">Lösung:</p>
              <ol className="text-body-sm text-red-800 space-y-1">
                <li>1. Gehen Sie zu Ihrem <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline font-medium">Supabase Dashboard</a></li>
                <li>2. Wählen Sie Ihr Projekt aus</li>
                <li>3. Klicken Sie auf "SQL Editor"</li>
                <li>4. Führen Sie die Migration aus (siehe unten)</li>
              </ol>
            </div>
          </div>
          <button
            onClick={() => {
              const sqlCode = document.getElementById('migration-sql');
              if (sqlCode) {
                navigator.clipboard.writeText(sqlCode.textContent || '');
                alert('SQL-Code wurde in die Zwischenablage kopiert!');
              }
            }}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors btn-text"
          >
            SQL-Code kopieren
          </button>
          <div className="bg-repower-dark text-green-400 p-4 rounded-lg text-left text-caption font-mono max-w-4xl mx-auto max-h-64 overflow-y-auto scrollbar-thin">
            <pre id="migration-sql">{`-- Geräte-Tabelle erstellen
CREATE TABLE IF NOT EXISTS devices (
  id text PRIMARY KEY,
  name text NOT NULL,
  icon text NOT NULL,
  wattage integer NOT NULL DEFAULT 0,
  standby_wattage integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'off' CHECK (status IN ('off', 'standby', 'on')),
  category text NOT NULL,
  room_id text NOT NULL,
  has_standby boolean NOT NULL DEFAULT false,
  tips text[] DEFAULT '{}',
  description text DEFAULT '',
  cost_per_hour decimal(10,4) NOT NULL DEFAULT 0.0000,
  energy_efficiency_rating text DEFAULT 'A',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS aktivieren
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

-- Öffentlichen Lesezugriff erlauben
CREATE POLICY "Allow public read access to devices"
  ON devices FOR SELECT TO public USING (true);

-- Authentifizierten Benutzern Änderungen erlauben
CREATE POLICY "Allow authenticated users to modify devices"
  ON devices FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Beispiel-Geräte einfügen
INSERT INTO devices (id, name, icon, wattage, standby_wattage, status, category, room_id, has_standby, tips, description, cost_per_hour, energy_efficiency_rating) VALUES
('living-tv', 'Fernseher', 'Tv', 120, 2, 'off', 'entertainment', 'living', true, 
 ARRAY['Schalten Sie den Fernseher komplett aus', 'Nutzen Sie den Energiesparmodus'], 
 'LED-Fernseher für Entertainment.', 0.036, 'A'),
('kitchen-fridge', 'Kühlschrank', 'Refrigerator', 150, 0, 'on', 'cooling', 'kitchen', false,
 ARRAY['Stellen Sie die optimale Temperatur ein (7°C)', 'Öffnen Sie die Tür nur kurz'], 
 'Kühlschrank zur Lebensmittelaufbewahrung.', 0.045, 'A+'),
('living-router', 'Router', 'Router', 12, 0, 'on', 'network', 'living', true,
 ARRAY['Platzieren Sie den Router zentral', 'Schalten Sie WLAN nachts aus'], 
 'WLAN-Router für Internetverbindung.', 0.004, 'A+');`}</pre>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white">

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
         <div class="bg-white rounded-2xl shadow-md p-5 w-full max-w-md">

          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-xl font-semibold text-gray-800">Küche</h2>
              <p class="text-sm text-gray-500">5 Geräte · 1 aktiv · <span class="text-red-600 font-medium">150 W</span></p>
            </div>
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        
          <ul class="space-y-2">
            <li class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
              <span class="text-gray-700">Mikrowelle</span>
              <span class="text-sm text-gray-400">Aus</span>
            </li>
            <li class="flex items-center justify-between bg-green-50 px-3 py-2 rounded-lg border border-green-200">
              <span class="text-gray-700 font-medium">Kühlschrank</span>
              <span class="text-sm text-green-600 font-semibold">150 W</span>
            </li>
            <li class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
              <span class="text-gray-700">Spülmaschine</span>
              <span class="text-sm text-gray-400">Aus</span>
            </li>
            <li class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
              <span class="text-gray-700">Herd</span>
              <span class="text-sm text-gray-400">Aus</span>
            </li>
            <li class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
              <span class="text-gray-700">Backofen</span>
              <span class="text-sm text-gray-400">Aus</span>
            </li>
          </ul>
        </div>
        </div>

           
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
        {/* Simple Light Switch */}
        {globalLights && (
          <div className="mb-6">
            <SimpleLightSwitch 
              isOn={globalLights.status === 'on'}
              onToggle={() => toggleDevice('global-lights')}
            />
          </div>
        )}

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