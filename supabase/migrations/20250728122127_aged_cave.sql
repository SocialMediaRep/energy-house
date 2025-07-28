/*
  # Add global lights device

  1. New Device
    - `global-lights` - Global lighting control for all rooms
    - 300W total consumption for all rooms
    - Appears in every room

  2. Device Tips
    - Energy saving tips for lighting
    - LED usage recommendations
    - Smart lighting practices
*/

-- Insert global lights device
INSERT INTO devices (id, name, icon, wattage, standby_wattage, status, category, room_id, has_standby, description, cost_per_hour, energy_efficiency_rating) VALUES
('global-lights', 'Beleuchtung (Alle Räume)', 'Lightbulb', 300, 0, 'off', 'lighting', 'global', false,
 'Zentrale Lichtsteuerung für alle Räume im Haus.', 0.09, 'A+');

-- Insert tips for global lights
INSERT INTO device_tips (device_id, tip_text, category, priority) VALUES
('global-lights', 'Nutzen Sie LED-Lampen für 80% weniger Verbrauch', 'energy', 1),
('global-lights', 'Schalten Sie Licht nur bei Bedarf ein', 'power', 2),
('global-lights', 'Nutzen Sie Tageslicht so lange wie möglich', 'usage', 3),
('global-lights', 'Verwenden Sie Bewegungsmelder in wenig genutzten Bereichen', 'usage', 4),
('global-lights', 'Dimmen Sie das Licht am Abend für Energieeinsparung', 'energy', 5);