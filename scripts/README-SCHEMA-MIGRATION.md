# Database Schema Migration Guide

## Overview

This guide explains how to apply the new database schema (`supabase-schema-v2.sql`) to your Supabase project.

## 🚀 Quick Start

Run the automated migration preparation script:

```bash
npm run migrate:v2
```

This will display:
- What will be migrated
- SQL file location
- Step-by-step instructions
- Count of tables, indexes, and policies

Then follow the on-screen instructions to apply the schema.

## What's New in V2 Schema?

The V2 schema introduces **dedicated tables for buyers and farmers** with clear naming conventions:

### New Tables

1. **`farmer_crops`** (replaces `crops`)
   - Stores crops managed by farmers
   
2. **`farmer_offers`** (replaces `offers`)
   - Farmers' offers for selling crops

3. **`buyer_purchase_requests`** (NEW)
   - Buyers can create requests for specific crops they want to purchase
   
4. **`farmer_request_responses`** (NEW)
   - Farmers can respond to buyer purchase requests

5. **`buyer_cart_items`** (replaces `cart_items`)
   - Shopping cart for buyers

6. **`buyer_wishlist`** (replaces `wishlist`)
   - Buyer's saved/favorite offers

7. **`buyer_saved_farmers`** (NEW)
   - Buyers can save their favorite farmers

8. **`farmer_saved_buyers`** (NEW)
   - Farmers can save their favorite buyers

### Updated Tables

- **`orders`** - Updated to reference new table names
- **`messages`**, **`notifications`**, **`reviews`** - Unchanged (shared between buyers and farmers)
- **`transport_requests`**, **`weather_data`**, **`market_prices`** - Unchanged (public/shared data)

## How to Apply the Schema

### Method 1: Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to your project at: https://app.supabase.com
   
2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy the Schema**
   - Open `scripts/supabase-schema-v2.sql`
   - Copy the entire contents

4. **Paste and Execute**
   - Paste into the SQL Editor
   - Click "Run" to execute

5. **Verify**
   - Go to "Table Editor" to see the new tables
   - Check that all tables, indexes, and RLS policies were created

### Method 2: Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Apply the migration
supabase db push --file scripts/supabase-schema-v2.sql
```

## Post-Migration Tasks

### 1. Update Service Files

You'll need to update the following service files to use the new table names:

- `services/wishlist-service.ts` - Update to use `buyer_wishlist`
- `services/cart-service.ts` - Update to use `buyer_cart_items`
- `services/offer-service.ts` - Update to use `farmer_offers`
- `services/crop-service.ts` - Update to use `farmer_crops`

### 2. Data Migration (if you have existing data)

If you have existing data in the old tables, you'll need to migrate it:

```sql
-- Example: Migrate crops to farmer_crops
INSERT INTO farmer_crops (id, farmer_id, name, crop_type, description, quantity, unit, price_per_unit, image_url, location, latitude, longitude, planting_date, expected_harvest_date, status, certification, created_at, updated_at)
SELECT id, farmer_id, name, crop_type, description, quantity, unit, price_per_unit, image_url, location, latitude, longitude, planting_date, expected_harvest_date, status, certification, created_at, updated_at
FROM crops;

-- Example: Migrate offers to farmer_offers
INSERT INTO farmer_offers (id, farmer_id, crop_id, title, crop_type, description, price, quantity, unit, min_order_quantity, availability_start_date, availability_end_date, image_url, status, created_at, updated_at)
SELECT id, farmer_id, crop_id, title, crop_type, description, price, quantity, unit, min_order_quantity, availability_start_date, availability_end_date, image_url, status, created_at, updated_at
FROM offers;

-- Example: Migrate wishlist to buyer_wishlist
INSERT INTO buyer_wishlist (id, buyer_id, farmer_offer_id, crop_id, created_at)
SELECT id, buyer_id, offer_id, crop_id, created_at
FROM wishlist;

-- Example: Migrate cart_items to buyer_cart_items
INSERT INTO buyer_cart_items (id, buyer_id, farmer_offer_id, quantity, created_at, updated_at)
SELECT id, buyer_id, offer_id, quantity, created_at, updated_at
FROM cart_items;
```

### 3. Drop Old Tables (Optional)

After verifying that everything works with the new tables:

```sql
DROP TABLE IF EXISTS crops CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS wishlist CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
```

## Benefits of the New Schema

1. **Clear Separation** - Buyer and farmer tables are clearly distinguished
2. **Better Organization** - Easy to identify which tables belong to which user type
3. **New Features** - Support for buyer purchase requests and saved users
4. **Scalability** - Easier to add role-specific features in the future
5. **Maintainability** - Code is more readable with explicit table names

## Troubleshooting

### Error: "relation already exists"

This is normal if you're running the script multiple times. The `IF NOT EXISTS` clauses will skip creating tables that already exist.

### Error: "permission denied"

Make sure you're using an account with sufficient permissions (project owner or admin).

### RLS Policies Not Working

Check that RLS is enabled on all tables:

```sql
ALTER TABLE farmer_crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmer_offers ENABLE ROW LEVEL SECURITY;
-- etc.
```

## Support

If you encounter any issues, please check:
1. Supabase project logs
2. SQL Editor error messages
3. RLS policy configurations

