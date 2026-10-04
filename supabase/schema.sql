-- ==============================================================================
-- IGNITE 2026: SUPABASE DATABASE SCHEMA (IDEMPOTENT & SAFE TO RE-RUN)
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. TEAM REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.ignite_registrations (
  id TEXT PRIMARY KEY,                           -- e.g. 'IGN-2026-8492'
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  team_name TEXT NOT NULL,
  track TEXT NOT NULL,
  lead_name TEXT NOT NULL,
  lead_email TEXT NOT NULL,
  lead_phone TEXT NOT NULL,
  lead_college TEXT DEFAULT '',
  lead_year TEXT DEFAULT '1st Year',
  lead_branch TEXT,
  lead_role TEXT,
  lead_social TEXT,
  team_size INT DEFAULT 1,
  members JSONB DEFAULT '[]'::jsonb,             -- Array of member objects
  project_title TEXT NOT NULL,
  pitch TEXT NOT NULL,
  problem TEXT NOT NULL,
  solution TEXT NOT NULL,
  tools JSONB DEFAULT '[]'::jsonb,               -- Array of strings
  prototype_link TEXT,
  project_link TEXT,                             -- Live prototype/project link for Showcase embed
  video_link TEXT,                               -- Pitch video (YouTube / Google Drive)
  referral TEXT,
  status TEXT DEFAULT 'submitted'                -- 'submitted', 'shortlisted', 'incubated'
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.ignite_registrations ENABLE ROW LEVEL SECURITY;

-- Idempotent RLS Policies for ignite_registrations
DO $$
BEGIN
  -- 1a. Allow public inserts
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ignite_registrations' 
    AND policyname = 'Allow public registration insert'
  ) THEN
    CREATE POLICY "Allow public registration insert"
      ON public.ignite_registrations
      FOR INSERT
      WITH CHECK (true);
  END IF;

  -- 1b. Allow public reads
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ignite_registrations' 
    AND policyname = 'Allow public read own registration'
  ) THEN
    CREATE POLICY "Allow public read own registration"
      ON public.ignite_registrations
      FOR SELECT
      USING (true);
  END IF;
END $$;


-- 2. SHOWCASE PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.showcase_projects (
  id TEXT PRIMARY KEY,                           -- slug e.g. 'project-slug'
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  full_description TEXT,
  problem TEXT,
  solution TEXT,
  track TEXT NOT NULL,
  track_color TEXT DEFAULT 'bg-emerald-50 text-emerald-800 border-emerald-200',
  award JSONB,                                   -- { title, prize, badgeColor, icon }
  tools JSONB DEFAULT '[]'::jsonb,
  team JSONB NOT NULL,                           -- { name, lead, college, members: [] }
  metrics TEXT,
  links JSONB DEFAULT '{}'::jsonb,               -- { demo, video, github, deck }
  cover_gradient TEXT DEFAULT 'from-[#2F5527] to-[#8FC45A]',
  upvotes INT DEFAULT 0,
  judge_verdict TEXT,
  featured BOOLEAN DEFAULT false
);

-- Enable RLS for showcase_projects
ALTER TABLE public.showcase_projects ENABLE ROW LEVEL SECURITY;

-- Idempotent RLS Policies for showcase_projects
DO $$
BEGIN
  -- 2a. Allow public read
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'showcase_projects' 
    AND policyname = 'Allow public read showcase'
  ) THEN
    CREATE POLICY "Allow public read showcase"
      ON public.showcase_projects
      FOR SELECT
      USING (true);
  END IF;

  -- 2b. Allow public upvote updates
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'showcase_projects' 
    AND policyname = 'Allow public upvote update'
  ) THEN
    CREATE POLICY "Allow public upvote update"
      ON public.showcase_projects
      FOR UPDATE
      USING (true)
      WITH CHECK (true);
  END IF;

  -- 2c. Allow service role full management
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'showcase_projects' 
    AND policyname = 'Allow full admin management'
  ) THEN
    CREATE POLICY "Allow full admin management"
      ON public.showcase_projects
      FOR ALL
      USING (auth.role() = 'service_role');
  END IF;
END $$;


-- 3. ATOMIC UPVOTE FUNCTION (OR REPLACE is inherently idempotent)
CREATE OR REPLACE FUNCTION public.increment_project_upvotes(project_id TEXT, delta INT DEFAULT 1)
RETURNS INT AS $$
DECLARE
  new_count INT;
BEGIN
  UPDATE public.showcase_projects
  SET upvotes = GREATEST(0, upvotes + delta)
  WHERE id = project_id
  RETURNING upvotes INTO new_count;

  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
