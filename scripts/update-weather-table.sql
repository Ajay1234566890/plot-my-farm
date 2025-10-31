-- Update weather_data table to support comprehensive weather tracking
-- This script adds missing columns and updates the table structure

-- Drop existing weather_data table if it exists (to recreate with new structure)
DROP TABLE IF EXISTS weather_data CASCADE;

-- Create updated weather_data table with all necessary fields
CREATE TABLE IF NOT EXISTS weather_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  temperature DECIMAL(5, 2),
  humidity INTEGER,
  wind_speed DECIMAL(5, 2),
  weather_condition TEXT,
  weather_description TEXT,
  pressure DECIMAL(7, 2),
  visibility DECIMAL(5, 2),
  uv_index INTEGER,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_weather_data_user_id ON weather_data(user_id);
CREATE INDEX IF NOT EXISTS idx_weather_data_date ON weather_data(date);
CREATE INDEX IF NOT EXISTS idx_weather_data_location ON weather_data(location);
CREATE INDEX IF NOT EXISTS idx_weather_data_coordinates ON weather_data(latitude, longitude);

-- Enable RLS on weather_data table
ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for weather_data table
CREATE POLICY "Users can view their own weather data" ON weather_data
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weather data" ON weather_data
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weather data" ON weather_data
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weather data" ON weather_data
    FOR DELETE USING (auth.uid() = user_id);

-- Optional: Allow farmers to view weather data from their region (for agricultural insights)
CREATE POLICY "Farmers can view regional weather data" ON weather_data
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM farmers 
            WHERE farmers.id = auth.uid()
        )
    );

-- Summary of changes:
-- 1. Added user_id field to track which user the weather data belongs to
-- 2. Added weather_description field for detailed weather descriptions
-- 3. Added pressure field for atmospheric pressure
-- 4. Added visibility field for visibility distance
-- 5. Added uv_index field for UV index data
-- 6. Added date field (separate from timestamp) for easier querying
-- 7. Added proper indexes for performance
-- 8. Added RLS policies for data security
-- 9. Added special policy for farmers to view regional weather data
