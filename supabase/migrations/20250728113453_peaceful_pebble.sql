/*
  # Create device tips table and migrate existing tips

  1. New Tables
    - `device_tips`
      - `id` (uuid, primary key)
      - `device_id` (text, foreign key to devices.id)
      - `tip_text` (text) - The actual tip content
      - `category` (text) - Tip category (energy, maintenance, usage, power, temperature)
      - `priority` (integer) - Display order (1 = highest priority)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Migration
    - Migrate existing tips from devices.tips array to new table
    - Automatically categorize tips based on content
    - Remove tips column from devices table after migration

  3. Security
    - Enable RLS on device_tips table
    - Add policies for public read and authenticated write access
*/

-- Create device_tips table
CREATE TABLE IF NOT EXISTS device_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  tip_text text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  priority integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE device_tips ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to device_tips"
  ON device_tips
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to modify tips
CREATE POLICY "Allow authenticated users to modify device_tips"
  ON device_tips
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_device_tips_updated_at
  BEFORE UPDATE ON device_tips
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_device_tips_device_id ON device_tips(device_id);
CREATE INDEX IF NOT EXISTS idx_device_tips_priority ON device_tips(device_id, priority);
CREATE INDEX IF NOT EXISTS idx_device_tips_category ON device_tips(category);

-- Migrate existing tips from devices table to device_tips table
DO $$
DECLARE
  device_record RECORD;
  tip_text TEXT;
  tip_priority INTEGER;
BEGIN
  -- Loop through all devices that have tips
  FOR device_record IN 
    SELECT id, tips FROM devices WHERE tips IS NOT NULL AND array_length(tips, 1) > 0
  LOOP
    tip_priority := 1;
    
    -- Loop through each tip for this device
    FOREACH tip_text IN ARRAY device_record.tips
    LOOP
      -- Determine category based on tip content (German keywords)
      INSERT INTO device_tips (device_id, tip_text, category, priority)
      VALUES (
        device_record.id,
        tip_text,
        CASE 
          WHEN tip_text ILIKE '%temperatur%' OR tip_text ILIKE '%grad%' OR tip_text ILIKE '%°c%' OR tip_text ILIKE '%hitze%' THEN 'temperature'
          WHEN tip_text ILIKE '%energiespar%' OR tip_text ILIKE '%sparsam%' OR tip_text ILIKE '%eco%' OR tip_text ILIKE '%effizient%' THEN 'energy'
          WHEN tip_text ILIKE '%reinig%' OR tip_text ILIKE '%filter%' OR tip_text ILIKE '%wartung%' OR tip_text ILIKE '%pflege%' THEN 'maintenance'
          WHEN tip_text ILIKE '%ausschalten%' OR tip_text ILIKE '%aus%' OR tip_text ILIKE '%standby%' OR tip_text ILIKE '%strom%' THEN 'power'
          WHEN tip_text ILIKE '%zeit%' OR tip_text ILIKE '%dauer%' OR tip_text ILIKE '%minuten%' OR tip_text ILIKE '%nutzen%' OR tip_text ILIKE '%verwenden%' THEN 'usage'
          ELSE 'general'
        END,
        tip_priority
      );
      
      tip_priority := tip_priority + 1;
    END LOOP;
  END LOOP;
END $$;

-- Insert some additional categorized tips for better examples
INSERT INTO device_tips (device_id, tip_text, category, priority) VALUES
-- Energy saving tips
('living-tv', 'Reduzieren Sie die Bildschirmhelligkeit um 20%', 'energy', 10),
('kitchen-fridge', 'Halten Sie die Kühlschranktür so kurz wie möglich geöffnet', 'usage', 10),
('basement-washer', 'Waschen Sie nur mit voller Beladung', 'usage', 10),
('kitchen-oven', 'Nutzen Sie die Umluft-Funktion für niedrigere Temperaturen', 'energy', 10),

-- Maintenance tips
('living-router', 'Starten Sie den Router monatlich neu für bessere Performance', 'maintenance', 10),
('kitchen-microwave', 'Reinigen Sie die Mikrowelle wöchentlich für optimale Effizienz', 'maintenance', 10),
('basement-dryer', 'Entfernen Sie Flusen nach jedem Trockengang', 'maintenance', 10),
('kitchen-fridge', 'Tauen Sie das Gefrierfach regelmäßig ab', 'maintenance', 10),

-- Temperature tips
('basement-boiler', 'Senken Sie die Temperatur nachts um 5°C', 'temperature', 10),
('kitchen-fridge', 'Kontrollieren Sie die Temperatur mit einem Thermometer', 'temperature', 10),
('bathroom-shower', 'Reduzieren Sie die Wassertemperatur um 2°C', 'temperature', 10),

-- Power management tips
('bedroom-pc', 'Aktivieren Sie den automatischen Ruhemodus nach 15 Minuten', 'power', 10),
('living-console', 'Nutzen Sie die automatische Abschaltung nach Inaktivität', 'power', 10),
('living-tv', 'Verwenden Sie eine schaltbare Steckdosenleiste', 'power', 10),

-- Usage tips
('kitchen-dishwasher', 'Starten Sie die Spülmaschine nur bei voller Beladung', 'usage', 10),
('basement-washer', 'Nutzen Sie kaltes Wasser für leicht verschmutzte Wäsche', 'usage', 10),
('kitchen-microwave', 'Decken Sie Speisen beim Erwärmen ab', 'usage', 10)

ON CONFLICT DO NOTHING;

-- Remove tips column from devices table (after successful migration)
-- Note: Uncomment the next line after verifying the migration worked correctly
-- ALTER TABLE devices DROP COLUMN IF EXISTS tips;

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