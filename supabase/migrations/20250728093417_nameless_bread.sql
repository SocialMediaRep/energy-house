/*
  # Create devices table for smart home energy monitor

  1. New Tables
    - `devices`
      - `id` (text, primary key) - Device identifier
      - `name` (text) - Device name
      - `icon` (text) - Lucide icon name
      - `wattage` (integer) - Power consumption in watts
      - `standby_wattage` (integer) - Standby power consumption
      - `status` (text) - Current status: 'off', 'standby', 'on'
      - `category` (text) - Device category
      - `room_id` (text) - Room identifier
      - `has_standby` (boolean) - Whether device has standby mode
      - `tips` (text array) - Energy saving tips
      - `description` (text) - Device description
      - `cost_per_hour` (decimal) - Cost per hour in CHF
      - `energy_efficiency_rating` (text) - Energy efficiency rating
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `devices` table
    - Add policy for public read access (for demo purposes)
    - Add policy for authenticated users to modify data
*/

CREATE TABLE IF NOT EXISTS devices (
  id text PRIMARY KEY,
  name text NOT NULL,
  icon text NOT NULL,
  wattage integer NOT NULL DEFAULT 0,
  standby_wattage integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'off' CHECK (status IN ('off', 'standby', 'on')),
  category text NOT NULL,
  room_id text NOT NULL,
  has_standby boolean NOT NULL DEFAULT false,
  tips text[] DEFAULT '{}',
  description text DEFAULT '',
  cost_per_hour decimal(10,4) NOT NULL DEFAULT 0.0000,
  energy_efficiency_rating text DEFAULT 'A',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

-- Allow public read access for demo purposes
CREATE POLICY "Allow public read access to devices"
  ON devices
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to modify devices
CREATE POLICY "Allow authenticated users to modify devices"
  ON devices
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_devices_updated_at
  BEFORE UPDATE ON devices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert existing devices data
INSERT INTO devices (id, name, icon, wattage, standby_wattage, status, category, room_id, has_standby, tips, description, cost_per_hour, energy_efficiency_rating) VALUES
-- Badezimmer
('bathroom-hairdryer', 'Haartrockner', 'Wind', 1800, 0, 'off', 'personal-care', 'bathroom', false, 
 ARRAY['Nutzen Sie den Haartrockner nur bei Bedarf', 'Verwenden Sie die niedrigste Temperaturstufe', 'Trocknen Sie Ihre Haare vorher mit einem Handtuch'], 
 'Haartrockner verbrauchen viel Energie während des Betriebs.', 0.54, 'C'),

('bathroom-shower', 'Dusche/Bad', 'Droplets', 3000, 0, 'off', 'heating', 'bathroom', false,
 ARRAY['Kürzen Sie die Duschzeit', 'Nutzen Sie eine wassersparende Duschbrause', 'Duschen Sie bei niedrigerer Temperatur'],
 'Warmwasser für Dusche und Bad verbraucht viel Energie.', 0.90, 'D'),

('bathroom-ventilation', 'Föhn', 'Fan', 25, 0, 'off', 'ventilation', 'bathroom', false,
 ARRAY['Schalten Sie den Ventilator nach dem Duschen ein', 'Lassen Sie ihn nur 15-30 Minuten laufen', 'Reinigen Sie die Filter regelmäßig'],
 'Badezimmerventilator für Luftzirkulation.', 0.008, 'A'),

-- Schlafzimmer
('bedroom-fan', 'Ventilator', 'Fan', 45, 0, 'off', 'comfort', 'bedroom', false,
 ARRAY['Nutzen Sie den Ventilator statt der Klimaanlage', 'Stellen Sie eine niedrige Geschwindigkeit ein', 'Schalten Sie ihn aus, wenn Sie den Raum verlassen'],
 'Deckenventilator für Luftzirkulation im Schlafzimmer.', 0.014, 'A'),

('bedroom-humidifier', 'Luftbefeuchter', 'Droplets', 30, 0, 'off', 'comfort', 'bedroom', false,
 ARRAY['Verwenden Sie destilliertes Wasser', 'Reinigen Sie das Gerät regelmäßig', 'Stellen Sie die optimale Luftfeuchtigkeit ein (40-60%)'],
 'Luftbefeuchter für bessere Luftqualität.', 0.009, 'A'),

('bedroom-smartphone', 'Smartphone', 'Smartphone', 5, 0, 'off', 'electronics', 'bedroom', false,
 ARRAY['Laden Sie das Smartphone nur bei Bedarf', 'Nutzen Sie den Energiesparmodus', 'Ziehen Sie das Ladekabel nach dem Laden ab'],
 'Smartphone-Ladegerät.', 0.002, 'A+'),

('bedroom-pc', 'PC', 'Monitor', 200, 10, 'off', 'electronics', 'bedroom', true,
 ARRAY['Nutzen Sie den Energiesparmodus', 'Schalten Sie den PC komplett aus', 'Verwenden Sie eine schaltbare Steckdosenleiste'],
 'Desktop-Computer im Schlafzimmer.', 0.060, 'B'),

-- Wohnzimmer
('living-tv', 'Fernseher', 'Tv', 120, 2, 'off', 'entertainment', 'living', true,
 ARRAY['Schalten Sie den Fernseher komplett aus', 'Nutzen Sie den Energiesparmodus', 'Reduzieren Sie die Helligkeit'],
 'LED-Fernseher für Entertainment.', 0.036, 'A'),

('living-soundbar', 'Soundanlage', 'Speaker', 50, 0, 'off', 'entertainment', 'living', false,
 ARRAY['Schalten Sie die Soundanlage nur bei Bedarf ein', 'Nutzen Sie Bluetooth statt ständiger Verbindung', 'Reduzieren Sie die Lautstärke'],
 'Soundbar für bessere Audioqualität.', 0.015, 'A'),

('living-console', 'Videokonsole', 'Gamepad2', 150, 0, 'off', 'entertainment', 'living', false,
 ARRAY['Schalten Sie die Konsole nach dem Spielen aus', 'Nutzen Sie den Energiesparmodus', 'Laden Sie Controller nur bei Bedarf'],
 'Spielkonsole für Gaming.', 0.045, 'B'),

('living-router', 'Router', 'Router', 12, 0, 'on', 'network', 'living', true,
 ARRAY['Platzieren Sie den Router zentral', 'Aktualisieren Sie die Firmware regelmäßig', 'Schalten Sie WLAN nachts aus'],
 'WLAN-Router für Internetverbindung.', 0.004, 'A+'),

-- Küche
('kitchen-microwave', 'Mikrowelle', 'Microwave', 800, 0, 'off', 'cooking', 'kitchen', false,
 ARRAY['Nutzen Sie die Mikrowelle für kleine Portionen', 'Verwenden Sie mikrowellengeeignete Behälter', 'Decken Sie Speisen ab'],
 'Mikrowelle zum Erwärmen von Speisen.', 0.24, 'B'),

('kitchen-fridge', 'Kühlschrank', 'Refrigerator', 150, 0, 'on', 'cooling', 'kitchen', false,
 ARRAY['Stellen Sie die optimale Temperatur ein (7°C)', 'Öffnen Sie die Tür nur kurz', 'Lassen Sie warme Speisen abkühlen'],
 'Kühlschrank zur Lebensmittelaufbewahrung.', 0.045, 'A+'),

('kitchen-oven', 'Herd/Ofen', 'ChefHat', 2500, 0, 'off', 'cooking', 'kitchen', false,
 ARRAY['Nutzen Sie die Restwärme', 'Verwenden Sie passende Topfgrößen', 'Heizen Sie nicht vor, wenn möglich'],
 'Elektrischer Herd mit Backofen.', 0.75, 'A'),

('kitchen-dishwasher', 'Spülmaschine', 'Waves', 1200, 0, 'off', 'cleaning', 'kitchen', false,
 ARRAY['Nutzen Sie das Eco-Programm', 'Beladen Sie die Maschine voll', 'Verzichten Sie auf Vorspülen'],
 'Geschirrspüler für automatische Reinigung.', 0.36, 'A+'),

-- Garage
('garage-ebike', 'E-Bike', 'Bike', 200, 0, 'off', 'mobility', 'garage', false,
 ARRAY['Laden Sie das E-Bike nur bei Bedarf', 'Bewahren Sie den Akku bei Raumtemperatur auf', 'Nutzen Sie das E-Bike statt des Autos'],
 'Elektrofahrrad-Ladestation.', 0.06, 'A'),

('garage-scooter', 'E-Scooter', 'Scooter', 100, 0, 'off', 'mobility', 'garage', false,
 ARRAY['Laden Sie den E-Scooter vollständig auf', 'Vermeiden Sie Überladung', 'Nutzen Sie ihn für kurze Strecken'],
 'Elektro-Scooter für kurze Strecken.', 0.03, 'A'),

('garage-car', 'E-Auto', 'Car', 7000, 0, 'off', 'mobility', 'garage', false,
 ARRAY['Laden Sie über Nacht mit günstigen Tarifen', 'Nutzen Sie Solarstrom zum Laden', 'Planen Sie Ihre Fahrten effizient'],
 'Elektroauto-Ladestation.', 2.10, 'A+'),

-- Keller
('basement-washer', 'Waschmaschine', 'WashingMachine', 2000, 0, 'off', 'cleaning', 'basement', false,
 ARRAY['Nutzen Sie das Eco-Programm', 'Waschen Sie bei niedrigeren Temperaturen', 'Beladen Sie die Maschine voll'],
 'Waschmaschine für Kleidung.', 0.60, 'A'),

('basement-dryer', 'Tumbler', 'TumbleDryer', 2500, 0, 'off', 'cleaning', 'basement', false,
 ARRAY['Nutzen Sie den Wäschetrockner sparsam', 'Reinigen Sie das Flusensieb regelmäßig', 'Trocknen Sie Wäsche an der Luft, wenn möglich'],
 'Wäschetrockner für schnelle Trocknung.', 0.75, 'A'),

('basement-boiler', 'Boiler', 'Flame', 3000, 0, 'on', 'heating', 'basement', false,
 ARRAY['Stellen Sie die Temperatur auf 60°C', 'Isolieren Sie die Warmwasserleitungen', 'Entkalken Sie den Boiler regelmäßig'],
 'Warmwasserboiler für Heizung.', 0.90, 'B'),

('basement-freezer', 'Gefrierschrank', 'Snowflake', 200, 0, 'off', 'cooling', 'basement', false,
 ARRAY['Stellen Sie die Temperatur auf -18°C', 'Tauen Sie das Gerät regelmäßig ab', 'Halten Sie das Gerät voll für bessere Effizienz'],
 'Gefrierschrank für Tiefkühlkost.', 0.06, 'A+');