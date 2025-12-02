-- =====================================================
-- AGORA VIDEO CALLS SCHEMA
-- =====================================================

-- Create calls table for video call signaling
CREATE TABLE IF NOT EXISTS public.calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel TEXT NOT NULL,
  caller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  callee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'ringing' CHECK (status IN ('ringing', 'accepted', 'in_progress', 'ended', 'missed', 'declined')),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_calls_caller_id ON public.calls(caller_id);
CREATE INDEX IF NOT EXISTS idx_calls_callee_id ON public.calls(callee_id);
CREATE INDEX IF NOT EXISTS idx_calls_created_at ON public.calls(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calls_status ON public.calls(status);

-- Create call_audit table for tracking events
CREATE TABLE IF NOT EXISTS public.call_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id UUID NOT NULL REFERENCES public.calls(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event TEXT NOT NULL CHECK (event IN ('ring', 'accept', 'decline', 'end', 'missed', 'error')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_call_audit_call_id ON public.call_audit(call_id);
CREATE INDEX IF NOT EXISTS idx_call_audit_created_at ON public.call_audit(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on calls table
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert calls where they are caller or callee
CREATE POLICY "Users can insert calls they participate in"
  ON public.calls FOR INSERT
  WITH CHECK (
    auth.uid() = caller_id OR auth.uid() = callee_id
  );

-- Policy: Users can select calls where they are caller or callee
CREATE POLICY "Users can view calls they participate in"
  ON public.calls FOR SELECT
  USING (
    auth.uid() = caller_id OR auth.uid() = callee_id
  );

-- Policy: Users can update calls where they are caller or callee
CREATE POLICY "Users can update calls they participate in"
  ON public.calls FOR UPDATE
  USING (
    auth.uid() = caller_id OR auth.uid() = callee_id
  )
  WITH CHECK (
    auth.uid() = caller_id OR auth.uid() = callee_id
  );

-- Enable RLS on call_audit table
ALTER TABLE public.call_audit ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert audit events for their calls
CREATE POLICY "Users can insert audit events for their calls"
  ON public.call_audit FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.calls
      WHERE calls.id = call_audit.call_id
      AND (calls.caller_id = auth.uid() OR calls.callee_id = auth.uid())
    )
  );

-- Policy: Users can view audit events for their calls
CREATE POLICY "Users can view audit events for their calls"
  ON public.call_audit FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.calls
      WHERE calls.id = call_audit.call_id
      AND (calls.caller_id = auth.uid() OR calls.callee_id = auth.uid())
    )
  );

-- =====================================================
-- REALTIME PUBLICATION
-- =====================================================

-- Enable realtime for calls table
ALTER PUBLICATION supabase_realtime ADD TABLE public.calls;

-- =====================================================
-- TRIGGER FUNCTIONS
-- =====================================================

-- Function to auto-create audit entry on call status change
CREATE OR REPLACE FUNCTION create_call_audit_on_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT' AND NEW.status = 'ringing') THEN
    INSERT INTO public.call_audit (call_id, user_id, event, metadata)
    VALUES (NEW.id, NEW.caller_id, 'ring', jsonb_build_object('caller_id', NEW.caller_id, 'callee_id', NEW.callee_id));
  ELSIF (TG_OP = 'UPDATE' AND OLD.status != NEW.status) THEN
    IF NEW.status = 'accepted' THEN
      INSERT INTO public.call_audit (call_id, user_id, event, metadata)
      VALUES (NEW.id, NEW.callee_id, 'accept', jsonb_build_object('accepted_at', NOW()));
    ELSIF NEW.status = 'declined' THEN
      INSERT INTO public.call_audit (call_id, user_id, event, metadata)
      VALUES (NEW.id, NEW.callee_id, 'decline', jsonb_build_object('declined_at', NOW()));
    ELSIF NEW.status = 'ended' THEN
      INSERT INTO public.call_audit (call_id, user_id, event, metadata)
      VALUES (NEW.id, COALESCE(NEW.caller_id, NEW.callee_id), 'end', jsonb_build_object('ended_at', NOW(), 'duration_seconds', EXTRACT(EPOCH FROM (NOW() - NEW.started_at))));
    ELSIF NEW.status = 'missed' THEN
      INSERT INTO public.call_audit (call_id, user_id, event, metadata)
      VALUES (NEW.id, NEW.callee_id, 'missed', jsonb_build_object('missed_at', NOW()));
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for audit logging
DROP TRIGGER IF EXISTS trigger_call_audit ON public.calls;
CREATE TRIGGER trigger_call_audit
  AFTER INSERT OR UPDATE ON public.calls
  FOR EACH ROW
  EXECUTE FUNCTION create_call_audit_on_status_change();

-- =====================================================
-- COMPLETE
-- =====================================================
