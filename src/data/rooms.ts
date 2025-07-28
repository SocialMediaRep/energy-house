import { Room } from '../types';
import { devices } from './devices';

// Globale Geräte (für alle Räume)
const globalDevices = devices.filter(d => d.id.startsWith('global-'));
export const rooms: Room[] = [
  {
    id: 'bathroom',
    name: 'Badezimmer',
    devices: [...devices.filter(d => d.id.startsWith('bathroom-')), ...globalDevices],
    gridArea: 'bathroom'
  },
  {
    id: 'bedroom',
    name: 'Schlafzimmer',
    devices: [...devices.filter(d => d.id.startsWith('bedroom-')), ...globalDevices],
    gridArea: 'bedroom'
  },
  {
    id: 'living',
    name: 'Wohnzimmer',
    devices: [...devices.filter(d => d.id.startsWith('living-')), ...globalDevices],
    gridArea: 'living'
  },
  {
    id: 'kitchen',
    name: 'Küche',
    devices: [...devices.filter(d => d.id.startsWith('kitchen-')), ...globalDevices],
    gridArea: 'kitchen'
  },
  {
    id: 'garage',
    name: 'Garage',
    devices: [...devices.filter(d => d.id.startsWith('garage-')), ...globalDevices],
    gridArea: 'garage'
  },
  {
    id: 'basement',
    name: 'Keller',
    devices: [...devices.filter(d => d.id.startsWith('basement-')), ...globalDevices],
    gridArea: 'basement'
  }
];