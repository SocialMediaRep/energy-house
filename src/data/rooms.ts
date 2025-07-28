import { Room } from '../types';
import { devices } from './devices';

export const rooms: Room[] = [
  {
    id: 'bathroom',
    name: 'Badezimmer',
    devices: devices.filter(d => d.id.startsWith('bathroom-')),
    gridArea: 'bathroom'
  },
  {
    id: 'bedroom',
    name: 'Schlafzimmer',
    devices: devices.filter(d => d.id.startsWith('bedroom-')),
    gridArea: 'bedroom'
  },
  {
    id: 'living',
    name: 'Wohnzimmer',
    devices: devices.filter(d => d.id.startsWith('living-')),
    gridArea: 'living'
  },
  {
    id: 'kitchen',
    name: 'Küche',
    devices: devices.filter(d => d.id.startsWith('kitchen-')),
    gridArea: 'kitchen'
  },
  {
    id: 'garage',
    name: 'Garage',
    devices: devices.filter(d => d.id.startsWith('garage-')),
    gridArea: 'garage'
  },
  {
    id: 'basement',
    name: 'Keller',
    devices: devices.filter(d => d.id.startsWith('basement-')),
    gridArea: 'basement'
  }
];