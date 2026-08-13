ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'public',
  ADD COLUMN IF NOT EXISTS default_branch text NOT NULL DEFAULT 'main',
  ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'TypeScript',
  ADD COLUMN IF NOT EXISTS stars integer NOT NULL DEFAULT 0;

CREATE TABLE public.project_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  path text NOT NULL,
  content text NOT NULL DEFAULT '',
  language text NOT NULL DEFAULT 'plaintext',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, path)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_files TO authenticated;
GRANT ALL ON public.project_files TO service_role;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members read own or public repo files"
  ON public.project_files FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_files.project_id AND p.visibility = 'public'
    )
  );

CREATE POLICY "Members create own files"
  ON public.project_files FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members update own files"
  ON public.project_files FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members delete own files"
  ON public.project_files FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER project_files_updated_at
  BEFORE UPDATE ON public.project_files
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX project_files_project_idx ON public.project_files (project_id, path);

CREATE TABLE public.project_commits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  author_name text NOT NULL DEFAULT 'Teammate',
  message text NOT NULL,
  files_changed integer NOT NULL DEFAULT 1,
  additions integer NOT NULL DEFAULT 0,
  deletions integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, DELETE ON public.project_commits TO authenticated;
GRANT ALL ON public.project_commits TO service_role;
ALTER TABLE public.project_commits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members read own or public repo commits"
  ON public.project_commits FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_commits.project_id AND p.visibility = 'public'
    )
  );

CREATE POLICY "Members create own commits"
  ON public.project_commits FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members delete own commits"
  ON public.project_commits FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX project_commits_project_idx ON public.project_commits (project_id, created_at DESC);

CREATE TABLE public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL,
  author_name text NOT NULL DEFAULT 'Teammate',
  author_color text NOT NULL DEFAULT '#C9F227',
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  tag text NOT NULL DEFAULT 'Showcase',
  link text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_posts TO authenticated;
GRANT ALL ON public.community_posts TO service_role;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Community posts readable by members"
  ON public.community_posts FOR SELECT TO authenticated USING (true);

CREATE POLICY "Members create own posts"
  ON public.community_posts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors update own posts"
  ON public.community_posts FOR UPDATE TO authenticated
  USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors delete own posts"
  ON public.community_posts FOR DELETE TO authenticated
  USING (auth.uid() = author_id);

CREATE TRIGGER community_posts_updated_at
  BEFORE UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.community_post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);

GRANT SELECT, INSERT, DELETE ON public.community_post_likes TO authenticated;
GRANT ALL ON public.community_post_likes TO service_role;
ALTER TABLE public.community_post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes readable by members"
  ON public.community_post_likes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Members like as themselves"
  ON public.community_post_likes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members remove own likes"
  ON public.community_post_likes FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;