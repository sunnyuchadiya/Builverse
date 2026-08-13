import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, Loading, PageHead } from "@/components/app/AppShell";
import { useSessionUser, type WorkspaceProfile } from "@/lib/session";
import { CollabWorkspace } from "@/components/app/CollabWorkspace";
import { ContributionGraph } from "@/components/app/ContributionGraph";
import {
  createIssue,
  createProject,
  deleteIssue,
  deleteProject,
  fetchIssues,
  fetchMemberships,
  fetchProjects,
  setIssueResolved,
  updateProject,
  type Issue,
  type Membership,
  type Project,
} from "@/lib/workspace";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Nexus collaborative workspace" },
      {
        name: "description",
        content:
          "Your Nexus dashboard: live cursors, shared comments, team presence, active projects, issues and a resolved-issue activity graph.",
      },
      { property: "og:title", content: "Dashboard — Nexus collaborative workspace" },
      {
        property: "og:description",
        content: "Live cursors, shared comments and team presence in one realtime workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardRoute,
});

function DashboardRoute() {
  const { profile, ready } = useSessionUser();
  if (!ready || !profile) return <Loading />;
  return (
    <AppShell profile={profile}>
      <Dashboard profile={profile} />
    </AppShell>
  );
}

const emptyDraft = { name: "", description: "", tag: "Active", progress: 10 };

function Dashboard({ profile }: { profile: WorkspaceProfile }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [groups, setGroups] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const [issueDraft, setIssueDraft] = useState<Record<string, string>>({});
  const [openIssuesFor, setOpenIssuesFor] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, i, g] = await Promise.all([
        fetchProjects(profile.id),
        fetchIssues(profile.id),
        fetchMemberships(profile.id),
      ]);
      setProjects(p);
      setIssues(i);
      setGroups(g);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load your workspace.");
    }
    setLoading(false);
  }, [profile.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const resolvedDates = useMemo(
    () => issues.filter((i) => i.resolved && i.resolved_at).map((i) => i.resolved_at as string),
    [issues],
  );

  const openIssues = issues.filter((i) => !i.resolved);
  const resolvedThisWeek = resolvedDates.filter(
    (d) => Date.now() - new Date(d).getTime() < 7 * 864e5,
  ).length;

  const stats: [string, string][] = [
    ["Active projects", String(projects.filter((p) => p.status === "active").length)],
    ["Issues resolved", String(resolvedDates.length)],
    ["Open issues", String(openIssues.length)],
    ["Resolved this week", String(resolvedThisWeek)],
  ];

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.name.trim()) return;
    try {
      const row = await createProject(profile.id, {
        name: draft.name.trim(),
        description: draft.description.trim() || "New workspace project",
        tag: draft.tag.trim() || "Active",
        progress: Math.max(0, Math.min(100, Number(draft.progress) || 0)),
      });
      setProjects((prev) => [row, ...prev]);
      setDraft(emptyDraft);
      setShowNew(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the project.");
    }
  }

  async function bumpProgress(p: Project, delta: number) {
    const progress = Math.max(0, Math.min(100, p.progress + delta));
    setProjects((prev) => prev.map((x) => (x.id === p.id ? { ...x, progress } : x)));
    await updateProject(p.id, { progress });
  }

  async function removeProject(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setIssues((prev) => prev.filter((i) => i.project_id !== id));
    await deleteProject(id);
  }

  async function addIssue(projectId: string) {
    const title = (issueDraft[projectId] ?? "").trim();
    if (!title) return;
    const row = await createIssue(profile.id, { project_id: projectId, title });
    setIssues((prev) => [row, ...prev]);
    setIssueDraft((d) => ({ ...d, [projectId]: "" }));
  }

  async function toggleIssue(issue: Issue) {
    const next = !issue.resolved;
    const at = next ? new Date().toISOString() : null;
    setIssues((prev) =>
      prev.map((i) => (i.id === issue.id ? { ...i, resolved: next, resolved_at: at } : i)),
    );
    await setIssueResolved(issue.id, next);
  }

  async function removeIssue(id: string) {
    setIssues((prev) => prev.filter((i) => i.id !== id));
    await deleteIssue(id);
  }

  return (
    <>
      <PageHead
        eyebrow="Dashboard"
        title={`Welcome back, ${profile.display_name}`}
        subtitle={`${openIssues.length} open issue${openIssues.length === 1 ? "" : "s"} across ${projects.length} project${projects.length === 1 ? "" : "s"}. Resolve issues to grow your activity graph.`}
        action={
          <button
            onClick={() => setShowNew(true)}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
          >
            + New project
          </button>
        }
      />

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {showNew && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleCreateProject}
            className="w-full max-w-md animate-scale-in rounded-2xl border border-border bg-card p-6"
          >
            <h2 className="text-lg font-semibold">New project</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Saved to your account — it stays after refresh.
            </p>
            <div className="mt-5 space-y-3">
              <input
                autoFocus
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Project name"
                aria-label="Project name"
                className="h-11 w-full rounded-xl border border-input bg-surface-elevated px-4 text-sm outline-none focus:border-primary"
              />
              <input
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                placeholder="Short description"
                aria-label="Description"
                className="h-11 w-full rounded-xl border border-input bg-surface-elevated px-4 text-sm outline-none focus:border-primary"
              />
              <div className="flex gap-3">
                <input
                  value={draft.tag}
                  onChange={(e) => setDraft({ ...draft, tag: e.target.value })}
                  placeholder="Tag"
                  aria-label="Tag"
                  className="h-11 flex-1 rounded-xl border border-input bg-surface-elevated px-4 text-sm outline-none focus:border-primary"
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={draft.progress}
                  onChange={(e) => setDraft({ ...draft, progress: Number(e.target.value) })}
                  aria-label="Progress"
                  className="h-11 w-28 rounded-xl border border-input bg-surface-elevated px-4 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowNew(false)}
                className="rounded-full border border-border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
              >
                Create project
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-[11px] tracking-widest text-muted-foreground uppercase">{label}</p>
            <p className="mt-3 font-display text-3xl font-bold">
              {value}
              <span className="text-primary">.</span>
            </p>
          </div>
        ))}
      </div>

      <ContributionGraph resolvedDates={resolvedDates} />

      <CollabWorkspace profile={profile} />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section>
          <h2 className="text-lg font-semibold">Active projects</h2>
          {loading ? (
            <p className="mt-4 text-sm text-muted-foreground">Loading projects…</p>
          ) : projects.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No projects yet. Create your first one with “+ New project”.
              </p>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {projects.map((p) => {
                const pIssues = issues.filter((i) => i.project_id === p.id);
                const open = pIssues.filter((i) => !i.resolved).length;
                const expanded = openIssuesFor === p.id;
                return (
                  <article
                    key={p.id}
                    className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-full border border-border px-2.5 py-0.5 text-[10px] tracking-wide text-muted-foreground uppercase">
                        {p.tag}
                      </span>
                      <button
                        onClick={() => void removeProject(p.id)}
                        aria-label={`Delete ${p.name}`}
                        className="text-xs text-muted-foreground transition-colors hover:text-destructive"
                      >
                        Delete
                      </button>
                    </div>
                    <h3 className="mt-4 font-semibold">{p.name}</h3>
                    <p className="text-xs text-muted-foreground">{p.description}</p>
                    <div className="mt-4 flex items-center justify-between text-[11px] tracking-widest text-muted-foreground uppercase">
                      <span>Progress</span>
                      <span className="flex items-center gap-2">
                        <button
                          onClick={() => void bumpProgress(p, -10)}
                          aria-label="Decrease progress"
                          className="rounded-full border border-border px-2 leading-5 hover:border-primary/60"
                        >
                          −
                        </button>
                        {p.progress}%
                        <button
                          onClick={() => void bumpProgress(p, 10)}
                          aria-label="Increase progress"
                          className="rounded-full border border-border px-2 leading-5 hover:border-primary/60"
                        >
                          +
                        </button>
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-elevated">
                      <div
                        className="h-full rounded-full transition-[width] duration-700"
                        style={{ width: `${p.progress}%`, background: "var(--gradient-primary)" }}
                      />
                    </div>

                    <button
                      onClick={() => setOpenIssuesFor(expanded ? null : p.id)}
                      className="mt-4 w-full rounded-xl border border-border px-3 py-2 text-xs transition-colors hover:border-primary/60"
                    >
                      {open} open · {pIssues.length - open} resolved{" "}
                      {expanded ? "— hide issues" : "— manage issues"}
                    </button>

                    {expanded && (
                      <div className="mt-3 space-y-2">
                        {pIssues.map((i) => (
                          <div
                            key={i.id}
                            className="flex items-center gap-2 rounded-lg border border-border bg-surface-elevated px-3 py-2"
                          >
                            <button
                              onClick={() => void toggleIssue(i)}
                              aria-label={i.resolved ? "Reopen issue" : "Resolve issue"}
                              className={`size-4 shrink-0 rounded-full border ${i.resolved ? "border-primary bg-primary" : "border-muted-foreground"}`}
                            />
                            <span
                              className={`flex-1 text-xs ${i.resolved ? "text-muted-foreground line-through" : ""}`}
                            >
                              {i.title}
                            </span>
                            <button
                              onClick={() => void removeIssue(i.id)}
                              aria-label="Delete issue"
                              className="text-[11px] text-muted-foreground hover:text-destructive"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            void addIssue(p.id);
                          }}
                          className="flex gap-2"
                        >
                          <input
                            value={issueDraft[p.id] ?? ""}
                            onChange={(e) =>
                              setIssueDraft((d) => ({ ...d, [p.id]: e.target.value }))
                            }
                            placeholder="New issue…"
                            aria-label={`New issue for ${p.name}`}
                            className="h-9 flex-1 rounded-lg border border-input bg-surface-elevated px-3 text-xs outline-none focus:border-primary"
                          />
                          <button
                            type="submit"
                            className="rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground"
                          >
                            Add
                          </button>
                        </form>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <div className="space-y-6">
          <aside className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Today&apos;s focus</h2>
              <span className="text-xs text-muted-foreground">{openIssues.length} open</span>
            </div>
            {openIssues.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Nothing open — add issues to a project to plan your day.
              </p>
            ) : (
              <ul className="mt-4 space-y-2">
                {openIssues.slice(0, 6).map((i) => {
                  const project = projects.find((p) => p.id === i.project_id);
                  return (
                    <li key={i.id}>
                      <button
                        onClick={() => void toggleIssue(i)}
                        className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface-elevated p-3 text-left transition-colors hover:border-primary/50"
                      >
                        <span className="size-4 shrink-0 rounded-full border border-muted-foreground" />
                        <span className="flex-1">
                          <span className="block text-sm">{i.title}</span>
                          <span className="block text-xs text-muted-foreground">
                            {project?.name ?? "No project"}
                          </span>
                        </span>
                        <span className="rounded-md bg-card px-2 py-0.5 text-[10px] tracking-wide text-accent uppercase">
                          {i.priority}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>

          <aside className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Your groups</h2>
              <Link to="/groups" className="text-xs text-primary hover:underline">
                Browse →
              </Link>
            </div>
            {groups.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                You haven&apos;t joined a group yet. Joined groups show up right here.
              </p>
            ) : (
              <ul className="mt-4 space-y-2">
                {groups.map((g) => (
                  <li
                    key={g.id}
                    className="flex items-center gap-2 rounded-xl border border-border bg-surface-elevated px-3 py-2 text-sm"
                  >
                    <span className="size-1.5 rounded-full bg-primary" />
                    {g.group_name}
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
