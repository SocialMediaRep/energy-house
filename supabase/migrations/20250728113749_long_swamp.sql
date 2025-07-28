/*
  # Complete Smart Home Energy Monitor Database Schema

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
      - `description` (text) - Device description
      - `cost_per_hour` (decimal) - Cost per hour in CHF
      - `energy_efficiency_rating` (text) - Energy efficiency rating
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `device_tips`
      - `id` (uuid, primary key)
      - `device_id` (text, foreign key to devices.id)
      - `tip_text` (text) - The actual tip content
      - `category` (text) - Tip category (energy, maintenance, usage, power, temperature)
      - `priority` (integer) - Display order (1 = highest priority)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read and authenticated write access

  3. Sample Data
    - Insert all devices for all rooms
    - Insert categorized tips for each device
*/

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS device_tips CASCADE;
DROP TABLE IF EXISTS devices CASCADE;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create devices table
CREATE TABLE devices (
  id text PRIMARY KEY,
  name text NOT NULL,
  icon text NOT NULL,
  wattage integer NOT NULL DEFAULT 0,
  standby_wattage integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'off' CHECK (status IN ('off', 'standby', 'on')),
  category text NOT NULL,
  room_id text NOT NULL,
  has_standby boolean NOT NULL DEFAULT false,
  description text DEFAULT '',
  cost_per_hour decimal(10,4) NOT NULL DEFAULT 0.0000,
  energy_efficiency_rating text DEFAULT 'A',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create device_tips table
CREATE TABLE device_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  tip_text text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  priority integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_tips ENABLE ROW LEVEL SECURITY;

-- Create policies for devices table
CREATE POLICY "Allow public read access to devices"
  ON devices
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to modify devices"
  ON devices
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for device_tips table
CREATE POLICY "Allow public read access to device_tips"
  ON device_tips
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to modify device_tips"
  ON device_tips
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create triggers for updated_at
CREATE TRIGGER update_devices_updated_at
  BEFORE UPDATE ON devices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_device_tips_updated_at
  BEFORE UPDATE ON device_tips
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_devices_room_id ON devices(room_id);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_devices_category ON devices(category);

CREATE INDEX idx_device_tips_device_id ON device_tips(device_id);
CREATE INDEX idx_device_tips_priority ON device_tips(device_id, priority);
CREATE INDEX idx_device_tips_category ON device_tips(category);

-- Insert all devices
INSERT INTO devices (id, name, icon, wattage, standby_wattage, status, category, room_id, has_standby, description, cost_per_hour, energy_efficiency_rating) VALUES
-- Badezimmer
('bathroom-hairdryer', 'Haartrockner', 'Wind', 1800, 0, 'off', 'personal-care', 'bathroom', false, 
 'Haartrockner verbrauchen viel Energie während des Betriebs.', 0.54, 'C'),
('bathroom-shower', 'Dusche/Bad', 'Droplets', 3000, 0, 'off', 'heating', 'bathroom', false,
 'Warmwasser für Dusche und Bad verbraucht viel Energie.', 0.90, 'D'),
('bathroom-ventilation', 'Badlüfter', 'Fan', 25, 0, 'off', 'ventilation', 'bathroom', false,
 'Badezimmerventilator für Luftzirkulation.', 0.008, 'A'),
('bathroom-toothbrush', 'Elektrische Zahnbürste', 'Zap', 3, 0, 'off', 'personal-care', 'bathroom', false,
 'Elektrische Zahnbürste für die tägliche Zahnpflege.', 0.001, 'A+'),
('bathroom-straightener', 'Glätteisen', 'Flame', 45, 0, 'off', 'personal-care', 'bathroom', false,
 'Glätteisen für das Styling der Haare.', 0.014, 'B'),
('bathroom-curler', 'Lockenstab', 'Flame', 35, 0, 'off', 'personal-care', 'bathroom', false,
 'Lockenstab für das Styling der Haare.', 0.011, 'B'),

-- Schlafzimmer
('bedroom-fan', 'Ventilator', 'Fan', 45, 0, 'off', 'comfort', 'bedroom', false,
 'Deckenventilator für Luftzirkulation im Schlafzimmer.', 0.014, 'A'),
('bedroom-humidifier', 'Luftbefeuchter', 'Droplets', 30, 0, 'off', 'comfort', 'bedroom', false,
 'Luftbefeuchter für bessere Luftqualität.', 0.009, 'A'),
('bedroom-smartphone', 'Smartphone', 'Smartphone', 5, 0, 'off', 'electronics', 'bedroom', false,
 'Smartphone-Ladegerät.', 0.002, 'A+'),
('bedroom-pc', 'PC', 'Monitor', 200, 10, 'off', 'electronics', 'bedroom', true,
 'Desktop-Computer im Schlafzimmer.', 0.060, 'B'),

-- Wohnzimmer
('living-tv', 'Fernseher', 'Tv', 120, 2, 'off', 'entertainment', 'living', true,
 'LED-Fernseher für Entertainment.', 0.036, 'A'),
('living-soundbar', 'Soundanlage', 'Speaker', 50, 0, 'off', 'entertainment', 'living', false,
 'Soundbar für bessere Audioqualität.', 0.015, 'A'),
('living-console', 'Videokonsole', 'Gamepad2', 150, 0, 'off', 'entertainment', 'living', false,
 'Spielkonsole für Gaming.', 0.045, 'B'),
('living-router', 'Router', 'Router', 12, 0, 'on', 'network', 'living', true,
 'WLAN-Router für Internetverbindung.', 0.004, 'A+'),

-- Küche
('kitchen-microwave', 'Mikrowelle', 'Microwave', 800, 0, 'off', 'cooking', 'kitchen', false,
 'Mikrowelle zum Erwärmen von Speisen.', 0.24, 'B'),
('kitchen-fridge', 'Kühlschrank', 'Refrigerator', 150, 0, 'on', 'cooling', 'kitchen', false,
 'Kühlschrank zur Lebensmittelaufbewahrung.', 0.045, 'A+'),
('kitchen-oven', 'Herd/Ofen', 'ChefHat', 2500, 0, 'off', 'cooking', 'kitchen', false,
 'Elektrischer Herd mit Backofen.', 0.75, 'A'),
('kitchen-dishwasher', 'Spülmaschine', 'Waves', 1200, 0, 'off', 'cleaning', 'kitchen', false,
 'Geschirrspüler für automatische Reinigung.', 0.36, 'A+'),

-- Garage
('garage-ebike', 'E-Bike', 'Bike', 200, 0, 'off', 'mobility', 'garage', false,
 'Elektrofahrrad-Ladestation.', 0.06, 'A'),
('garage-scooter', 'E-Scooter', 'Scooter', 100, 0, 'off', 'mobility', 'garage', false,
 'Elektro-Scooter für kurze Strecken.', 0.03, 'A'),
('garage-car', 'E-Auto', 'Car', 7000, 0, 'off', 'mobility', 'garage', false,
 'Elektroauto-Ladestation.', 2.10, 'A+'),

-- Keller
('basement-washer', 'Waschmaschine', 'WashingMachine', 2000, 0, 'off', 'cleaning', 'basement', false,
 'Waschmaschine für Kleidung.', 0.60, 'A'),
('basement-dryer', 'Tumbler', 'TumbleDryer', 2500, 0, 'off', 'cleaning', 'basement', false,
 'Wäschetrockner für schnelle Trocknung.', 0.75, 'A'),
('basement-boiler', 'Boiler', 'Flame', 3000, 0, 'on', 'heating', 'basement', false,
 'Warmwasserboiler für Heizung.', 0.90, 'B'),
('basement-freezer', 'Gefrierschrank', 'Snowflake', 200, 0, 'off', 'cooling', 'basement', false,
 'Gefrierschrank für Tiefkühlkost.', 0.06, 'A+');

-- Insert device tips
INSERT INTO device_tips (device_id, tip_text, category, priority) VALUES
-- Badezimmer Tipps
('bathroom-hairdryer', 'Nutzen Sie den Haartrockner nur bei Bedarf', 'usage', 1),
('bathroom-hairdryer', 'Verwenden Sie die niedrigste Temperaturstufe', 'temperature', 2),
('bathroom-hairdryer', 'Trocknen Sie Ihre Haare vorher mit einem Handtuch', 'usage', 3),

('bathroom-shower', 'Kürzen Sie die Duschzeit auf maximal 5 Minuten', 'usage', 1),
('bathroom-shower', 'Nutzen Sie eine wassersparende Duschbrause', 'energy', 2),
('bathroom-shower', 'Duschen Sie bei niedrigerer Temperatur', 'temperature', 3),
('bathroom-shower', 'Reduzieren Sie die Wassertemperatur um 2°C', 'temperature', 4),

('bathroom-ventilation', 'Schalten Sie den Ventilator nach dem Duschen ein', 'usage', 1),
('bathroom-ventilation', 'Lassen Sie ihn nur 15-30 Minuten laufen', 'usage', 2),
('bathroom-ventilation', 'Reinigen Sie die Filter regelmäßig', 'maintenance', 3),

('bathroom-toothbrush', 'Laden Sie die Zahnbürste nur bei Bedarf', 'power', 1),
('bathroom-toothbrush', 'Verwenden Sie sie 2x täglich für 2 Minuten', 'usage', 2),
('bathroom-toothbrush', 'Lassen Sie sie nicht dauerhaft auf der Ladestation', 'power', 3),

('bathroom-straightener', 'Heizen Sie nur so lange vor wie nötig', 'energy', 1),
('bathroom-straightener', 'Verwenden Sie Hitzeschutz-Produkte', 'usage', 2),
('bathroom-straightener', 'Schalten Sie das Gerät sofort nach Gebrauch aus', 'power', 3),
('bathroom-straightener', 'Nutzen Sie die niedrigste effektive Temperatur', 'temperature', 4),

('bathroom-curler', 'Heizen Sie nur so lange vor wie nötig', 'energy', 1),
('bathroom-curler', 'Verwenden Sie Hitzeschutz-Produkte', 'usage', 2),
('bathroom-curler', 'Schalten Sie das Gerät sofort nach Gebrauch aus', 'power', 3),
('bathroom-curler', 'Nutzen Sie die niedrigste effektive Temperatur', 'temperature', 4),

-- Schlafzimmer Tipps
('bedroom-fan', 'Nutzen Sie den Ventilator statt der Klimaanlage', 'energy', 1),
('bedroom-fan', 'Stellen Sie eine niedrige Geschwindigkeit ein', 'usage', 2),
('bedroom-fan', 'Schalten Sie ihn aus, wenn Sie den Raum verlassen', 'power', 3),

('bedroom-humidifier', 'Verwenden Sie destilliertes Wasser', 'usage', 1),
('bedroom-humidifier', 'Reinigen Sie das Gerät regelmäßig', 'maintenance', 2),
('bedroom-humidifier', 'Stellen Sie die optimale Luftfeuchtigkeit ein (40-60%)', 'usage', 3),

('bedroom-smartphone', 'Laden Sie das Smartphone nur bei Bedarf', 'power', 1),
('bedroom-smartphone', 'Nutzen Sie den Energiesparmodus', 'energy', 2),
('bedroom-smartphone', 'Ziehen Sie das Ladekabel nach dem Laden ab', 'power', 3),

('bedroom-pc', 'Nutzen Sie den Energiesparmodus', 'energy', 1),
('bedroom-pc', 'Schalten Sie den PC komplett aus', 'power', 2),
('bedroom-pc', 'Verwenden Sie eine schaltbare Steckdosenleiste', 'power', 3),
('bedroom-pc', 'Aktivieren Sie den automatischen Ruhemodus nach 15 Minuten', 'power', 4),

-- Wohnzimmer Tipps
('living-tv', 'Schalten Sie den Fernseher komplett aus', 'power', 1),
('living-tv', 'Nutzen Sie den Energiesparmodus', 'energy', 2),
('living-tv', 'Reduzieren Sie die Helligkeit', 'energy', 3),
('living-tv', 'Reduzieren Sie die Bildschirmhelligkeit um 20%', 'energy', 4),
('living-tv', 'Verwenden Sie eine schaltbare Steckdosenleiste', 'power', 5),

('living-soundbar', 'Schalten Sie die Soundanlage nur bei Bedarf ein', 'power', 1),
('living-soundbar', 'Nutzen Sie Bluetooth statt ständiger Verbindung', 'usage', 2),
('living-soundbar', 'Reduzieren Sie die Lautstärke', 'usage', 3),

('living-console', 'Schalten Sie die Konsole nach dem Spielen aus', 'power', 1),
('living-console', 'Nutzen Sie den Energiesparmodus', 'energy', 2),
('living-console', 'Laden Sie Controller nur bei Bedarf', 'power', 3),
('living-console', 'Nutzen Sie die automatische Abschaltung nach Inaktivität', 'power', 4),

('living-router', 'Platzieren Sie den Router zentral', 'usage', 1),
('living-router', 'Aktualisieren Sie die Firmware regelmäßig', 'maintenance', 2),
('living-router', 'Schalten Sie WLAN nachts aus', 'power', 3),
('living-router', 'Starten Sie den Router monatlich neu für bessere Performance', 'maintenance', 4),

-- Küche Tipps
('kitchen-microwave', 'Nutzen Sie die Mikrowelle für kleine Portionen', 'usage', 1),
('kitchen-microwave', 'Verwenden Sie mikrowellengeeignete Behälter', 'usage', 2),
('kitchen-microwave', 'Decken Sie Speisen ab', 'usage', 3),
('kitchen-microwave', 'Reinigen Sie die Mikrowelle wöchentlich für optimale Effizienz', 'maintenance', 4),
('kitchen-microwave', 'Decken Sie Speisen beim Erwärmen ab', 'usage', 5),

('kitchen-fridge', 'Stellen Sie die optimale Temperatur ein (7°C)', 'temperature', 1),
('kitchen-fridge', 'Öffnen Sie die Tür nur kurz', 'usage', 2),
('kitchen-fridge', 'Lassen Sie warme Speisen abkühlen', 'usage', 3),
('kitchen-fridge', 'Halten Sie die Kühlschranktür so kurz wie möglich geöffnet', 'usage', 4),
('kitchen-fridge', 'Kontrollieren Sie die Temperatur mit einem Thermometer', 'temperature', 5),
('kitchen-fridge', 'Tauen Sie das Gefrierfach regelmäßig ab', 'maintenance', 6),

('kitchen-oven', 'Nutzen Sie die Restwärme', 'energy', 1),
('kitchen-oven', 'Verwenden Sie passende Topfgrößen', 'usage', 2),
('kitchen-oven', 'Heizen Sie nicht vor, wenn möglich', 'energy', 3),
('kitchen-oven', 'Nutzen Sie die Umluft-Funktion für niedrigere Temperaturen', 'energy', 4),

('kitchen-dishwasher', 'Nutzen Sie das Eco-Programm', 'energy', 1),
('kitchen-dishwasher', 'Beladen Sie die Maschine voll', 'usage', 2),
('kitchen-dishwasher', 'Verzichten Sie auf Vorspülen', 'usage', 3),
('kitchen-dishwasher', 'Starten Sie die Spülmaschine nur bei voller Beladung', 'usage', 4),

-- Garage Tipps
('garage-ebike', 'Laden Sie das E-Bike nur bei Bedarf', 'power', 1),
('garage-ebike', 'Bewahren Sie den Akku bei Raumtemperatur auf', 'usage', 2),
('garage-ebike', 'Nutzen Sie das E-Bike statt des Autos', 'usage', 3),

('garage-scooter', 'Laden Sie den E-Scooter vollständig auf', 'power', 1),
('garage-scooter', 'Vermeiden Sie Überladung', 'power', 2),
('garage-scooter', 'Nutzen Sie ihn für kurze Strecken', 'usage', 3),

('garage-car', 'Laden Sie über Nacht mit günstigen Tarifen', 'energy', 1),
('garage-car', 'Nutzen Sie Solarstrom zum Laden', 'energy', 2),
('garage-car', 'Planen Sie Ihre Fahrten effizient', 'usage', 3),

-- Keller Tipps
('basement-washer', 'Nutzen Sie das Eco-Programm', 'energy', 1),
('basement-washer', 'Waschen Sie bei niedrigeren Temperaturen', 'temperature', 2),
('basement-washer', 'Beladen Sie die Maschine voll', 'usage', 3),
('basement-washer', 'Waschen Sie nur mit voller Beladung', 'usage', 4),
('basement-washer', 'Nutzen Sie kaltes Wasser für leicht verschmutzte Wäsche', 'usage', 5),

('basement-dryer', 'Nutzen Sie den Wäschetrockner sparsam', 'energy', 1),
('basement-dryer', 'Reinigen Sie das Flusensieb regelmäßig', 'maintenance', 2),
('basement-dryer', 'Trocknen Sie Wäsche an der Luft, wenn möglich', 'energy', 3),
('basement-dryer', 'Entfernen Sie Flusen nach jedem Trockengang', 'maintenance', 4),

('basement-boiler', 'Stellen Sie die Temperatur auf 60°C', 'temperature', 1),
('basement-boiler', 'Isolieren Sie die Warmwasserleitungen', 'energy', 2),
('basement-boiler', 'Entkalken Sie den Boiler regelmäßig', 'maintenance', 3),
('basement-boiler', 'Senken Sie die Temperatur nachts um 5°C', 'temperature', 4),

('basement-freezer', 'Stellen Sie die Temperatur auf -18°C', 'temperature', 1),
('basement-freezer', 'Tauen Sie das Gerät regelmäßig ab', 'maintenance', 2),
('basement-freezer', 'Halten Sie das Gerät voll für bessere Effizienz', 'energy', 3);

-- Create a view for easy querying of devices with their tips
CREATE OR REPLACE VIEW devices_with_tips AS
SELECT 
  d.*,
  COALESCE(
    json_agg(
      json_build_object(
        'id', dt.id,
        'tip_text', dt.tip_text,
        'category', dt.category,
        'priority', dt.priority
      ) ORDER BY dt.priority, dt.created_at
    ) FILTER (WHERE dt.id IS NOT NULL),
    '[]'::json
  ) as tips
FROM devices d
LEFT JOIN device_tips dt ON d.id = dt.device_id
GROUP BY d.id, d.name, d.icon, d.wattage, d.standby_wattage, d.status, d.category, d.room_id, d.has_standby, d.description, d.cost_per_hour, d.energy_efficiency_rating, d.created_at, d.updated_at;

-- Grant access to the view
GRANT SELECT ON devices_with_tips TO public;
GRANT SELECT ON devices_with_tips TO authenticated;