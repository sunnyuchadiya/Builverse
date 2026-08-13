CREATE POLICY "Public can read names of published members" ON public.profiles
  FOR SELECT TO anon USING (
    EXISTS (
      SELECT 1 FROM public.portfolios p
      WHERE p.user_id = profiles.id AND p.published = true
    )
  );

GRANT SELECT ON public.profiles TO anon;