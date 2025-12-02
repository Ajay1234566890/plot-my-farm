-- =====================================================
-- SUPABASE REAL-TIME MAP SCHEMA
-- =====================================================

-- Update users table to include location fields
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS latitude FLOAT8;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS longitude FLOAT8;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS location_updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create index for location queries
CREATE INDEX IF NOT EXISTS idx_users_location ON public.users(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- =====================================================
-- RLS POLICIES FOR LOCATION
-- =====================================================

-- Allow users to view all other users' locations
CREATE POLICY "Users can view all user locations"
  ON public.users FOR SELECT
  USING (latitude IS NOT NULL AND longitude IS NOT NULL);

-- Allow users to update their own location
CREATE POLICY "Users can update their own location"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- REALTIME PUBLICATION
-- =====================================================

-- Enable realtime for users table (location updates)
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;

-- =====================================================
-- FUNCTION TO UPDATE LOCATION TIMESTAMP
-- =====================================================

CREATE OR REPLACE FUNCTION update_location_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.latitude IS DISTINCT FROM OLD.latitude) OR (NEW.longitude IS DISTINCT FROM OLD.longitude) THEN
    NEW.location_updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for location updates
DROP TRIGGER IF EXISTS trigger_update_location_timestamp ON public.users;
CREATE TRIGGER trigger_update_location_timestamp
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_location_timestamp();

-- =====================================================
-- SYNC EXISTING FARMERS AND BUYERS LOCATIONS
-- =====================================================

-- Update farmers locations from farmers table
UPDATE public.users u
SET 
  latitude = f.latitude,
  longitude = f.longitude,
  location_updated_at = NOW()
FROM public.farmers f
WHERE u.id = f.id AND u.role = 'farmer' AND f.latitude IS NOT NULL;

-- Update buyers locations from buyers table
UPDATE public.users u
SET 
  latitude = b.latitude,
  longitude = b.longitude,
  location_updated_at = NOW()
FROM public.buyers b
WHERE u.id = b.id AND u.role = 'buyer' AND b.latitude IS NOT NULL;

-- =====================================================
-- COMPLETE
-- =====================================================
