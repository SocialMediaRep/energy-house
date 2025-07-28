import { Device } from '../types';

export const devices: Device[] = [
  // Badezimmer
  {
    id: 'bathroom-hairdryer',
    name: 'Haartrockner',
    icon: 'Wind',
    wattage: 1800,
    standbyWattage: 0,
    status: 'off',
    category: 'personal-care',
    hasStandby: false,
    tips: [
      'Nutzen Sie den Haartrockner nur bei Bedarf',
      'Verwenden Sie die niedrigste Temperaturstufe',
      'Trocknen Sie Ihre Haare vorher mit einem Handtuch'
    ],
    description: 'Haartrockner verbrauchen viel Energie während des Betriebs.',
    costPerHour: 0.54,
    energyEfficiencyRating: 'C'
  },
  {
    id: 'bathroom-shower',
    name: 'Dusche/Bad',
    icon: 'Droplets',
    wattage: 3000,
    standbyWattage: 0,
    status: 'off',
    category: 'heating',
    hasStandby: false,
    tips: [
      'Kürzen Sie die Duschzeit',
      'Nutzen Sie eine wassersparende Duschbrause',
      'Duschen Sie bei niedrigerer Temperatur'
    ],
    description: 'Warmwasser für Dusche und Bad verbraucht viel Energie.',
    costPerHour: 0.90,
    energyEfficiencyRating: 'D'
  },
  {
    id: 'bathroom-ventilation',
    name: 'Föhn',
    icon: 'Fan',
    wattage: 25,
    standbyWattage: 0,
    status: 'off',
    category: 'ventilation',
    hasStandby: false,
    tips: [
      'Schalten Sie den Ventilator nach dem Duschen ein',
      'Lassen Sie ihn nur 15-30 Minuten laufen',
      'Reinigen Sie die Filter regelmäßig'
    ],
    description: 'Badezimmerventilator für Luftzirkulation.',
    costPerHour: 0.008,
    energyEfficiencyRating: 'A'
  },
  // Schlafzimmer
  {
    id: 'bedroom-fan',
    name: 'Ventilator',
    icon: 'Fan',
    wattage: 45,
    standbyWattage: 0,
    status: 'off',
    category: 'comfort',
    hasStandby: false,
    tips: [
      'Nutzen Sie den Ventilator statt der Klimaanlage',
      'Stellen Sie eine niedrige Geschwindigkeit ein',
      'Schalten Sie ihn aus, wenn Sie den Raum verlassen'
    ],
    description: 'Deckenventilator für Luftzirkulation im Schlafzimmer.',
    costPerHour: 0.014,
    energyEfficiencyRating: 'A'
  },
  {
    id: 'bedroom-humidifier',
    name: 'Luftbefeuchter',
    icon: 'Droplets',
    wattage: 30,
    standbyWattage: 0,
    status: 'off',
    category: 'comfort',
    hasStandby: false,
    tips: [
      'Verwenden Sie destilliertes Wasser',
      'Reinigen Sie das Gerät regelmäßig',
      'Stellen Sie die optimale Luftfeuchtigkeit ein (40-60%)'
    ],
    description: 'Luftbefeuchter für bessere Luftqualität.',
    costPerHour: 0.009,
    energyEfficiencyRating: 'A'
  },
  {
    id: 'bedroom-smartphone',
    name: 'Smartphone',
    icon: 'Smartphone',
    wattage: 5,
    standbyWattage: 0,
    status: 'off',
    category: 'electronics',
    hasStandby: false,
    tips: [
      'Laden Sie das Smartphone nur bei Bedarf',
      'Nutzen Sie den Energiesparmodus',
      'Ziehen Sie das Ladekabel nach dem Laden ab'
    ],
    description: 'Smartphone-Ladegerät.',
    costPerHour: 0.002,
    energyEfficiencyRating: 'A+'
  },
  {
    id: 'bedroom-pc',
    name: 'PC',
    icon: 'Monitor',
    wattage: 200,
    standbyWattage: 10,
    status: 'off',
    category: 'electronics',
    hasStandby: true,
    tips: [
      'Nutzen Sie den Energiesparmodus',
      'Schalten Sie den PC komplett aus',
      'Verwenden Sie eine schaltbare Steckdosenleiste'
    ],
    description: 'Desktop-Computer im Schlafzimmer.',
    costPerHour: 0.060,
    energyEfficiencyRating: 'B'
  },
  // Wohnzimmer
  {
    id: 'living-tv',
    name: 'Fernseher',
    icon: 'Tv',
    wattage: 120,
    standbyWattage: 2,
    status: 'off',
    category: 'entertainment',
    hasStandby: true,
    tips: [
      'Schalten Sie den Fernseher komplett aus',
      'Nutzen Sie den Energiesparmodus',
      'Reduzieren Sie die Helligkeit'
    ],
    description: 'LED-Fernseher für Entertainment.',
    costPerHour: 0.036,
    energyEfficiencyRating: 'A'
  },
  {
    id: 'living-soundbar',
    name: 'Soundanlage',
    icon: 'Speaker',
    wattage: 50,
    standbyWattage: 0,
    status: 'off',
    category: 'entertainment',
    hasStandby: false,
    tips: [
      'Schalten Sie die Soundanlage nur bei Bedarf ein',
      'Nutzen Sie Bluetooth statt ständiger Verbindung',
      'Reduzieren Sie die Lautstärke'
    ],
    description: 'Soundbar für bessere Audioqualität.',
    costPerHour: 0.015,
    energyEfficiencyRating: 'A'
  },
  {
    id: 'living-console',
    name: 'Videokonsole',
    icon: 'Gamepad2',
    wattage: 150,
    standbyWattage: 0,
    status: 'off',
    category: 'entertainment',
    hasStandby: false,
    tips: [
      'Schalten Sie die Konsole nach dem Spielen aus',
      'Nutzen Sie den Energiesparmodus',
      'Laden Sie Controller nur bei Bedarf'
    ],
    description: 'Spielkonsole für Gaming.',
    costPerHour: 0.045,
    energyEfficiencyRating: 'B'
  },
  {
    id: 'living-router',
    name: 'Spielkonsole',
    icon: 'Router',
    wattage: 12,
    standbyWattage: 0,
    status: 'standby',
    category: 'network',
    hasStandby: true,
    tips: [
      'Platzieren Sie den Router zentral',
      'Aktualisieren Sie die Firmware regelmäßig',
      'Schalten Sie WLAN nachts aus'
    ],
    description: 'WLAN-Router für Internetverbindung.',
    costPerHour: 0.004,
    energyEfficiencyRating: 'A+'
  },
  // Küche
  {
    id: 'kitchen-microwave',
    name: 'Mikrowelle',
    icon: 'Microwave',
    wattage: 800,
    standbyWattage: 0,
    status: 'off',
    category: 'cooking',
    hasStandby: false,
    tips: [
      'Nutzen Sie die Mikrowelle für kleine Portionen',
      'Verwenden Sie mikrowellengeeignete Behälter',
      'Decken Sie Speisen ab'
    ],
    description: 'Mikrowelle zum Erwärmen von Speisen.',
    costPerHour: 0.24,
    energyEfficiencyRating: 'B'
  },
  {
    id: 'kitchen-fridge',
    name: 'Kühlschrank',
    icon: 'Refrigerator',
    wattage: 150,
    standbyWattage: 0,
    status: 'on',
    category: 'cooling',
    hasStandby: false,
    tips: [
      'Stellen Sie die optimale Temperatur ein (7°C)',
      'Öffnen Sie die Tür nur kurz',
      'Lassen Sie warme Speisen abkühlen'
    ],
    description: 'Kühlschrank zur Lebensmittelaufbewahrung.',
    costPerHour: 0.045,
    energyEfficiencyRating: 'A+'
  },
  {
    id: 'kitchen-oven',
    name: 'Herd/Ofen',
    icon: 'ChefHat',
    wattage: 2500,
    standbyWattage: 0,
    status: 'off',
    category: 'cooking',
    hasStandby: false,
    tips: [
      'Nutzen Sie die Restwärme',
      'Verwenden Sie passende Topfgrößen',
      'Heizen Sie nicht vor, wenn möglich'
    ],
    description: 'Elektrischer Herd mit Backofen.',
    costPerHour: 0.75,
    energyEfficiencyRating: 'A'
  },
  {
    id: 'kitchen-dishwasher',
    name: 'Spülmaschine',
    icon: 'Waves',
    wattage: 1200,
    standbyWattage: 0,
    status: 'off',
    category: 'cleaning',
    hasStandby: false,
    tips: [
      'Nutzen Sie das Eco-Programm',
      'Beladen Sie die Maschine voll',
      'Verzichten Sie auf Vorspülen'
    ],
    description: 'Geschirrspüler für automatische Reinigung.',
    costPerHour: 0.36,
    energyEfficiencyRating: 'A+'
  },
  // Garage
  {
    id: 'garage-ebike',
    name: 'E-Bike',
    icon: 'Bike',
    wattage: 200,
    standbyWattage: 0,
    status: 'off',
    category: 'mobility',
    hasStandby: false,
    tips: [
      'Laden Sie das E-Bike nur bei Bedarf',
      'Bewahren Sie den Akku bei Raumtemperatur auf',
      'Nutzen Sie das E-Bike statt des Autos'
    ],
    description: 'Elektrofahrrad-Ladestation.',
    costPerHour: 0.06,
    energyEfficiencyRating: 'A'
  },
  {
    id: 'garage-scooter',
    name: 'E-Scooter',
    icon: 'Scooter',
    wattage: 100,
    standbyWattage: 0,
    status: 'off',
    category: 'mobility',
    hasStandby: false,
    tips: [
      'Laden Sie den E-Scooter vollständig auf',
      'Vermeiden Sie Überladung',
      'Nutzen Sie ihn für kurze Strecken'
    ],
    description: 'Elektro-Scooter für kurze Strecken.',
    costPerHour: 0.03,
    energyEfficiencyRating: 'A'
  },
  {
    id: 'garage-car',
    name: 'E-Auto',
    icon: 'Car',
    wattage: 7000,
    standbyWattage: 0,
    status: 'off',
    category: 'mobility',
    hasStandby: false,
    tips: [
      'Laden Sie über Nacht mit günstigen Tarifen',
      'Nutzen Sie Solarstrom zum Laden',
      'Planen Sie Ihre Fahrten effizient'
    ],
    description: 'Elektroauto-Ladestation.',
    costPerHour: 2.10,
    energyEfficiencyRating: 'A+'
  },
  // Keller
  {
    id: 'basement-washer',
    name: 'Waschmaschine',
    icon: 'WashingMachine',
    wattage: 2000,
    standbyWattage: 0,
    status: 'off',
    category: 'cleaning',
    hasStandby: false,
    tips: [
      'Nutzen Sie das Eco-Programm',
      'Waschen Sie bei niedrigeren Temperaturen',
      'Beladen Sie die Maschine voll'
    ],
    description: 'Waschmaschine für Kleidung.',
    costPerHour: 0.60,
    energyEfficiencyRating: 'A'
  },
  {
    id: 'basement-dryer',
    name: 'Tumbler',
    icon: 'TumbleDryer',
    wattage: 2500,
    standbyWattage: 0,
    status: 'off',
    category: 'cleaning',
    hasStandby: false,
    tips: [
      'Nutzen Sie den Wäschetrockner sparsam',
      'Reinigen Sie das Flusensieb regelmäßig',
      'Trocknen Sie Wäsche an der Luft, wenn möglich'
    ],
    description: 'Wäschetrockner für schnelle Trocknung.',
    costPerHour: 0.75,
    energyEfficiencyRating: 'A'
  },
  {
    id: 'basement-boiler',
    name: 'Boiler',
    icon: 'Flame',
    wattage: 3000,
    standbyWattage: 0,
    status: 'on',
    category: 'heating',
    hasStandby: false,
    tips: [
      'Stellen Sie die Temperatur auf 60°C',
      'Isolieren Sie die Warmwasserleitungen',
      'Entkalken Sie den Boiler regelmäßig'
    ],
    description: 'Warmwasserboiler für Heizung.',
    costPerHour: 0.90,
    energyEfficiencyRating: 'B'
  },
  {
    id: 'basement-freezer',
    name: 'Gefrierschrank',
    icon: 'Snowflake',
    wattage: 200,
    standbyWattage: 0,
    status: 'off',
    category: 'cooling',
    hasStandby: false,
    tips: [
      'Stellen Sie die Temperatur auf -18°C',
      'Tauen Sie das Gerät regelmäßig ab',
      'Halten Sie das Gerät voll für bessere Effizienz'
    ],
    description: 'Gefrierschrank für Tiefkühlkost.',
    costPerHour: 0.06,
    energyEfficiencyRating: 'A+'
  }
];