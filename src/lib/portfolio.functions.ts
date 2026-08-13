import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

export type PublicPortfolio = {
  user_id: string;
  slug: string;
  headline: string;
  bio: string;
  location: string;
  accent: string;
  website: string;
  github: string;
  published_at: string | null;
};

export type PublicPortfolioItem = {
  id: string;
  title: string;
  summary: string;
  role: string;
  stack: string;
  link: string;
  status: string;
  progress: number;
};

export type PublicPortfolioPayload = {
  portfolio: PublicPortfolio | null;
  items: PublicPortfolioItem[];
  name: string;
};

/** Public, read-only fetch of a published portfolio by slug (SSR safe, anon policies). */
export const getPublicPortfolio = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string().min(1).max(64) }).parse(input))
  .handler(async ({ data }): Promise<PublicPortfolioPayload> => {
    const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
    const supabasePublic = createClient<Database>(process.env.SUPABASE_URL!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const { data: portfolio } = await supabasePublic
      .from("portfolios")
      .select("user_id, slug, headline, bio, location, accent, website, github, published_at")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();

    if (!portfolio) return { portfolio: null, items: [], name: "" };

    const [{ data: items }, { data: profile }] = await Promise.all([
      supabasePublic
        .from("portfolio_items")
        .select("id, title, summary, role, stack, link, status, progress")
        .eq("user_id", portfolio.user_id)
        .eq("published", true)
        .order("position", { ascending: true }),
      supabasePublic
        .from("profiles")
        .select("display_name")
        .eq("id", portfolio.user_id)
        .maybeSingle(),
    ]);

    return { portfolio, items: items ?? [], name: profile?.display_name ?? "Nexus member" };
  });
