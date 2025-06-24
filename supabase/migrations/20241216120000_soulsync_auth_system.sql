-- SoulSync Authentication and User Management Migration
-- Module: Authentication & User Profiles

-- 1. Create custom types
DO $$ BEGIN
    CREATE TYPE public.profession_type AS ENUM ('developer', 'doctor', 'founder');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create user_profiles table (intermediary for auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    profession public.profession_type,
    avatar_url TEXT,
    tags TEXT[] DEFAULT '{}',
    bio TEXT,
    location TEXT,
    company TEXT,
    years_experience INTEGER,
    github_url TEXT,
    linkedin_url TEXT,
    website_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create matches table for matchmaking functionality
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user1_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    user2_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user1_id, user2_id)
);

-- 4. Create essential indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_profession ON public.user_profiles(profession);
CREATE INDEX IF NOT EXISTS idx_user_profiles_location ON public.user_profiles(location);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON public.user_profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_matches_user1_id ON public.matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_matches_user2_id ON public.matches(user2_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status);

-- 5. Enable Row Level Security
DO $$ BEGIN
    ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN others THEN null;
END $$;

-- 6. Create helper functions for RLS policies
CREATE OR REPLACE FUNCTION public.is_profile_owner(profile_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = profile_id AND up.id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.can_view_profile(profile_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = profile_id AND (up.is_active = true OR up.id = auth.uid())
)
$$;

CREATE OR REPLACE FUNCTION public.can_access_match(match_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.matches m
    WHERE m.id = match_id AND (m.user1_id = auth.uid() OR m.user2_id = auth.uid())
)
$$;

-- 7. Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, profession)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'profession', NULL)::public.profession_type
    );
    RETURN NEW;
END;
$$;

-- 8. Function to update profile timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- 9. Create triggers
DO $$ BEGIN
    CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_user_profiles_updated_at
        BEFORE UPDATE ON public.user_profiles
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_matches_updated_at
        BEFORE UPDATE ON public.matches
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 10. RLS Policies
-- User profiles policies
DO $$ BEGIN
    CREATE POLICY "users_can_view_active_profiles"
    ON public.user_profiles
    FOR SELECT
    TO authenticated
    USING (public.can_view_profile(id));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "users_can_update_own_profile"
    ON public.user_profiles
    FOR UPDATE
    TO authenticated
    USING (public.is_profile_owner(id))
    WITH CHECK (public.is_profile_owner(id));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "users_can_insert_own_profile"
    ON public.user_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Matches policies
DO $$ BEGIN
    CREATE POLICY "users_can_view_own_matches"
    ON public.matches
    FOR SELECT
    TO authenticated
    USING (public.can_access_match(id));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "users_can_create_matches"
    ON public.matches
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user1_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "users_can_update_own_matches"
    ON public.matches
    FOR UPDATE
    TO authenticated
    USING (public.can_access_match(id));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 11. Create mock data for development
DO $$
DECLARE
    dev_user_id UUID := gen_random_uuid();
    doctor_user_id UUID := gen_random_uuid();
    founder_user_id UUID := gen_random_uuid();
    user_exists BOOLEAN;
BEGIN
    -- Check if mock users already exist
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'alex.developer@example.com') INTO user_exists;
    
    IF NOT user_exists THEN
        -- Create complete auth.users records
        INSERT INTO auth.users (
            id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
            created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
            is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
            recovery_token, recovery_sent_at, email_change_token_new, email_change,
            email_change_sent_at, email_change_token_current, email_change_confirm_status,
            reauthentication_token, reauthentication_sent_at, phone, phone_change,
            phone_change_token, phone_change_sent_at
        ) VALUES
            (dev_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
             'alex.developer@example.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
             '{"full_name": "Alex Chen", "profession": "developer"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
             false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
            (doctor_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
             'sarah.doctor@example.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
             '{"full_name": "Dr. Sarah Johnson", "profession": "doctor"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
             false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
            (founder_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
             'mike.founder@example.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
             '{"full_name": "Mike Rodriguez", "profession": "founder"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
             false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

        -- Update user profiles with additional details
        UPDATE public.user_profiles SET
            bio = 'Full-stack developer passionate about building scalable web applications. Love working with React, Node.js, and cloud technologies.',
            location = 'San Francisco, CA',
            company = 'TechCorp',
            years_experience = 5,
            github_url = 'https://github.com/alexchen',
            linkedin_url = 'https://linkedin.com/in/alexchen',
            tags = ARRAY['React', 'Node.js', 'TypeScript', 'AWS', 'GraphQL']
        WHERE id = dev_user_id;

        UPDATE public.user_profiles SET
            bio = 'Cardiologist dedicated to improving patient outcomes through innovative treatments. Interested in healthcare technology and medical research.',
            location = 'Boston, MA',
            company = 'General Hospital',
            years_experience = 8,
            linkedin_url = 'https://linkedin.com/in/sarahjohnson',
            tags = ARRAY['Cardiology', 'Research', 'Healthcare Tech', 'Patient Care']
        WHERE id = doctor_user_id;

        UPDATE public.user_profiles SET
            bio = 'Serial entrepreneur with experience in fintech and healthcare startups. Currently building the next generation of financial tools.',
            location = 'New York, NY',
            company = 'StartupCo',
            years_experience = 12,
            linkedin_url = 'https://linkedin.com/in/mikerodriguez',
            website_url = 'https://mikerodriguez.com',
            tags = ARRAY['Fintech', 'Healthcare', 'Leadership', 'Venture Capital', 'AI']
        WHERE id = founder_user_id;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Mock data creation failed: %', SQLERRM;
END $$;

-- 12. Create function to cleanup test data (for development)
CREATE OR REPLACE FUNCTION public.cleanup_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    test_user_ids UUID[];
BEGIN
    -- Get test user IDs
    SELECT ARRAY_AGG(id) INTO test_user_ids
    FROM auth.users
    WHERE email LIKE '%@example.com';

    -- Delete in dependency order
    DELETE FROM public.matches WHERE user1_id = ANY(test_user_ids) OR user2_id = ANY(test_user_ids);
    DELETE FROM public.user_profiles WHERE id = ANY(test_user_ids);
    DELETE FROM auth.users WHERE id = ANY(test_user_ids);

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;

-- 13. Grant necessary permissions
DO $$ BEGIN
    GRANT USAGE ON SCHEMA public TO authenticated;
    GRANT ALL ON public.user_profiles TO authenticated;
    GRANT ALL ON public.matches TO authenticated;
    GRANT EXECUTE ON FUNCTION public.is_profile_owner TO authenticated;
    GRANT EXECUTE ON FUNCTION public.can_view_profile TO authenticated;
    GRANT EXECUTE ON FUNCTION public.can_access_match TO authenticated;
    GRANT EXECUTE ON FUNCTION public.cleanup_test_data TO authenticated;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Permission grants failed: %', SQLERRM;
END $$;