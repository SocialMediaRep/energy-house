/*
  # Set TV to standby mode by default

  1. Changes
    - Update living-tv device status from 'off' to 'standby'
    - This makes the TV show as orange/standby when the app loads

  2. Reasoning
    - Most modern TVs are typically in standby mode when "off"
    - This provides a more realistic default state
    - Shows standby power consumption (2W)
*/

-- Update TV status to standby
UPDATE devices 
SET status = 'standby' 
WHERE id = 'living-tv';