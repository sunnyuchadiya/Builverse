import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, Loading, PageHead } from "@/components/app/AppShell";
import { useSessionUser, type WorkspaceProfile } from "@/lib/session";
import { fetchMemberships, type Membership } from "@/lib/workspace";
import {
  createPost,
  deletePost,
  fetchLikes,
  fetchPosts,
  toggleLike,
  type CommunityPost,
} from "@/lib/repo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/community")({
  head: () => ({
    meta: [
      { title: "Community — Nexus builders feed" },
      {
        name: "description",
        content:
          "The Nexus community feed: share what you shipped, ask for feedback, and see the groups you belong to.",
      },
      { property: "og:title", content: "Community — Nexus builders feed" },
      {
        property: "og:description",
        content: "Share work, get feedback and follow your guilds in one live feed.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CommunityPage,
});

const TAGS = ["Showcase", "Feedback", "Question", "Resource"] as const;

function CommunityPage() {
  const { profile, ready } = useSessionUser();
  if (!ready || !profile) return <Loading />;
  return (
    <AppShell profile={profile}>
      <Feed profile={profile} />
    </AppShell>
  );
}

function Feed({ profile }: { profile: WorkspaceProfile }) {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [likes, setLikes] = useState<{ post_id: string; user_id: string }[]>([]);
  const [groups, setGroups] = useState<Membership[]>([]);
  const [tag, setTag] = useState<string>("All");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [postTag, setPostTag] = useState<string>("Showcase");
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [p, l, g] = await Promise.all([fetchPosts(), fetchLikes(), fetchMemberships(profile.id)]);
      setPosts(p);
      setLikes(l);
      setGroups(g);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load the community feed.");
    }
  }, [profile.id]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const channel = supabase
      .channel("community-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "community_posts" },
        (payload) => {
          const next = payload.new as CommunityPost;
          setPosts((prev) => (prev.some((p) => p.id === next.id) ? prev : [next, ...prev]));
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const visible = useMemo(
    () => posts.filter((p) => (tag === "All" ? true : p.tag === tag)),
    [posts, tag],
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    setError("");
    try {
      const row = await createPost(profile, {
        title: title.trim(),
        body: body.trim(),
        tag: postTag,
        link: link.trim(),
      });
      setPosts((prev) => (prev.some((p) => p.id === row.id) ? prev : [row, ...prev]));
      setTitle("");
      setBody("");
      setLink("");
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : "Could not post.");
    }
    setBusy(false);
  }

  async function like(postId: string) {
    const liked = likes.some((l) => l.post_id === postId && l.user_id === profile.id);
    setLikes((prev) =>
      liked
        ? prev.filter((l) => !(l.post_id === postId && l.user_id === profile.id))
        : [...prev, { post_id: postId, user_id: profile.id }],
    );
    try {
      await toggleLike(postId, profile.id, liked);
    } catch {
      void load();
    }
  }

  return (
    <>
      <PageHead
        eyebrow="Community"
        title="What the crew is shipping"
        subtitle="Post your work, ask for a critique, drop a resource. Everything appears live for every member."
      />

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div>
          <form
            onSubmit={submit}
            className="space-y-3 rounded-2xl border border-border bg-card p-5"
          >
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Share something with the community…"
              aria-label="Post title"
              className="w-full rounded-xl border border-border bg-surface-elevated px-4 py-2.5 text-sm outline-none focus:border-primary/60"
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              placeholder="Add details (optional)"
              aria-label="Post body"
              className="w-full rounded-xl border border-border bg-surface-elevated px-4 py-2.5 text-sm outline-none focus:border-primary/60"
            />
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={postTag}
                onChange={(e) => setPostTag(e.target.value)}
                aria-label="Post tag"
                className="rounded-full border border-border bg-surface-elevated px-4 py-2 text-sm outline-none focus:border-primary/60"
              >
                {TAGS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Link (optional)"
                aria-label="Link"
                className="min-w-0 flex-1 rounded-full border border-border bg-surface-elevated px-4 py-2 text-sm outline-none focus:border-primary/60"
              />
              <button
                type="submit"
                disabled={busy}
                className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {busy ? "Posting…" : "Post"}
              </button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap gap-2">
            {["All", ...TAGS].map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  tag === t
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <ul className="mt-5 space-y-4">
            {visible.map((p) => {
              const count = likes.filter((l) => l.post_id === p.id).length;
              const mineLike = likes.some((l) => l.post_id === p.id && l.user_id === profile.id);
              return (
                <li
                  key={p.id}
                  className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="grid size-9 place-items-center rounded-full bg-surface-elevated text-xs font-bold"
                      style={{ color: p.author_color }}
                    >
                      {p.author_name.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{p.author_name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(p.created_at).toLocaleString()} · {p.tag}
                      </p>
                    </div>
                    {p.author_id === profile.id && (
                      <button
                        onClick={async () => {
                          await deletePost(p.id);
                          setPosts((prev) => prev.filter((x) => x.id !== p.id));
                        }}
                        className="ml-auto text-xs text-muted-foreground hover:text-destructive"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <h2 className="mt-3 font-semibold">{p.title}</h2>
                  {p.body && (
                    <p className="mt-1 text-sm whitespace-pre-wrap text-muted-foreground">
                      {p.body}
                    </p>
                  )}
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-sm text-primary hover:underline"
                    >
                      {p.link}
                    </a>
                  )}
                  <button
                    onClick={() => void like(p.id)}
                    className={`mt-4 rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
                      mineLike
                        ? "border-primary text-primary"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    ▲ {count} {count === 1 ? "boost" : "boosts"}
                  </button>
                </li>
              );
            })}
            {visible.length === 0 && (
              <li className="text-sm text-muted-foreground">
                Nothing here yet — be the first to post.
              </li>
            )}
          </ul>
        </div>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-semibold">Your groups</h2>
            {groups.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                You haven&apos;t joined a group yet.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {groups.map((g) => (
                  <li key={g.id} className="flex items-center gap-2 text-sm">
                    <span className="size-1.5 rounded-full bg-primary" />
                    {g.group_name}
                  </li>
                ))}
              </ul>
            )}
            <Link
              to="/groups"
              className="mt-4 inline-block text-xs text-primary hover:underline"
            >
              Browse all groups →
            </Link>
          </section>
          <section className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
            <h2 className="font-semibold text-foreground">Community rules</h2>
            <ul className="mt-2 space-y-1.5">
              <li>Give feedback you would want to receive.</li>
              <li>Show the process, not just the pixels.</li>
              <li>Credit collaborators and sources.</li>
            </ul>
          </section>
        </aside>
      </div>
    </>
  );
}