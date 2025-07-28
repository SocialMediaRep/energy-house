import React from 'react';
import * as Icons from 'lucide-react';
import { iconMap } from '../utils/lucide-icons';
import { Device } from '../types';
import { DeviceChart } from './DeviceChart';

interface DeviceModalProps {
  device: Device | null;
  onClose: () => void;
}

export const DeviceModal: React.FC<DeviceModalProps> = ({ device, onClose }) => {
  if (!device) return null;

  const IconComponent = iconMap[device.icon as keyof typeof iconMap] as React.ComponentType<any>;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-100 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-semibold text-gray-900">{device.name}</h2>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                device.status === 'on' ? 'bg-red-100 text-red-700' :
                device.status === 'standby' ? 'bg-orange-100 text-orange-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {device.status === 'on' ? 'Ein' : 
                 device.status === 'standby' ? 'Standby' : 'Aus'}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Details schließen"
            >
              <Icons.X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {/* Device Icon and Status */}
          <div className="flex items-center space-x-4 mb-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              device.status === 'on' ? 'bg-red-600 text-white' :
              device.status === 'standby' ? 'bg-orange-100 text-orange-600' :
              'bg-gray-200 text-gray-600'
            }`}>
              <IconComponent size={32} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{device.name}</h3>
              <p className="text-gray-600">{device.description}</p>
            </div>
          </div>

          {/* Energy Chart Placeholder */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Energieverbrauch</h4>
            <DeviceChart device={device} />
          </div>

          {/* Device Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
              <div className="text-2xl font-bold text-red-600">
                {device.status === 'on' ? device.wattage : 
                 device.status === 'standby' ? device.standbyWattage : 0}W
              </div>
              <div className="text-sm text-gray-600">Verbrauch/Stunde</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <div className="text-2xl font-bold text-blue-600">
                {device.costPerHour.toFixed(2)} CHF
              </div>
              <div className="text-sm text-gray-600">Kosten/Stunde</div>
            </div>
            <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
              <div className="text-2xl font-bold text-green-600">15%</div>
              <div className="text-sm text-gray-600">Einsparpotential</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
              <div className="text-2xl font-bold text-orange-600">
                {(device.costPerHour * 24 * 365).toFixed(0)} CHF
              </div>
              <div className="text-sm text-gray-600">Jährliche Kosten</div>
            </div>
          </div>

          {/* Energy Saving Tips */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Stromspartipps
            </h4>
            <div className="space-y-4">
              {device.tips
                .sort((a, b) => a.length - b.length) // Sortiere nach Länge (kurze zuerst)
                .map((tip, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icons.Lightbulb size={14} className="text-white" />
                  </div>
                  <p className="text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Categories */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Icons.Zap size={20} className="text-white" />
              </div>
              <h5 className="font-medium text-gray-900 mb-1">Energieeffiziente Nutzung</h5>
              <p className="text-sm text-gray-600">Optimiere die Geräteeinstellungen</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-2xl border border-green-100">
              <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Icons.Settings size={20} className="text-white" />
              </div>
              <h5 className="font-medium text-gray-900 mb-1">Regelmäßige Wartung</h5>
              <p className="text-sm text-gray-600">Halte deine Geräte in Top-Zustand</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Icons.ThermometerSun size={20} className="text-white" />
              </div>
              <h5 className="font-medium text-gray-900 mb-1">Optimale Temperatur</h5>
              <p className="text-sm text-gray-600">Verwende die richtige Temperatur</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};