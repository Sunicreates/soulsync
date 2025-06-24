-- Add swipes table for matching functionality
-- Module: Browse Matches System

-- 1. Create swipe decision enum
DO $$ BEGIN
    CREATE TYPE public.swipe_decision AS ENUM ('like', 'pass');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create swipes table
CREATE TABLE IF NOT EXISTS public.swipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    target_user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    decision public.swipe_decision NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_user_id)
);

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_swipes_user_id ON public.swipes(user_id);
CREATE INDEX IF NOT EXISTS idx_swipes_target_user_id ON public.swipes(target_user_id);
CREATE INDEX IF NOT EXISTS idx_swipes_decision ON public.swipes(decision);
CREATE INDEX IF NOT EXISTS idx_swipes_created_at ON public.swipes(created_at);

-- 4. Enable Row Level Security
DO $$ BEGIN
    ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN others THEN null;
END $$;

-- 5. Helper functions for RLS policies
CREATE OR REPLACE FUNCTION public.can_access_swipe(swipe_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.swipes s
    WHERE s.id = swipe_id AND s.user_id = auth.uid()
)
$$;

-- 6. RLS Policies for swipes table
DO $$ BEGIN
    CREATE POLICY "users_can_view_own_swipes"
    ON public.swipes
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "users_can_create_own_swipes"
    ON public.swipes
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "users_can_delete_own_swipes"
    ON public.swipes
    FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 7. Grant necessary permissions
DO $$ BEGIN
    GRANT ALL ON public.swipes TO authenticated;
    GRANT EXECUTE ON FUNCTION public.can_access_swipe TO authenticated;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Permission grants failed: %', SQLERRM;
END $$;