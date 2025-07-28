import { useState, useCallback } from 'react';
import { Device } from '../types';
import { devices as initialDevices } from '../data/devices';

export const useDevices = () => {
  const [devices, setDevices] = useState<Device[]>(initialDevices);

  const toggleDevice = useCallback((deviceId: string) => {
    setDevices(prev => 
      prev.map(device => 
        device.id === deviceId 
          ? { 
              ...device, 
              status: device.hasStandby 
                ? (device.status === 'off' ? 'standby' : device.status === 'standby' ? 'on' : 'off')
                : (device.status === 'off' ? 'on' : 'off')
            }
          : device
      )
    );
  }, []);

  const getCurrentConsumption = useCallback(() => {
    return devices.reduce((total, device) => {
      const consumption = device.status === 'on' ? device.wattage : 
                         device.status === 'standby' ? device.standbyWattage : 0;
      return total + consumption;
    }, 0);
  }, [devices]);

  const getStandbyConsumption = useCallback(() => {
    return devices.reduce((total, device) => {
      return total + (device.status === 'standby' ? device.standbyWattage : 0);
    }, 0);
  }, [devices]);

  const getActiveConsumption = useCallback(() => {
    return devices.reduce((total, device) => {
      return total + (device.status === 'on' ? device.wattage : 0);
    }, 0);
  }, [devices]);

  return {
    devices,
    toggleDevice,
    getCurrentConsumption,
    getStandbyConsumption,
    getActiveConsumption
  };
};