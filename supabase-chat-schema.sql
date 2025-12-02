-- =====================================================
-- SUPABASE REAL-TIME CHAT SCHEMA
-- =====================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('farmer', 'buyer')),
  phone TEXT,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CHATS TABLE
CREATE TABLE IF NOT EXISTS public.chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  last_message TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(farmer_id, buyer_id)
);

-- 3. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_chats_farmer_id ON public.chats(farmer_id);
CREATE INDEX IF NOT EXISTS idx_chats_buyer_id ON public.chats(buyer_id);
CREATE INDEX IF NOT EXISTS idx_chats_updated_at ON public.chats(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at ASC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- USERS TABLE POLICIES
CREATE POLICY "Users can view all users"
  ON public.users FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- CHATS TABLE POLICIES
CREATE POLICY "Users can view chats they participate in"
  ON public.chats FOR SELECT
  USING (
    auth.uid() = farmer_id OR auth.uid() = buyer_id
  );

CREATE POLICY "Users can create chats they participate in"
  ON public.chats FOR INSERT
  WITH CHECK (
    auth.uid() = farmer_id OR auth.uid() = buyer_id
  );

CREATE POLICY "Users can update chats they participate in"
  ON public.chats FOR UPDATE
  USING (
    auth.uid() = farmer_id OR auth.uid() = buyer_id
  );

-- MESSAGES TABLE POLICIES
CREATE POLICY "Users can view messages in their chats"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chats
      WHERE chats.id = messages.chat_id
      AND (chats.farmer_id = auth.uid() OR chats.buyer_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert messages in their chats"
  ON public.messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chats
      WHERE chats.id = messages.chat_id
      AND (chats.farmer_id = auth.uid() OR chats.buyer_id = auth.uid())
    )
    AND sender_id = auth.uid()
  );

-- =====================================================
-- REALTIME PUBLICATION
-- =====================================================

-- Enable realtime for messages and chats
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chats;

-- =====================================================
-- TRIGGERS FOR AUTO-UPDATE
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for chats table
CREATE TRIGGER update_chats_updated_at
  BEFORE UPDATE ON public.chats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- MIGRATION: SYNC EXISTING FARMERS AND BUYERS TO USERS
-- =====================================================

-- Insert farmers into users table
INSERT INTO public.users (id, name, role, phone, avatar)
SELECT 
  id,
  name,
  'farmer' as role,
  phone,
  avatar_url as avatar
FROM public.farmers
ON CONFLICT (id) DO NOTHING;

-- Insert buyers into users table
INSERT INTO public.users (id, name, role, phone, avatar)
SELECT 
  id,
  name,
  'buyer' as role,
  phone,
  avatar_url as avatar
FROM public.buyers
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- COMPLETE
-- =====================================================
