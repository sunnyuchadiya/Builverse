import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Loading, PageHead } from "@/components/app/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useSessionUser } from "@/lib/session";

export const Route = createFileRoute("/_authenticated/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio publishing — Nexus" },
      {
        name: "description",
        content:
          "Customize your public Nexus profile, pick which work is visible and publish your portfolio in one click.",
      },
      { property: "og:title", content: "Portfolio publishing — Nexus" },
      {
        property: "og:description",
        content: "Customize your public profile and publish your work automatically.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PortfolioPage,
});

const ACCENTS = ["#C9F227", "#4FD1C5", "#8B8CF7", "#F97C7C", "#F7C948", "#5AC8FA"];

function slugify(s) {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "member"
  );
}

function PortfolioPage() {
  const { profile, ready } = useSessionUser();
  if (!ready || !profile) return <Loading />;
  return (
    <AppShell profile={profile}>
      <PortfolioEditor profile={profile} />
    </AppShell>
  );
}

function PortfolioEditor({ profile }) {
  const [portfolio, setPortfolio] = useState(null);
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    const { data: existing } = await supabase
      .from("portfolios")
      .select("*")
      .eq("user_id", profile.id)
      .maybeSingle();

    let row = existing;
    if (!row) {
      const draft = {
        user_id: profile.id,
        slug: `${slugify(profile.display_name)}-${profile.id.slice(0, 4)}`,
        headline: "Product engineer & designer",
        bio: "I build fast, considered interfaces and the systems behind them.",
        location: "Remote",
        accent: profile.color,
        website: "",
        github: "",
        auto_publish: true,
        published: false,
      };
      const { data: created, error: createError } = await supabase
        .from("portfolios")
        .upsert(draft, { onConflict: "user_id", ignoreDuplicates: false })
        .select("*")
        .maybeSingle();
      if (createError) setNotice(createError.message);
      row = created ?? { ...draft, published_at: null };
    }
    setPortfolio(row);

    const { data: rows } = await supabase
      .from("portfolio_items")
      .select("*")
      .eq("user_id", profile.id)
      .order("position", { ascending: true });
    setItems(rows ?? []);
  }, [profile.id, profile.display_name, profile.color]);

  useEffect(() => {
    void load();
  }, [load]);

  function patch(next) {
    setPortfolio((p) => (p ? { ...p, ...next } : p));
  }

  async function save(extra = {}) {
    if (!portfolio) return;
    setSaving(true);
    setNotice("");
    const next = { ...portfolio, ...extra, slug: slugify(portfolio.slug) };
    const published_at = next.published
      ? (next.published_at ?? new Date().toISOString())
      : next.published_at;
    const { data, error } = await supabase
      .from("portfolios")
      .upsert(
        {
          user_id: profile.id,
          slug: next.slug,
          headline: next.headline,
          bio: next.bio,
          location: next.location,
          accent: next.accent,
          website: next.website,
          github: next.github,
          auto_publish: next.auto_publish,
          published: next.published,
          published_at,
        },
        { onConflict: "user_id" },
      )
      .select("*")
      .maybeSingle();
    setSaving(false);
    if (error) {
      setNotice(
        error.code === "23505" ? "That profile URL is taken — try another." : error.message,
      );
      return;
    }
    setPortfolio(data ?? { ...next, published_at });
    setNotice(next.published ? "Published — your profile is live." : "Saved.");
  }

  async function addItem() {
    const row = {
      user_id: profile.id,
      title: "New case study",
      summary: "What you built, for whom, and the outcome.",
      role: "Lead engineer",
      stack: "React, Node",
      link: "",
      status: "shipped",
      progress: 100,
      published: portfolio?.auto_publish ?? true,
      position: items.length,
    };
    const { data } = await supabase.from("portfolio_items").insert(row).select("*").maybeSingle();
    if (data) setItems((prev) => [...prev, data]);
  }

  async function updateItem(id, next) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...next } : i)));
    await supabase.from("portfolio_items").update(next).eq("id", id);
  }

  async function removeItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await supabase.from("portfolio_items").delete().eq("id", id);
  }

  if (!portfolio) return <p className="text-sm text-muted-foreground">Loading your portfolio…</p>;

  const publicUrl = `/u/${slugify(portfolio.slug)}`;
  const liveCount = items.filter((i) => i.published).length;

  return (
    <>
      <PageHead
        eyebrow="Portfolio"
        title="Publish your public profile"
        subtitle="Customize how the world sees your work. Turn on auto-publish and every new case study goes live the moment you add it."
        action={
          <div className="flex items-center gap-2">
            <a
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border px-4 py-2.5 text-sm transition-colors hover:border-primary/60"
            >
              Preview
            </a>
            <button
              onClick={() => void save({ published: !portfolio.published })}
              disabled={saving}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:scale-105 disabled:opacity-60 ${
                portfolio.published
                  ? "border border-border text-muted-foreground"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {portfolio.published ? "Unpublish" : "Publish portfolio"}
            </button>
          </div>
        }
      />

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <span
          className={`flex items-center gap-2 rounded-full border px-3 py-1 ${
            portfolio.published
              ? "border-primary/50 text-primary"
              : "border-border text-muted-foreground"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${portfolio.published ? "animate-pulse bg-primary" : "bg-muted-foreground"}`}
          />
          {portfolio.published ? "Live" : "Draft"}
        </span>
        <span className="text-muted-foreground">
          {liveCount} of {items.length} projects visible
        </span>
        {notice && <span className="text-primary">{notice}</span>}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold">Public profile</h2>
          <div className="mt-5 space-y-4">
            <Field label="Profile URL">
              <div className="flex items-center rounded-xl border border-border bg-surface-elevated px-3">
                <span className="text-sm text-muted-foreground">nexus.dev/u/</span>
                <input
                  value={portfolio.slug}
                  onChange={(e) => patch({ slug: e.target.value })}
                  onBlur={() => patch({ slug: slugify(portfolio.slug) })}
                  className="flex-1 bg-transparent py-2.5 text-sm outline-none"
                  aria-label="Profile URL"
                />
              </div>
            </Field>
            <Field label="Headline">
              <Input value={portfolio.headline} onChange={(v) => patch({ headline: v })} />
            </Field>
            <Field label="Bio">
              <textarea
                value={portfolio.bio}
                onChange={(e) => patch({ bio: e.target.value })}
                rows={3}
                aria-label="Bio"
                className="w-full resize-none rounded-xl border border-border bg-surface-elevated px-3 py-2.5 text-sm outline-none focus:border-primary/60"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Location">
                <Input value={portfolio.location} onChange={(v) => patch({ location: v })} />
              </Field>
              <Field label="Website">
                <Input value={portfolio.website} onChange={(v) => patch({ website: v })} />
              </Field>
            </div>
            <Field label="GitHub">
              <Input value={portfolio.github} onChange={(v) => patch({ github: v })} />
            </Field>
            <Field label="Accent color">
              <div className="flex gap-2">
                {ACCENTS.map((c) => (
                  <button
                    key={c}
                    aria-label={`Accent ${c}`}
                    onClick={() => patch({ accent: c })}
                    className={`size-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      portfolio.accent === c ? "border-foreground" : "border-transparent"
                    }`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </Field>

            <label className="flex items-center justify-between rounded-xl border border-border bg-surface-elevated p-4">
              <span>
                <span className="block text-sm font-medium">Auto-publish new work</span>
                <span className="block text-xs text-muted-foreground">
                  New case studies go live automatically.
                </span>
              </span>
              <input
                type="checkbox"
                checked={portfolio.auto_publish}
                onChange={(e) => patch({ auto_publish: e.target.checked })}
                className="size-5 accent-[var(--primary)]"
              />
            </label>

            <button
              onClick={() => void save()}
              disabled={saving}
              className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save profile"}
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Work on your profile</h2>
            <button
              onClick={() => void addItem()}
              className="rounded-full border border-border px-3.5 py-1.5 text-sm transition-colors hover:border-primary/60"
            >
              + Add work
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {items.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nothing here yet — add your first case study.
              </p>
            )}
            {items.map((it) => (
              <article
                key={it.id}
                className="rounded-xl border border-border bg-surface-elevated p-4"
              >
                <input
                  value={it.title}
                  onChange={(e) => void updateItem(it.id, { title: e.target.value })}
                  aria-label="Project title"
                  className="w-full bg-transparent text-sm font-semibold outline-none"
                />
                <textarea
                  value={it.summary}
                  onChange={(e) => void updateItem(it.id, { summary: e.target.value })}
                  rows={2}
                  aria-label="Project summary"
                  className="mt-1 w-full resize-none bg-transparent text-xs text-muted-foreground outline-none"
                />
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <input
                    value={it.role}
                    onChange={(e) => void updateItem(it.id, { role: e.target.value })}
                    placeholder="Role"
                    aria-label="Role"
                    className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs outline-none focus:border-primary/60"
                  />
                  <input
                    value={it.stack}
                    onChange={(e) => void updateItem(it.id, { stack: e.target.value })}
                    placeholder="Stack"
                    aria-label="Stack"
                    className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs outline-none focus:border-primary/60"
                  />
                </div>
                <input
                  value={it.link}
                  onChange={(e) => void updateItem(it.id, { link: e.target.value })}
                  placeholder="https://live-link.com"
                  aria-label="Project link"
                  className="mt-2 w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs outline-none focus:border-primary/60"
                />
                <div className="mt-3 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={it.published}
                      onChange={(e) => void updateItem(it.id, { published: e.target.checked })}
                      className="size-4 accent-[var(--primary)]"
                    />
                    Visible on profile
                  </label>
                  <button
                    onClick={() => void removeItem(it.id)}
                    className="text-xs text-muted-foreground transition-colors hover:text-destructive"
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] tracking-widest text-muted-foreground uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}

function Input({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-border bg-surface-elevated px-3 py-2.5 text-sm outline-none focus:border-primary/60"
    />
  );
}
