-- Fix for "could not find harvest-date column" error
-- Run this in your Supabase SQL Editor

ALTER TABLE farmer_offers 
ADD COLUMN IF NOT EXISTS harvest_date TIMESTAMPTZ DEFAULT NOW();

-- Also ensure the table exists (in case it wasn't created)
CREATE TABLE IF NOT EXISTS farmer_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    crop_type TEXT,
    price DECIMAL(10, 2),
    quantity DECIMAL(10, 2),
    unit TEXT,
    min_order_quantity DECIMAL(10, 2),
    image_url TEXT,
    status TEXT DEFAULT 'active',
    description TEXT,
    location TEXT,
    harvest_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE farmer_offers ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view all offers" ON farmer_offers;
CREATE POLICY "Users can view all offers" ON farmer_offers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Farmers can insert their own offers" ON farmer_offers;
CREATE POLICY "Farmers can insert their own offers" ON farmer_offers FOR INSERT WITH CHECK (auth.uid() = farmer_id);

DROP POLICY IF EXISTS "Farmers can update their own offers" ON farmer_offers;
CREATE POLICY "Farmers can update their own offers" ON farmer_offers FOR UPDATE USING (auth.uid() = farmer_id);

DROP POLICY IF EXISTS "Farmers can delete their own offers" ON farmer_offers;
CREATE POLICY "Farmers can delete their own offers" ON farmer_offers FOR DELETE USING (auth.uid() = farmer_id);
