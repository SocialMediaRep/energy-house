export interface Device {
  id: string;
  name: string;
  icon: string;
  wattage: number;
  standbyWattage: number;
  status: 'off' | 'standby' | 'on';
  category: string;
  tips: string[];
  description: string;
  costPerHour: number;
  energyEfficiencyRating: string;
  hasStandby: boolean;
}

export interface Room {
  id: string;
  name: string;
  devices: Device[];
  gridArea: string;
}
