import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, Loading, PageHead } from "@/components/app/AppShell";
import { useSessionUser, type WorkspaceProfile } from "@/lib/session";
import { fetchMemberships, joinGroup, leaveGroup, type Membership } from "@/lib/workspace";

export const Route = createFileRoute("/_authenticated/groups")({
  head: () => ({
    meta: [
      { title: "Groups — Nexus communities" },
      {
        name: "description",
        content:
          "Join Nexus groups: design systems, motion, backend guilds and study circles with live activity.",
      },
      { property: "og:title", content: "Groups — Nexus communities" },
      { property: "og:description", content: "Guilds, study circles and squads inside Nexus." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GroupsPage,
});

const GROUPS = [
  { name: "Design Systems Guild", members: 1284, topic: "Tokens, theming, a11y", active: 42 },
  { name: "Motion Lab", members: 863, topic: "GSAP, Rive, WebGL", active: 27 },
  { name: "Backend Guild", members: 1907, topic: "Kafka, Redis, Postgres", active: 61 },
  { name: "Product Craft", members: 742, topic: "Discovery, specs, research", active: 15 },
  { name: "Portfolio Reviews", members: 2310, topic: "Weekly critique circles", active: 88 },
  { name: "Ship-30 Club", members: 519, topic: "30 days, 30 shipped things", active: 34 },
];

function GroupsPage() {
  const { profile, ready } = useSessionUser();
  if (!ready || !profile) return <Loading />;
  return (
    <AppShell profile={profile}>
      <GroupsBoard profile={profile} />
    </AppShell>
  );
}

function GroupsBoard({ profile }: { profile: WorkspaceProfile }) {
  const [joined, setJoined] = useState<Membership[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setJoined(await fetchMemberships(profile.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load your groups.");
    }
  }, [profile.id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function toggle(g: (typeof GROUPS)[number]) {
    const key = g.name;
    const isIn = joined.some((j) => j.group_key === key);
    setBusy(key);
    setError("");
    try {
      if (isIn) {
        await leaveGroup(profile.id, key);
        setJoined((prev) => prev.filter((j) => j.group_key !== key));
      } else {
        const row = await joinGroup(profile.id, key, g.name);
        setJoined((prev) => [...prev, row]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
    setBusy(null);
  }

  return (
    <>
      <PageHead
        eyebrow="Groups"
        title="Find your people"
        subtitle="Small guilds that meet weekly, review work and ship together. Join as many as you like."
        action={
          <button className="rounded-full border border-border px-5 py-2.5 text-sm transition-colors hover:border-primary/60">
            Create a group
          </button>
        }
      />

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <section className="mt-6 rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold">Your groups ({joined.length})</h2>
          <Link to="/dashboard" className="text-xs text-primary hover:underline">
            Also shown on your dashboard →
          </Link>
        </div>
        {joined.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            You haven&apos;t joined any group yet. Hit “Join group” below — it saves to your account
            and appears here and on your dashboard.
          </p>
        ) : (
          <ul className="mt-4 flex flex-wrap gap-2">
            {joined.map((j) => (
              <li
                key={j.id}
                className="flex items-center gap-2 rounded-full border border-primary/40 bg-surface-elevated px-3 py-1.5 text-sm"
              >
                <span className="size-1.5 rounded-full bg-primary" />
                {j.group_name}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GROUPS.map((g) => {
          const isIn = joined.some((j) => j.group_key === g.name);
          return (
            <article
              key={g.name}
              className="rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/50"
            >
              <div className="flex items-center justify-between">
                <span
                  className="size-10 rounded-xl"
                  style={{ background: "var(--gradient-primary)", opacity: 0.5 }}
                />
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="size-1.5 animate-pulse rounded-full bg-primary" />
                  {g.active} online
                </span>
              </div>
              <h2 className="mt-4 font-semibold">{g.name}</h2>
              <p className="text-xs text-muted-foreground">{g.topic}</p>
              <p className="mt-3 text-[11px] tracking-widest text-muted-foreground uppercase">
                {g.members.toLocaleString()} members
              </p>
              <button
                onClick={() => void toggle(g)}
                disabled={busy === g.name}
                className={`mt-4 w-full rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  isIn
                    ? "border border-border text-muted-foreground hover:text-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {busy === g.name ? "Saving…" : isIn ? "Joined ✓ (leave)" : "Join group"}
              </button>
            </article>
          );
        })}
      </div>
    </>
  );
}
