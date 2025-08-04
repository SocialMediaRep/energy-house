/*
  # Add robot vacuum to living room

  1. New Device
    - `living-robot-vacuum` - Robot vacuum cleaner for living room
    - 30W consumption during cleaning
    - 3W standby consumption when docked
    - Cleaning category

  2. Device Tips
    - Energy saving tips for robot vacuum
    - Maintenance recommendations
    - Usage optimization
*/

-- Insert robot vacuum device
INSERT INTO devices (id, name, icon, wattage, standby_wattage, status, category, room_id, has_standby, description, cost_per_hour, energy_efficiency_rating) VALUES
('living-robot-vacuum', 'Staubsaugroboter', 'Bot', 30, 3, 'standby', 'cleaning', 'living', true,
 'Automatischer Staubsaugroboter für die tägliche Reinigung.', 0.009, 'A+');

-- Insert tips for robot vacuum
INSERT INTO device_tips (device_id, tip_text, category, priority) VALUES
('living-robot-vacuum', 'Lassen Sie den Roboter täglich zur gleichen Zeit reinigen', 'usage', 1),
('living-robot-vacuum', 'Leeren Sie den Staubbehälter regelmäßig', 'maintenance', 2),
('living-robot-vacuum', 'Reinigen Sie die Bürsten wöchentlich', 'maintenance', 3),
('living-robot-vacuum', 'Nutzen Sie den Eco-Modus für längere Akkulaufzeit', 'energy', 4),
('living-robot-vacuum', 'Räumen Sie den Boden vor der Reinigung frei', 'usage', 5),
('living-robot-vacuum', 'Platzieren Sie die Ladestation an einer gut erreichbaren Stelle', 'usage', 6);