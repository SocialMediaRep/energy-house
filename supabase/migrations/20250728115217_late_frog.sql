/*
  # Split Herd/Ofen into separate Herd and Backofen devices

  1. Changes
    - Remove existing 'kitchen-oven' device (Herd/Ofen)
    - Add new 'kitchen-stove' device (Herd)
    - Add new 'kitchen-oven' device (Backofen)
    - Update device tips for both devices

  2. New Devices
    - Herd: 2000W, cooking category
    - Backofen: 2200W, cooking category
*/

-- Remove existing combined device
DELETE FROM device_tips WHERE device_id = 'kitchen-oven';
DELETE FROM devices WHERE id = 'kitchen-oven';

-- Insert new Herd device
INSERT INTO devices (id, name, icon, wattage, standby_wattage, status, category, room_id, has_standby, description, cost_per_hour, energy_efficiency_rating) VALUES
('kitchen-stove', 'Herd', 'ChefHat', 2000, 0, 'off', 'cooking', 'kitchen', false,
 'Elektrischer Herd zum Kochen.', 0.60, 'A');

-- Insert new Backofen device
INSERT INTO devices (id, name, icon, wattage, standby_wattage, status, category, room_id, has_standby, description, cost_per_hour, energy_efficiency_rating) VALUES
('kitchen-oven', 'Backofen', 'ChefHat', 2200, 0, 'off', 'cooking', 'kitchen', false,
 'Elektrischer Backofen zum Backen und Braten.', 0.66, 'A');

-- Insert tips for Herd
INSERT INTO device_tips (device_id, tip_text, category, priority) VALUES
('kitchen-stove', 'Nutzen Sie die Restwärme', 'energy', 1),
('kitchen-stove', 'Verwenden Sie passende Topfgrößen', 'usage', 2),
('kitchen-stove', 'Nutzen Sie Deckel beim Kochen', 'usage', 3);

-- Insert tips for Backofen
INSERT INTO device_tips (device_id, tip_text, category, priority) VALUES
('kitchen-oven', 'Nutzen Sie die Restwärme', 'energy', 1),
('kitchen-oven', 'Heizen Sie nicht vor, wenn möglich', 'energy', 2),
('kitchen-oven', 'Nutzen Sie die Umluft-Funktion für niedrigere Temperaturen', 'energy', 3);