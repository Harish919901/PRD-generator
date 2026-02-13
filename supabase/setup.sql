-- ============================================================
-- BuLLMake PRD Generator — Supabase Database Setup
-- Run this entire file in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- ============================================
-- 1. PROFILES TABLE
-- Auto-created for each auth user
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  organization TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. PROJECTS TABLE
-- Stores PRD projects with form_data as JSONB
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled PRD',
  form_data JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'draft',
  visibility TEXT DEFAULT 'private',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. PROJECT_COLLABORATORS TABLE
-- Multi-user access control
-- ============================================
CREATE TABLE IF NOT EXISTS project_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- ============================================
-- 4. PROJECT_VERSIONS TABLE
-- Version history snapshots
-- ============================================
CREATE TABLE IF NOT EXISTS project_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  change_type TEXT DEFAULT 'manual',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. COMMENTS TABLE
-- Field-level threaded comments
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  field_path TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. PROJECT_ACTIVITY TABLE
-- Audit trail / activity log
-- ============================================
CREATE TABLE IF NOT EXISTS project_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_project ON project_collaborators(project_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_user ON project_collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_versions_project ON project_versions(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_project ON comments(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_field ON comments(project_id, field_path);
CREATE INDEX IF NOT EXISTS idx_activity_project ON project_activity(project_id);

-- ============================================
-- AUTO-PROFILE TRIGGER
-- Creates a profile row when a new user signs up
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- AUTO-UPDATE TIMESTAMP TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_activity ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================
CREATE POLICY "Profiles are viewable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Service role can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- ============================================
-- PROJECTS POLICIES
-- ============================================
CREATE POLICY "Users can view own or collaborated projects"
  ON projects FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid()
    OR id IN (
      SELECT project_id FROM project_collaborators
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners and collaborators can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (
    owner_id = auth.uid()
    OR id IN (
      SELECT project_id FROM project_collaborators
      WHERE user_id = auth.uid() AND role IN ('editor', 'admin')
    )
  );

CREATE POLICY "Only owners can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- ============================================
-- PROJECT_COLLABORATORS POLICIES
-- ============================================
CREATE POLICY "Collaborators viewable by project members"
  ON project_collaborators FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "Owners can add collaborators"
  ON project_collaborators FOR INSERT
  TO authenticated
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Owners can remove collaborators"
  ON project_collaborators FOR DELETE
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
    )
  );

-- ============================================
-- PROJECT_VERSIONS POLICIES
-- ============================================
CREATE POLICY "Versions viewable by project members"
  ON project_versions FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
      UNION
      SELECT project_id FROM project_collaborators WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Project members can create versions"
  ON project_versions FOR INSERT
  TO authenticated
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
      UNION
      SELECT project_id FROM project_collaborators
      WHERE user_id = auth.uid() AND role IN ('editor', 'admin')
    )
  );

-- ============================================
-- COMMENTS POLICIES
-- ============================================
CREATE POLICY "Comments viewable by project members"
  ON comments FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
      UNION
      SELECT project_id FROM project_collaborators WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Project members can add comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
      UNION
      SELECT project_id FROM project_collaborators WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Authors can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Authors and owners can delete comments"
  ON comments FOR DELETE
  TO authenticated
  USING (
    author_id = auth.uid()
    OR project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
    )
  );

-- ============================================
-- PROJECT_ACTIVITY POLICIES
-- ============================================
CREATE POLICY "Activity viewable by project members"
  ON project_activity FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
      UNION
      SELECT project_id FROM project_collaborators WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can log activity"
  ON project_activity FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================
-- ENABLE REALTIME
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
