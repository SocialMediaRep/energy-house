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

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  energySaving: number;
  difficulty: 'Einfach' | 'Mittel' | 'Schwer';
  category: 'Geräte' | 'Heizung' | 'Beleuchtung' | 'Waschen' | 'Kochen';
  isCompleted: boolean;
  icon: string;
}