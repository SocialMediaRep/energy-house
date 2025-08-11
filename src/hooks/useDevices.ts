import { useState, useCallback, useEffect } from 'react';
import { Device } from '../types';
import { supabase } from '../lib/supabase';

interface DeviceTip {
  id: string;
  tip_text: string;
  category: string;
  priority: number;
}

export const useDevices = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load devices from Supabase
  const loadDevices = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load devices with their tips
      const { data: devicesData, error: devicesError } = await supabase
        .from('devices')
        .select('*')
        .order('room_id', { ascending: true });

      if (devicesError) throw devicesError;

      // Load all tips
      const { data: tipsData, error: tipsError } = await supabase
        .from('device_tips')
        .select('*')
        .order('device_id, priority', { ascending: true });

      if (tipsError) throw tipsError;

      // Group tips by device_id
      const tipsByDevice = (tipsData || []).reduce((acc, tip) => {
        if (!acc[tip.device_id]) {
          acc[tip.device_id] = [];
        }
        acc[tip.device_id].push(tip.tip_text);
        return acc;
      }, {} as Record<string, string[]>);

      // Transform database data to match Device interface
      const transformedDevices: Device[] = (devicesData || []).map(device => ({
        id: device.id,
        name: device.name,
        icon: device.icon,
        wattage: device.wattage,
        standbyWattage: device.standby_wattage,
        status: device.status,
        category: device.category,
        tips: tipsByDevice[device.id] || [],
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

  const toggleDevice = useCallback((deviceId: string) => {
  // Load devices on mount
  useEffect(() => {
    loadDevices();
  }, [loadDevices]);

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
                // Revert local state on error
                loadDevices();
              }
            });
          
          return { ...device, status: newStatus };
        }
        return device;
      });
      
      return updatedDevices;
    });
  }, [loadDevices]);

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

  const toggleAllDevices = useCallback(async (targetStatus: 'on' | 'off') => {
    try {
      // Update all devices to the target status
      const updatedDevices = devices.map(device => ({
        ...device,
        status: targetStatus as 'off' | 'standby' | 'on'
      }));
      
      // Update local state immediately for responsive UI
      setDevices(updatedDevices);
      
      // Update all devices in database
      const { error } = await supabase
        .from('devices')
        .update({ status: targetStatus })
        .neq('id', 'global-lights'); // Exclude global lights from mass update
      
      if (error) {
        console.error('Error updating all devices:', error);
        // Revert on error
        loadDevices();
      }
    } catch (err) {
      console.error('Error in toggleAllDevices:', err);
      loadDevices();
    }
  }, [devices, loadDevices]);

  return {
    devices,
    loading,
    error,
    loadDevices,
    toggleDevice,
    toggleAllDevices,
    getCurrentConsumption,
    getStandbyConsumption,
    getActiveConsumption
  };
};