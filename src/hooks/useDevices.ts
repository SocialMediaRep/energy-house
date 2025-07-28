import { useState, useCallback, useEffect } from 'react';
import { Device } from '../types';
import { supabase } from '../lib/supabase';

export const useDevices = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load devices from Supabase
  const loadDevices = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .order('room_id', { ascending: true });

      if (error) throw error;

      // Transform database data to match Device interface
      const transformedDevices: Device[] = data.map(device => ({
        id: device.id,
        name: device.name,
        icon: device.icon,
        wattage: device.wattage,
        standbyWattage: device.standby_wattage,
        status: device.status,
        category: device.category,
        tips: device.tips,
        description: device.description,
        costPerHour: device.cost_per_hour,
        energyEfficiencyRating: device.energy_efficiency_rating,
        hasStandby: device.has_standby
      }));

      setDevices(transformedDevices);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load devices');
      console.error('Error loading devices:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load devices on mount
  useEffect(() => {
    loadDevices();
  }, [loadDevices]);

  const toggleDevice = useCallback((deviceId: string) => {
    setDevices(prev => {
      const updatedDevices = prev.map(device => {
        if (device.id === deviceId) {
          const newStatus = device.hasStandby 
            ? (device.status === 'off' ? 'standby' : device.status === 'standby' ? 'on' : 'off')
            : (device.status === 'off' ? 'on' : 'off');
          
          // Update in database
          supabase
            .from('devices')
            .update({ status: newStatus })
            .eq('id', deviceId)
            .then(({ error }) => {
              if (error) {
                console.error('Error updating device status:', error);
              }
            });
          
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

  return {
    devices,
    loading,
    error,
    loadDevices,
    toggleDevice,
    getCurrentConsumption,
    getStandbyConsumption,
    getActiveConsumption
  };
};