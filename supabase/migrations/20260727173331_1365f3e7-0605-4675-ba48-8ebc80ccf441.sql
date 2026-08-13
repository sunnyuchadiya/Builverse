-- Portfolio publishing
CREATE TABLE public.portfolios (
  user_id uuid PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  headline text NOT NULL DEFAULT 'Product engineer & designer',
  bio text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  accent text NOT NULL DEFAULT '#C9F227',
  website text NOT NULL DEFAULT '',
  github text NOT NULL DEFAULT '',
  auto_publish boolean NOT NULL DEFAULT true,
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolios TO authenticated;
GRANT SELECT ON public.portfolios TO anon;
GRANT ALL ON public.portfolios TO service_role;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published portfolios are public" ON public.portfolios
  FOR SELECT TO anon USING (published = true);
CREATE POLICY "Members read published or own portfolio" ON public.portfolios
  FOR SELECT TO authenticated USING (published = true OR auth.uid() = user_id);
CREATE POLICY "Members create own portfolio" ON public.portfolios
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Members update own portfolio" ON public.portfolios
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Members delete own portfolio" ON public.portfolios
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER portfolios_updated_at BEFORE UPDATE ON public.portfolios
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Portfolio work items (projects shown on the public profile)
CREATE TABLE public.portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  summary text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT '',
  stack text NOT NULL DEFAULT '',
  link text NOT NULL DEFAULT '',
  progress integer NOT NULL DEFAULT 100,
  status text NOT NULL DEFAULT 'shipped',
  published boolean NOT NULL DEFAULT true,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_items TO authenticated;
GRANT SELECT ON public.portfolio_items TO anon;
GRANT ALL ON public.portfolio_items TO service_role;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public items of published portfolios" ON public.portfolio_items
  FOR SELECT TO anon USING (
    published = true
    AND EXISTS (SELECT 1 FROM public.portfolios p WHERE p.user_id = portfolio_items.user_id AND p.published = true)
  );
CREATE POLICY "Members read own or published items" ON public.portfolio_items
  FOR SELECT TO authenticated USING (
    auth.uid() = user_id
    OR (published = true AND EXISTS (SELECT 1 FROM public.portfolios p WHERE p.user_id = portfolio_items.user_id AND p.published = true))
  );
CREATE POLICY "Members create own items" ON public.portfolio_items
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Members update own items" ON public.portfolio_items
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Members delete own items" ON public.portfolio_items
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER portfolio_items_updated_at BEFORE UPDATE ON public.portfolio_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX portfolio_items_user_idx ON public.portfolio_items (user_id, position);

-- Team chat
CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room text NOT NULL DEFAULT 'general',
  author_id uuid NOT NULL,
  author_name text NOT NULL DEFAULT 'Teammate',
  author_color text NOT NULL DEFAULT '#C9F227',
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, DELETE ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Signed-in members read chat" ON public.chat_messages
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Members send their own messages" ON public.chat_messages
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors delete their messages" ON public.chat_messages
  FOR DELETE TO authenticated USING (auth.uid() = author_id);

CREATE INDEX chat_messages_room_idx ON public.chat_messages (room, created_at);

ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;