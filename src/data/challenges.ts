import { Challenge } from '../types';

export const challenges: Challenge[] = [
  {
    id: 'fridge-temp',
    title: 'Kühlschrank auf 7°C',
    description: 'Stelle deinen Kühlschrank auf die optimale Temperatur von 7°C ein',
    points: 5,
    energySaving: 0.5,
    difficulty: 'Einfach',
    category: 'Kochen',
    isCompleted: false,
    icon: 'Refrigerator'
  },
  {
    id: 'standby-off',
    title: 'Standby-Geräte ausschalten',
    description: 'Schalte alle Geräte komplett aus, statt sie im Standby zu lassen',
    points: 10,
    energySaving: 1.2,
    difficulty: 'Einfach',
    category: 'Geräte',
    isCompleted: false,
    icon: 'Power'
  },
  {
    id: 'heating-down',
    title: 'Heizung um 1°C senken',
    description: 'Reduziere die Raumtemperatur um 1 Grad für deutliche Einsparungen',
    points: 20,
    energySaving: 3,
    difficulty: 'Mittel',
    category: 'Heizung',
    isCompleted: false,
    icon: 'Thermometer'
  },
  {
    id: 'shower-time',
    title: 'Kurze Duschzeiten',
    description: 'Reduziere deine Duschzeit auf maximal 5 Minuten',
    points: 12,
    energySaving: 1.5,
    difficulty: 'Schwer',
    category: 'Waschen',
    isCompleted: false,
    icon: 'Timer'
  },
  {
    id: 'efficient-cooking',
    title: 'Effizienter kochen',
    description: 'Nutze Deckel beim Kochen und passende Topfgrößen',
    points: 6,
    energySaving: 0.4,
    difficulty: 'Einfach',
    category: 'Kochen',
    isCompleted: false,
    icon: 'ChefHat'
  },
  {
    id: 'daylight-use',
    title: 'Tageslicht nutzen',
    description: 'Nutze natürliches Licht so lange wie möglich',
    points: 7,
    energySaving: 0.6,
    difficulty: 'Einfach',
    category: 'Beleuchtung',
    isCompleted: false,
    icon: 'Sun'
  },
  {
    id: 'unplug-chargers',
    title: 'Ladegeräte ausstecken',
    description: 'Ziehe Ladegeräte aus der Steckdose wenn sie nicht gebraucht werden',
    points: 4,
    energySaving: 0.2,
    difficulty: 'Einfach',
    category: 'Geräte',
    isCompleted: false,
    icon: 'Plug'
  },
  {
    id: 'eco-wash',
    title: 'Eco-Waschmodus nutzen',
    description: 'Verwende den Eco-Modus deiner Waschmaschine',
    points: 8,
    energySaving: 0.9,
    difficulty: 'Einfach',
    category: 'Waschen',
    isCompleted: false,
    icon: 'Droplets'
  }
];