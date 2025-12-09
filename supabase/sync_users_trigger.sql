-- Trigger to automatically sync farmers to public.users
CREATE OR REPLACE FUNCTION public.sync_farmer_to_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, role, phone, avatar, updated_at)
  VALUES (
    NEW.id,
    NEW.full_name,
    'farmer',
    NEW.phone,
    NEW.profile_image,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    avatar = EXCLUDED.avatar,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_farmer_created ON public.farmers;
CREATE TRIGGER on_farmer_created
  AFTER INSERT OR UPDATE ON public.farmers
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_farmer_to_user();

-- Trigger to automatically sync buyers to public.users
CREATE OR REPLACE FUNCTION public.sync_buyer_to_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, role, phone, avatar, updated_at)
  VALUES (
    NEW.id,
    NEW.full_name,
    'buyer',
    NEW.phone,
    NEW.profile_image,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    avatar = EXCLUDED.avatar,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_buyer_created ON public.buyers;
CREATE TRIGGER on_buyer_created
  AFTER INSERT OR UPDATE ON public.buyers
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_buyer_to_user();
