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
              <h2 className="h4">{device.name}</h2>
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
              device.status === 'on' ? 'bg-green-600 text-white' :
              device.status === 'standby' ? 'bg-orange-100 text-orange-600' :
              'bg-gray-200 text-gray-600'
            }`}>
              <IconComponent size={32} />
            </div>
            <div>
              <h3 className="h5">{device.name}</h3>
              <p className="text-body text-medium-contrast">{device.description}</p>
            </div>
          </div>

          {/* Energy Chart Placeholder */}
          <div className="mb-6">
            <h4 className="h6 mb-3">Energieverbrauch</h4>
            <DeviceChart device={device} />
          </div>

          {/* Device Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
              <div className="text-2xl font-bold text-green-600">
                {device.status === 'on' ? device.wattage : 
                 device.status === 'standby' ? device.standbyWattage : 0}W
              </div>
              <div className="text-sm text-gray-600">Aktueller Verbrauch</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <div className="text-2xl font-bold text-blue-600">
                {device.status === 'on' ? device.costPerHour.toFixed(3) : 
                 device.status === 'standby' ? (device.standbyWattage * 0.30 / 1000).toFixed(3) : '0.000'} CHF
              </div>
              <div className="text-sm text-gray-600">Kosten/Stunde</div>
            </div>
            <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
              <div className="text-2xl font-bold text-green-600">
                {device.hasStandby && device.standbyWattage > 0 ? 
                  Math.round((device.standbyWattage / device.wattage) * 100) : 
                  device.energyEfficiencyRating === 'A+' ? '20' :
                  device.energyEfficiencyRating === 'A' ? '15' :
                  device.energyEfficiencyRating === 'B' ? '10' :
                  device.energyEfficiencyRating === 'C' ? '5' : '0'}%
              </div>
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
            <h4 className="h5 mb-4">
              Stromspartipps
            </h4>
            <div className="space-y-3">
              {device.tips
                .slice(0, 3)
                .map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 bg-white">
                    <div className="w-6 h-6 bg-repower-red rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icons.Lightbulb size={14} className="text-white" />
                    </div>
                    <p className="text-body text-medium-contrast">{tip}</p>
                  </div>
                ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};