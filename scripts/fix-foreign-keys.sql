-- ============================================
-- FIX FOREIGN KEY CONSTRAINTS - MINIMAL VERSION
-- ============================================
-- This script only fixes the tables that currently exist in your database
-- Run this first, then we can add more tables later as needed

-- ============================================
-- FARMER CROPS TABLE (CRITICAL - FIXES THE IMMEDIATE ERROR!)
-- ============================================
ALTER TABLE farmer_crops DROP CONSTRAINT IF EXISTS farmer_crops_farmer_id_fkey;
ALTER TABLE farmer_crops ADD CONSTRAINT farmer_crops_farmer_id_fkey
  FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE;

-- ============================================
-- BUYER SAVED FARMERS TABLE (if exists)
-- ============================================
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'buyer_saved_farmers') THEN
    ALTER TABLE buyer_saved_farmers DROP CONSTRAINT IF EXISTS buyer_saved_farmers_buyer_id_fkey;
    ALTER TABLE buyer_saved_farmers ADD CONSTRAINT buyer_saved_farmers_buyer_id_fkey
      FOREIGN KEY (buyer_id) REFERENCES buyers(id) ON DELETE CASCADE;

    ALTER TABLE buyer_saved_farmers DROP CONSTRAINT IF EXISTS buyer_saved_farmers_farmer_id_fkey;
    ALTER TABLE buyer_saved_farmers ADD CONSTRAINT buyer_saved_farmers_farmer_id_fkey
      FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ============================================
-- FARMER SAVED BUYERS TABLE (if exists)
-- ============================================
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'farmer_saved_buyers') THEN
    ALTER TABLE farmer_saved_buyers DROP CONSTRAINT IF EXISTS farmer_saved_buyers_farmer_id_fkey;
    ALTER TABLE farmer_saved_buyers ADD CONSTRAINT farmer_saved_buyers_farmer_id_fkey
      FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE;

    ALTER TABLE farmer_saved_buyers DROP CONSTRAINT IF EXISTS farmer_saved_buyers_buyer_id_fkey;
    ALTER TABLE farmer_saved_buyers ADD CONSTRAINT farmer_saved_buyers_buyer_id_fkey
      FOREIGN KEY (buyer_id) REFERENCES buyers(id) ON DELETE CASCADE;
  END IF;
END $$;

