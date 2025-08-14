import { useState, useCallback } from 'react';
import { Device } from '../types';
import { devices as initialDevices } from '../data/devices';

export const useDevices = () => {
  const [devices, setDevices] = useState<Device[]>(initialDevices);

  const toggleDevice = useCallback((deviceId: string) => {
    setDevices(prev => {
      const updatedDevices = prev.map(device => {
        if (device.id === deviceId) {
          const newStatus = device.hasStandby 
            ? (device.status === 'off' ? 'standby' : device.status === 'standby' ? 'on' : 'off')
            : (device.status === 'off' ? 'on' : 'off');
          
          return { ...device, status: newStatus };
        }
        return device;
      });
      
      return updatedDevices;
    });
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

  const toggleAllDevices = useCallback((targetStatus: 'on' | 'off') => {
    setDevices(prev => {
      return prev.map(device => ({
        ...device,
        status: targetStatus as 'off' | 'standby' | 'on'
      }));
    });
  }, []);

  return {
    devices,
    loading: false,
    error: null,
    toggleDevice,
    toggleAllDevices,
    getCurrentConsumption,
    getStandbyConsumption,
    getActiveConsumption
  };
};