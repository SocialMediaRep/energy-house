/*
  # Create tips table and refactor device tips

  1. New Tables
    - `device_tips`
      - `id` (uuid, primary key)
      - `device_id` (text, foreign key to devices.id)
      - `tip_text` (text) - The actual tip content
      - `category` (text) - Tip category (energy, maintenance, usage, etc.)
      - `priority` (integer) - Display order (1 = highest priority)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Changes
    - Remove tips array column from devices table
    - Migrate existing tips to new table structure
    - Add foreign key constraint

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

-- Create trigger for updated_at
CREATE TRIGGER update_device_tips_updated_at
  BEFORE UPDATE ON device_tips
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_device_tips_device_id ON device_tips(device_id);
CREATE INDEX IF NOT EXISTS idx_device_tips_priority ON device_tips(device_id, priority);

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
      -- Determine category based on tip content
      INSERT INTO device_tips (device_id, tip_text, category, priority)
      VALUES (
        device_record.id,
        tip_text,
        CASE 
          WHEN tip_text ILIKE '%temperatur%' OR tip_text ILIKE '%grad%' OR tip_text ILIKE '%°c%' THEN 'temperature'
          WHEN tip_text ILIKE '%energiespar%' OR tip_text ILIKE '%sparsam%' OR tip_text ILIKE '%eco%' THEN 'energy'
          WHEN tip_text ILIKE '%reinig%' OR tip_text ILIKE '%filter%' OR tip_text ILIKE '%wartung%' THEN 'maintenance'
          WHEN tip_text ILIKE '%ausschalten%' OR tip_text ILIKE '%aus%' OR tip_text ILIKE '%standby%' THEN 'power'
          WHEN tip_text ILIKE '%zeit%' OR tip_text ILIKE '%dauer%' OR tip_text ILIKE '%minuten%' THEN 'usage'
          ELSE 'general'
        END,
        tip_priority
      );
      
      tip_priority := tip_priority + 1;
    END LOOP;
  END LOOP;
END $$;

-- Remove tips column from devices table (after migration)
ALTER TABLE devices DROP COLUMN IF EXISTS tips;

-- Insert some additional categorized tips for better examples
INSERT INTO device_tips (device_id, tip_text, category, priority) VALUES
-- Energy saving tips
('living-tv', 'Reduzieren Sie die Bildschirmhelligkeit um 20%', 'energy', 4),
('kitchen-fridge', 'Halten Sie die Kühlschranktür so kurz wie möglich geöffnet', 'usage', 4),
('basement-washer', 'Waschen Sie nur mit voller Beladung', 'usage', 4),

-- Maintenance tips
('living-router', 'Starten Sie den Router monatlich neu für bessere Performance', 'maintenance', 3),
('kitchen-microwave', 'Reinigen Sie die Mikrowelle wöchentlich für optimale Effizienz', 'maintenance', 3),
('basement-dryer', 'Entfernen Sie Flusen nach jedem Trockengang', 'maintenance', 3),

-- Temperature tips
('basement-boiler', 'Senken Sie die Temperatur nachts um 5°C', 'temperature', 3),
('kitchen-fridge', 'Kontrollieren Sie die Temperatur mit einem Thermometer', 'temperature', 5),

-- Power management tips
('bedroom-pc', 'Aktivieren Sie den automatischen Ruhemodus nach 15 Minuten', 'power', 3),
('living-console', 'Nutzen Sie die automatische Abschaltung nach Inaktivität', 'power', 3)

ON CONFLICT DO NOTHING;