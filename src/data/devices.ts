import { Device } from '../types';

export const devices: Device[] = [
  // Badezimmer - zusätzliche Geräte
  {
    id: 'bathroom-ventilation',
    name: 'Badlüfter',
    icon: 'Fan',
    wattage: 25,
    standbyWattage: 0,
    status: 'off',
    category: 'ventilation',
    tips: [
      'Schalten Sie den Ventilator nach dem Duschen ein',
      'Lassen Sie ihn nur 15-30 Minuten laufen',
      'Reinigen Sie die Filter regelmäßig'
    ],
    description: 'Badezimmerventilator für Luftzirkulation.',
    costPerHour: 0.008,
    energyEfficiencyRating: 'A',
    hasStandby: false
  },
  {
    id: 'bathroom-toothbrush',
    name: 'Elektrische Zahnbürste',
    icon: 'Zap',
    wattage: 3,
    standbyWattage: 0,
    status: 'off',
    category: 'personal-care',
    tips: [
      'Laden Sie die Zahnbürste nur bei Bedarf',
      'Verwenden Sie sie 2x täglich für 2 Minuten',
      'Lassen Sie sie nicht dauerhaft auf der Ladestation'
    ],
    description: 'Elektrische Zahnbürste für die tägliche Zahnpflege.',
    costPerHour: 0.001,
    energyEfficiencyRating: 'A+',
    hasStandby: false
  },
  {
    id: 'bathroom-straightener',
    name: 'Glätteisen',
    icon: 'Flame',
    wattage: 45,
    standbyWattage: 0,
    status: 'off',
    category: 'personal-care',
    tips: [
      'Heizen Sie nur so lange vor wie nötig',
      'Verwenden Sie Hitzeschutz-Produkte',
      'Schalten Sie das Gerät sofort nach Gebrauch aus',
      'Nutzen Sie die niedrigste effektive Temperatur'
    ],
    description: 'Glätteisen für das Styling der Haare.',
    costPerHour: 0.014,
    energyEfficiencyRating: 'B',
    hasStandby: false
  },
  {
    id: 'bathroom-curler',
    name: 'Lockenstab',
    icon: 'Flame',
    wattage: 35,
    standbyWattage: 0,
    status: 'off',
    category: 'personal-care',
    tips: [
      'Heizen Sie nur so lange vor wie nötig',
      'Verwenden Sie Hitzeschutz-Produkte',
      'Schalten Sie das Gerät sofort nach Gebrauch aus',
      'Nutzen Sie die niedrigste effektive Temperatur'
    ],
    description: 'Lockenstab für das Styling der Haare.',
    costPerHour: 0.011,
    energyEfficiencyRating: 'B',
    hasStandby: false
  },
  // Wohnzimmer - zusätzliches Gerät
  {
    id: 'living-robot-vacuum',
    name: 'Staubsaugroboter',
    icon: 'Bot',
    wattage: 30,
    standbyWattage: 3,
    status: 'standby',
    category: 'cleaning',
    tips: [
      'Lassen Sie den Roboter täglich zur gleichen Zeit reinigen',
      'Leeren Sie den Staubbehälter regelmäßig',
      'Reinigen Sie die Bürsten wöchentlich',
      'Nutzen Sie den Eco-Modus für längere Akkulaufzeit',
      'Räumen Sie den Boden vor der Reinigung frei',
      'Platzieren Sie die Ladestation an einer gut erreichbaren Stelle'
    ],
    description: 'Automatischer Staubsaugroboter für die tägliche Reinigung.',
    costPerHour: 0.009,
    energyEfficiencyRating: 'A+',
    hasStandby: true
  },
  // Globaler Lichtschalter
  {
    id: 'global-lights',
    name: 'Beleuchtung (Alle Räume)',
    icon: 'Lightbulb',
    wattage: 300,
    standbyWattage: 0,
    status: 'off',
    category: 'lighting',
    tips: [
      'Nutzen Sie LED-Lampen für 80% weniger Verbrauch',
      'Schalten Sie Licht nur bei Bedarf ein',
      'Nutzen Sie Tageslicht so lange wie möglich',
      'Verwenden Sie Bewegungsmelder in wenig genutzten Bereichen',
      'Dimmen Sie das Licht am Abend für Energieeinsparung'
    ],
    description: 'Zentrale Lichtsteuerung für alle Räume im Haus.',
    costPerHour: 0.09,
    energyEfficiencyRating: 'A+',
    hasStandby: false
  },
  // Badezimmer
  {
    id: 'bathroom-hairdryer',
    name: 'Föhn',
    icon: 'Wind',
    wattage: 1800,
    standbyWattage: 0,
    status: 'off',
    category: 'personal-care',
    hasStandby: false,
    tips: [
      'Nutzen Sie den Föhn nur bei Bedarf',
      'Verwenden Sie die niedrigste Temperaturstufe',
      'Trocknen Sie Ihre Haare vorher mit einem Handtuch'
    ],
    description: 'Föhn verbraucht viel Energie während des Betriebs.',
    costPerHour: 0.54,
    energyEfficiencyRating: 'C'
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
    name: 'Router',
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
    id: 'kitchen-stove',
    name: 'Herd',
    icon: 'ChefHat',
    wattage: 2000,
    standbyWattage: 0,
    status: 'off',
    category: 'cooking',
    hasStandby: false,
    tips: [
      'Nutzen Sie die Restwärme',
      'Verwenden Sie passende Topfgrößen',
      'Nutzen Sie Deckel beim Kochen'
    ],
    description: 'Elektrischer Herd zum Kochen.',
    costPerHour: 0.60,
    energyEfficiencyRating: 'A'
  },
  {
    id: 'kitchen-oven',
    name: 'Backofen',
    icon: 'ChefHat',
    wattage: 2200,
    standbyWattage: 0,
    status: 'off',
    category: 'cooking',
    hasStandby: false,
    tips: [
      'Nutzen Sie die Restwärme',
      'Heizen Sie nicht vor, wenn möglich',
      'Nutzen Sie die Umluft-Funktion für niedrigere Temperaturen'
    ],
    description: 'Elektrischer Backofen zum Backen und Braten.',
    costPerHour: 0.66,
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