-- Plot My Farm - Supabase Database Schema V2
-- Dedicated tables for Buyers and Farmers
-- Run this SQL in the Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('farmer', 'buyer', 'admin')),
  profile_image_url TEXT,
  bio TEXT,
  location TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Farmers table (dedicated farmer profiles - allows same phone for both roles)
CREATE TABLE IF NOT EXISTS farmers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  full_name TEXT,
  email TEXT,
  profile_image_url TEXT,
  farm_name TEXT,
  farm_size TEXT,
  bio TEXT,
  location TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3, 2) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Buyers table (dedicated buyer profiles - allows same phone for both roles)
CREATE TABLE IF NOT EXISTS buyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  full_name TEXT,
  email TEXT,
  profile_image_url TEXT,
  company_name TEXT,
  business_type TEXT,
  bio TEXT,
  location TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3, 2) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Farmer Crops table
CREATE TABLE IF NOT EXISTS farmer_crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL,
  name TEXT NOT NULL,
  crop_type TEXT NOT NULL,
  description TEXT,
  quantity DECIMAL(10, 2),
  unit TEXT DEFAULT 'kg',
  price_per_unit DECIMAL(10, 2),
  image_url TEXT,
  location TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  planting_date DATE,
  expected_harvest_date DATE,
  status TEXT CHECK (status IN ('growing', 'ready', 'harvested', 'sold')) DEFAULT 'growing',
  certification TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Drop old foreign key constraint if it exists (pointing to users table)
ALTER TABLE farmer_crops DROP CONSTRAINT IF EXISTS farmer_crops_farmer_id_fkey;

-- Add correct foreign key constraint (pointing to farmers table)
ALTER TABLE farmer_crops ADD CONSTRAINT farmer_crops_farmer_id_fkey
  FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE;

-- Farmer Offers table (farmers offering crops for sale)
CREATE TABLE IF NOT EXISTS farmer_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  crop_id UUID REFERENCES farmer_crops(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  crop_type TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit TEXT DEFAULT 'kg',
  min_order_quantity DECIMAL(10, 2),
  availability_start_date DATE,
  availability_end_date DATE,
  image_url TEXT,
  status TEXT CHECK (status IN ('active', 'sold', 'expired')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Buyer Purchase Requests table (buyers requesting specific crops)
CREATE TABLE IF NOT EXISTS buyer_purchase_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  crop_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  quantity DECIMAL(10, 2) NOT NULL,
  unit TEXT DEFAULT 'kg',
  max_price_per_unit DECIMAL(10, 2),
  required_by_date DATE,
  delivery_location TEXT,
  delivery_latitude DECIMAL(10, 8),
  delivery_longitude DECIMAL(11, 8),
  status TEXT CHECK (status IN ('active', 'fulfilled', 'expired', 'cancelled')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Farmer Responses to Buyer Requests
CREATE TABLE IF NOT EXISTS farmer_request_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES buyer_purchase_requests(id) ON DELETE CASCADE,
  farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  offer_id UUID REFERENCES farmer_offers(id) ON DELETE SET NULL,
  message TEXT,
  proposed_price DECIMAL(10, 2),
  proposed_quantity DECIMAL(10, 2),
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders table (involves both buyer and farmer)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  farmer_offer_id UUID REFERENCES farmer_offers(id) ON DELETE SET NULL,
  buyer_request_id UUID REFERENCES buyer_purchase_requests(id) ON DELETE SET NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
  delivery_address TEXT,
  delivery_latitude DECIMAL(10, 8),
  delivery_longitude DECIMAL(11, 8),
  delivery_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Buyer Cart Items table
CREATE TABLE IF NOT EXISTS buyer_cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  farmer_offer_id UUID NOT NULL REFERENCES farmer_offers(id) ON DELETE CASCADE,
  quantity DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(buyer_id, farmer_offer_id)
);

-- Buyer Wishlist table
CREATE TABLE IF NOT EXISTS buyer_wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  farmer_offer_id UUID REFERENCES farmer_offers(id) ON DELETE CASCADE,
  crop_id INTEGER, -- For mock/temporary crop data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(buyer_id, farmer_offer_id),
  UNIQUE(buyer_id, crop_id),
  CHECK (farmer_offer_id IS NOT NULL OR crop_id IS NOT NULL)
);



-- Buyer Saved Farmers table
CREATE TABLE IF NOT EXISTS buyer_saved_farmers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(buyer_id, farmer_id)
);

-- Farmer Saved Buyers table
CREATE TABLE IF NOT EXISTS farmer_saved_buyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(farmer_id, buyer_id)
);

-- Messages table (both can send/receive)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table (both can receive)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('order', 'offer', 'message', 'system', 'request')),
  is_read BOOLEAN DEFAULT FALSE,
  related_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table (both can review each other)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewed_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transport requests table
CREATE TABLE IF NOT EXISTS transport_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES users(id) ON DELETE SET NULL,
  pickup_location TEXT NOT NULL,
  delivery_location TEXT NOT NULL,
  pickup_latitude DECIMAL(10, 8),
  pickup_longitude DECIMAL(11, 8),
  delivery_latitude DECIMAL(10, 8),
  delivery_longitude DECIMAL(11, 8),
  status TEXT CHECK (status IN ('pending', 'accepted', 'in_transit', 'delivered', 'cancelled')) DEFAULT 'pending',
  estimated_delivery_date DATE,
  actual_delivery_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Weather data table (public data)
CREATE TABLE IF NOT EXISTS weather_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  temperature DECIMAL(5, 2),
  humidity INTEGER,
  rainfall DECIMAL(10, 2),
  wind_speed DECIMAL(5, 2),
  weather_condition TEXT,
  forecast_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Market prices table (public data)
CREATE TABLE IF NOT EXISTS market_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_type TEXT NOT NULL,
  location TEXT,
  price DECIMAL(10, 2),
  unit TEXT DEFAULT 'kg',
  market_name TEXT,
  date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_farmers_phone ON farmers(phone);
CREATE INDEX IF NOT EXISTS idx_buyers_phone ON buyers(phone);
CREATE INDEX IF NOT EXISTS idx_farmer_crops_farmer_id ON farmer_crops(farmer_id);
CREATE INDEX IF NOT EXISTS idx_farmer_offers_farmer_id ON farmer_offers(farmer_id);
CREATE INDEX IF NOT EXISTS idx_buyer_purchase_requests_buyer_id ON buyer_purchase_requests(buyer_id);
CREATE INDEX IF NOT EXISTS idx_farmer_request_responses_request_id ON farmer_request_responses(request_id);
CREATE INDEX IF NOT EXISTS idx_farmer_request_responses_farmer_id ON farmer_request_responses(farmer_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_farmer_id ON orders(farmer_id);
CREATE INDEX IF NOT EXISTS idx_buyer_cart_items_buyer_id ON buyer_cart_items(buyer_id);
CREATE INDEX IF NOT EXISTS idx_buyer_wishlist_buyer_id ON buyer_wishlist(buyer_id);
CREATE INDEX IF NOT EXISTS idx_buyer_saved_farmers_buyer_id ON buyer_saved_farmers(buyer_id);
CREATE INDEX IF NOT EXISTS idx_farmer_saved_buyers_farmer_id ON farmer_saved_buyers(farmer_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_transport_requests_order_id ON transport_requests(order_id);

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Everyone can view farmers" ON farmers;
DROP POLICY IF EXISTS "Farmers can update their own profile" ON farmers;
DROP POLICY IF EXISTS "Everyone can view buyers" ON buyers;
DROP POLICY IF EXISTS "Buyers can update their own profile" ON buyers;
DROP POLICY IF EXISTS "Farmers can view all crops" ON crops;
DROP POLICY IF EXISTS "Everyone can view farmer crops" ON farmer_crops;
DROP POLICY IF EXISTS "Farmers can create crops" ON crops;
DROP POLICY IF EXISTS "Farmers can create crops" ON farmer_crops;
DROP POLICY IF EXISTS "Farmers can update their own crops" ON crops;
DROP POLICY IF EXISTS "Farmers can update their own crops" ON farmer_crops;
DROP POLICY IF EXISTS "Farmers can delete their own crops" ON crops;
DROP POLICY IF EXISTS "Farmers can delete their own crops" ON farmer_crops;
DROP POLICY IF EXISTS "Everyone can view offers" ON offers;
DROP POLICY IF EXISTS "Everyone can view farmer offers" ON farmer_offers;
DROP POLICY IF EXISTS "Farmers can create offers" ON offers;
DROP POLICY IF EXISTS "Farmers can create offers" ON farmer_offers;
DROP POLICY IF EXISTS "Farmers can update their own offers" ON offers;
DROP POLICY IF EXISTS "Farmers can update their own offers" ON farmer_offers;
DROP POLICY IF EXISTS "Farmers can delete their own offers" ON offers;
DROP POLICY IF EXISTS "Farmers can delete their own offers" ON farmer_offers;
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Buyers can create orders" ON orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;
DROP POLICY IF EXISTS "Users can view their own cart" ON cart_items;
DROP POLICY IF EXISTS "Buyers can view their own cart" ON buyer_cart_items;
DROP POLICY IF EXISTS "Users can manage their own cart" ON cart_items;
DROP POLICY IF EXISTS "Buyers can manage their own cart" ON buyer_cart_items;
DROP POLICY IF EXISTS "Users can update their own cart" ON cart_items;
DROP POLICY IF EXISTS "Buyers can update their own cart" ON buyer_cart_items;
DROP POLICY IF EXISTS "Users can delete from their own cart" ON cart_items;
DROP POLICY IF EXISTS "Buyers can delete from their own cart" ON buyer_cart_items;
DROP POLICY IF EXISTS "Users can view their wishlist" ON wishlist;
DROP POLICY IF EXISTS "Buyers can view their wishlist" ON buyer_wishlist;
DROP POLICY IF EXISTS "Users can manage their wishlist" ON wishlist;
DROP POLICY IF EXISTS "Buyers can manage their wishlist" ON buyer_wishlist;
DROP POLICY IF EXISTS "Users can delete from wishlist" ON wishlist;
DROP POLICY IF EXISTS "Buyers can delete from wishlist" ON buyer_wishlist;
DROP POLICY IF EXISTS "Users can view their messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can view their notifications" ON notifications;
DROP POLICY IF EXISTS "Everyone can view reviews" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can view transport requests" ON transport_requests;
DROP POLICY IF EXISTS "Users can create transport requests" ON transport_requests;
DROP POLICY IF EXISTS "Everyone can view weather data" ON weather_data;
DROP POLICY IF EXISTS "Everyone can view market prices" ON market_prices;
DROP POLICY IF EXISTS "Everyone can view buyer requests" ON buyer_purchase_requests;
DROP POLICY IF EXISTS "Buyers can create requests" ON buyer_purchase_requests;
DROP POLICY IF EXISTS "Buyers can update their own requests" ON buyer_purchase_requests;
DROP POLICY IF EXISTS "Buyers can delete their own requests" ON buyer_purchase_requests;
DROP POLICY IF EXISTS "Users can view responses to their requests" ON farmer_request_responses;
DROP POLICY IF EXISTS "Farmers can create responses" ON farmer_request_responses;
DROP POLICY IF EXISTS "Farmers can update their own responses" ON farmer_request_responses;
DROP POLICY IF EXISTS "Buyers can view their saved farmers" ON buyer_saved_farmers;
DROP POLICY IF EXISTS "Buyers can manage their saved farmers" ON buyer_saved_farmers;
DROP POLICY IF EXISTS "Buyers can save farmers" ON buyer_saved_farmers;
DROP POLICY IF EXISTS "Buyers can remove saved farmers" ON buyer_saved_farmers;
DROP POLICY IF EXISTS "Farmers can view their saved buyers" ON farmer_saved_buyers;
DROP POLICY IF EXISTS "Farmers can manage their saved buyers" ON farmer_saved_buyers;
DROP POLICY IF EXISTS "Farmers can save buyers" ON farmer_saved_buyers;
DROP POLICY IF EXISTS "Farmers can remove saved buyers" ON farmer_saved_buyers;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmer_crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmer_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_purchase_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmer_request_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_saved_farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmer_saved_buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_prices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for farmers table
CREATE POLICY "Everyone can view farmers" ON farmers
  FOR SELECT USING (true);

CREATE POLICY "Farmers can insert their own profile" ON farmers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Farmers can update their own profile" ON farmers
  FOR UPDATE USING (true);

-- RLS Policies for buyers table
CREATE POLICY "Everyone can view buyers" ON buyers
  FOR SELECT USING (true);

CREATE POLICY "Buyers can insert their own profile" ON buyers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Buyers can update their own profile" ON buyers
  FOR UPDATE USING (true);

-- RLS Policies for farmer_crops table
CREATE POLICY "Everyone can view farmer crops" ON farmer_crops
  FOR SELECT USING (true);

CREATE POLICY "Farmers can create crops" ON farmer_crops
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Farmers can update their own crops" ON farmer_crops
  FOR UPDATE USING (true);

CREATE POLICY "Farmers can delete their own crops" ON farmer_crops
  FOR DELETE USING (true);

-- RLS Policies for farmer_offers table
CREATE POLICY "Everyone can view farmer offers" ON farmer_offers
  FOR SELECT USING (true);

CREATE POLICY "Farmers can create offers" ON farmer_offers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Farmers can update their own offers" ON farmer_offers
  FOR UPDATE USING (true);

CREATE POLICY "Farmers can delete their own offers" ON farmer_offers
  FOR DELETE USING (true);

-- RLS Policies for buyer_purchase_requests table
CREATE POLICY "Everyone can view buyer requests" ON buyer_purchase_requests
  FOR SELECT USING (true);

CREATE POLICY "Buyers can create requests" ON buyer_purchase_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Buyers can update their own requests" ON buyer_purchase_requests
  FOR UPDATE USING (true);

CREATE POLICY "Buyers can delete their own requests" ON buyer_purchase_requests
  FOR DELETE USING (true);

-- RLS Policies for farmer_request_responses table
CREATE POLICY "Users can view responses to their requests" ON farmer_request_responses
  FOR SELECT USING (
    auth.uid() = farmer_id OR
    auth.uid() IN (SELECT buyer_id FROM buyer_purchase_requests WHERE id = request_id)
  );

CREATE POLICY "Farmers can create responses" ON farmer_request_responses
  FOR INSERT WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Farmers can update their own responses" ON farmer_request_responses
  FOR UPDATE USING (auth.uid() = farmer_id);

-- RLS Policies for orders table
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = farmer_id);

CREATE POLICY "Buyers can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can update their own orders" ON orders
  FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = farmer_id);

-- RLS Policies for buyer_cart_items table
CREATE POLICY "Buyers can view their own cart" ON buyer_cart_items
  FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Buyers can manage their own cart" ON buyer_cart_items
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Buyers can update their own cart" ON buyer_cart_items
  FOR UPDATE USING (auth.uid() = buyer_id);

CREATE POLICY "Buyers can delete from their own cart" ON buyer_cart_items
  FOR DELETE USING (auth.uid() = buyer_id);

-- RLS Policies for buyer_wishlist table
CREATE POLICY "Buyers can view their wishlist" ON buyer_wishlist
  FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Buyers can manage their wishlist" ON buyer_wishlist
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Buyers can delete from wishlist" ON buyer_wishlist
  FOR DELETE USING (auth.uid() = buyer_id);

-- RLS Policies for buyer_saved_farmers table
CREATE POLICY "Buyers can view their saved farmers" ON buyer_saved_farmers
  FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Buyers can save farmers" ON buyer_saved_farmers
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Buyers can remove saved farmers" ON buyer_saved_farmers
  FOR DELETE USING (auth.uid() = buyer_id);

-- RLS Policies for farmer_saved_buyers table
CREATE POLICY "Farmers can view their saved buyers" ON farmer_saved_buyers
  FOR SELECT USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can save buyers" ON farmer_saved_buyers
  FOR INSERT WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Farmers can remove saved buyers" ON farmer_saved_buyers
  FOR DELETE USING (auth.uid() = farmer_id);

-- RLS Policies for messages table
CREATE POLICY "Users can view their messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- RLS Policies for notifications table
CREATE POLICY "Users can view their notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for reviews table
CREATE POLICY "Everyone can view reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- RLS Policies for transport_requests table
CREATE POLICY "Users can view transport requests" ON transport_requests
  FOR SELECT USING (true);

CREATE POLICY "Users can create transport requests" ON transport_requests
  FOR INSERT WITH CHECK (true);

-- RLS Policies for weather_data and market_prices (public read)
CREATE POLICY "Everyone can view weather data" ON weather_data
  FOR SELECT USING (true);

CREATE POLICY "Everyone can view market prices" ON market_prices
  FOR SELECT USING (true);

