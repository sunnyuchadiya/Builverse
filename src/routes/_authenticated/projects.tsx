import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Loading, PageHead } from "@/components/app/AppShell";
import { useSessionUser, type WorkspaceProfile } from "@/lib/session";
import {
  createProject,
  fetchIssues,
  fetchProjects,
  type Issue,
  type Project,
} from "@/lib/workspace";
import { createCommit, upsertFile } from "@/lib/repo";
import { RepoPanel } from "@/components/app/RepoPanel";

export const Route = createFileRoute("/_authenticated/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Nexus code repositories" },
      {
        name: "description",
        content:
          "Every Nexus project as a live repository: browse files, edit code in the browser, commit changes and track open issues.",
      },
      { property: "og:title", content: "Projects — Nexus code repositories" },
      {
        property: "og:description",
        content: "Browse files, edit code and commit — all inside your Nexus workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectsPage,
});

const FILTERS = ["All", "Active", "In review", "Shipped"] as const;

const STARTER = (name: string) => [
  {
    path: "README.md",
    content: `# ${name}\n\nWelcome to the ${name} repository.\n\n- Edit any file in the browser\n- Hit **Commit changes** to save a new commit\n`,
  },
  {
    path: "src/index.js",
    content: `export function boot() {\n  console.log("${name} is running");\n}\n\nboot();\n`,
  },
];

function ProjectsPage() {
  const { profile, ready } = useSessionUser();
  if (!ready || !profile) return <Loading />;
  return (
    <AppShell profile={profile}>
      <ProjectsBoard profile={profile} />
    </AppShell>
  );
}

function ProjectsBoard({ profile }: { profile: WorkspaceProfile }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [p, i] = await Promise.all([fetchProjects(profile.id), fetchIssues(profile.id)]);
      setProjects(p);
      setIssues(i);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load projects.");
    }
    setLoading(false);
  }, [profile.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const list = useMemo(
    () =>
      projects
        .filter((p) => (filter === "All" ? true : p.tag === filter))
        .filter((p) =>
          (p.name + p.description + p.tag).toLowerCase().includes(query.toLowerCase()),
        ),
    [projects, filter, query],
  );

  const open = projects.find((p) => p.id === openId) ?? null;

  return (
    <>
      <PageHead
        eyebrow="Projects"
        title="Everything you are building"
        subtitle="Each project is a real repository — browse the file tree, edit code in the browser and commit changes."
        action={
          <button
            onClick={() => setCreating(true)}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
          >
            + New project
          </button>
        }
      />

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                filter === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects…"
          aria-label="Search projects"
          className="ml-auto w-full max-w-xs rounded-full border border-border bg-card px-4 py-2 text-sm outline-none focus:border-primary/60"
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => {
          const openIssues = issues.filter((i) => i.project_id === p.id && !i.resolved).length;
          return (
            <article
              key={p.id}
              className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/50"
            >
              <div className="flex items-start justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-surface-elevated text-sm font-bold transition-colors group-hover:bg-primary/20">
                  {p.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="rounded-full border border-border px-2.5 py-0.5 text-[10px] tracking-wide text-muted-foreground uppercase">
                  {p.tag}
                </span>
              </div>
              <h2 className="mt-4 font-semibold">{p.name}</h2>
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {p.description || "No description yet."}
              </p>
              <div className="mt-4 flex items-center justify-between text-[11px] tracking-widest text-muted-foreground uppercase">
                <span>{openIssues} open issues</span>
                <span>{p.progress}%</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-elevated">
                <div
                  className="h-full rounded-full transition-[width] duration-700"
                  style={{ width: `${p.progress}%`, background: "var(--gradient-primary)" }}
                />
              </div>
              <button
                onClick={() => setOpenId(p.id)}
                className="mt-4 w-full rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-primary/60"
              >
                Open repository →
              </button>
            </article>
          );
        })}
        {!loading && list.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No projects yet — create one to start a repository.
          </p>
        )}
      </div>

      {open && (
        <RepoPanel
          key={open.id}
          profile={profile}
          project={open}
          onClose={() => setOpenId(null)}
        />
      )}

      {creating && (
        <NewProject
          onClose={() => setCreating(false)}
          onCreate={async (input) => {
            const row = await createProject(profile.id, input);
            setProjects((prev) => [row, ...prev]);
            for (const f of STARTER(row.name)) {
              await upsertFile(profile.id, row.id, f.path, f.content);
            }
            await createCommit(profile.id, row.id, {
              author_name: profile.display_name,
              message: "Initial commit",
              additions: 12,
              deletions: 0,
            });
            setCreating(false);
            setOpenId(row.id);
          }}
        />
      )}
    </>
  );
}

function NewProject({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (input: {
    name: string;
    description: string;
    tag: string;
    progress: number;
  }) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("Active");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setErr("");
    try {
      await onCreate({ name: name.trim(), description: description.trim(), tag, progress: 0 });
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Could not create the project.");
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur">
      <form
        onSubmit={submit}
        className="w-full max-w-md space-y-3 rounded-2xl border border-border bg-card p-6"
      >
        <h2 className="text-lg font-semibold">New project</h2>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project name"
          aria-label="Project name"
          className="w-full rounded-xl border border-border bg-surface-elevated px-4 py-2.5 text-sm outline-none focus:border-primary/60"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is it about?"
          aria-label="Description"
          rows={3}
          className="w-full rounded-xl border border-border bg-surface-elevated px-4 py-2.5 text-sm outline-none focus:border-primary/60"
        />
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          aria-label="Status"
          className="w-full rounded-xl border border-border bg-surface-elevated px-4 py-2.5 text-sm outline-none focus:border-primary/60"
        >
          <option>Active</option>
          <option>In review</option>
          <option>Shipped</option>
        </select>
        {err && <p className="text-sm text-destructive">{err}</p>}
        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border px-4 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Creating…" : "Create repository"}
          </button>
        </div>
      </form>
    </div>
  );
}
