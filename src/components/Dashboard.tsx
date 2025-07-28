import React, { useState } from 'react';
import { Device } from '../types';
import { useDevices } from '../hooks/useDevices';
import { rooms } from '../data/rooms';
import { HouseLayout } from './HouseLayout';
import { DeviceModal } from './DeviceModal';
import { EnergyChart } from './EnergyChart';
import { Zap, MapPin, ArrowRight, Play, User, Phone, Mail } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { devices, toggleDevice, getCurrentConsumption, getActiveConsumption, getStandbyConsumption } = useDevices();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const roomsWithDevices = rooms.map(room => ({
    ...room,
    devices: devices.filter(device => device.id.startsWith(room.id.replace(/([A-Z])/g, '-$1').toLowerCase() + '-'))
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white overflow-hidden pt-8">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Logo Section */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded flex items-center justify-center">
                <Zap className="text-white" size={28} />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">REPOWER</div>
                <div className="text-sm text-red-200 -mt-1">Smart Energy Monitor</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Ihr Smart Home
                <span className="block text-red-200">Energy Monitor</span>
              </h1>
              <p className="text-xl mb-8 text-red-100 leading-relaxed">
                Überwachen und optimieren Sie Ihren Energieverbrauch in Echtzeit. 
                Mit intelligenter Technologie zu nachhaltiger Energie.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-red-600 px-8 py-4 rounded-full font-semibold hover:bg-red-50 transition-colors flex items-center justify-center space-x-2">
                  <span>Jetzt starten</span>
                  <ArrowRight size={20} />
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-red-600 transition-colors flex items-center justify-center space-x-2">
                  <Play size={20} />
                  <span>Video ansehen</span>
                </button>
              </div>
            </div>
            
            {/* Energy Stats */}
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-8 border border-white border-opacity-20">
              <h3 className="text-2xl font-bold mb-6 text-center">Live Verbrauch</h3>
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <Zap className="text-white" size={16} />
                  <span className="text-sm font-semibold text-white">
                    {getCurrentConsumption()}W
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{getCurrentConsumption()}W</div>
                  <div className="text-red-200">Aktueller Verbrauch</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-300">{getActiveConsumption()}W</div>
                    <div className="text-sm text-red-200">Aktive Geräte</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-300">{getStandbyConsumption()}W</div>
                    <div className="text-sm text-red-200">Standby</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Energy Chart Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EnergyChart 
            totalConsumption={getCurrentConsumption()}
            activeConsumption={getActiveConsumption()}
            standbyConsumption={getStandbyConsumption()}
          />
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ihre Geräte im Überblick</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Verwalten Sie alle Ihre Smart Home Geräte zentral und behalten Sie den Überblick 
            über Ihren Energieverbrauch in jedem Raum.
          </p>
        </div>
        
        {/* House Layout */}
        <HouseLayout 
          rooms={roomsWithDevices}
          onToggleDevice={toggleDevice}
          onShowDeviceDetails={setSelectedDevice}
        />
      </main>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Sparen Sie bis zu 30% Energiekosten
          </h2>
          <p className="text-xl text-red-100 mb-10 max-w-3xl mx-auto">
            Nutzen Sie unsere intelligenten Empfehlungen und optimieren Sie Ihren Verbrauch 
            mit der Erfahrung von über 100 Jahren Energiekompetenz.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="bg-white text-red-600 px-10 py-4 rounded-full font-semibold hover:bg-red-50 transition-colors text-lg">
              Kostenlose Beratung
            </button>
            <button className="border-2 border-white text-white px-10 py-4 rounded-full font-semibold hover:bg-white hover:text-red-600 transition-colors text-lg">
              Mehr erfahren
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center">
                  <Zap className="text-white" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-500">REPOWER</div>
                  <div className="text-xs text-gray-400 -mt-1">Smart Energy</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Ihr zuverlässiger Partner für nachhaltige Energielösungen in der Schweiz.
              </p>
            </div>
            
            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Services</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Strom</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Gas</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Fernwärme</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Photovoltaik</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">E-Mobilität</a></li>
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Unternehmen</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Über uns</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Nachhaltigkeit</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Karriere</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Medien</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Investor Relations</a></li>
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Kontakt</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2 text-gray-400">
                  <Phone size={16} />
                  <span>081 839 71 11</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <Mail size={16} />
                  <span>info@repower.com</span>
                </div>
                <div className="flex items-start space-x-2 text-gray-400">
                  <MapPin size={16} className="mt-0.5" />
                  <div>
                    <div>Repower AG</div>
                    <div>Via da Clalt 307</div>
                    <div>7742 Poschiavo</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-sm text-gray-400 mb-4 md:mb-0">
                &copy; 2024 Repower AG. Alle Rechte vorbehalten.
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Datenschutz</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">AGB</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Impressum</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie-Einstellungen</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Device Modal */}
      <DeviceModal 
        device={selectedDevice}
        onClose={() => setSelectedDevice(null)}
      />
    </div>
  );
};