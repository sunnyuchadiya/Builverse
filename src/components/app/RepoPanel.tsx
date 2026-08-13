import { useEffect, useMemo, useState } from "react";
import { CodeEditor } from "@/components/app/CodeEditor";
import { FileTree } from "@/components/app/FileTree";
import { lineDiff } from "@/lib/highlight";
import type { WorkspaceProfile } from "@/lib/session";
import type { Project } from "@/lib/workspace";
import {
  createCommit,
  deleteFile,
  fetchCommits,
  fetchFiles,
  languageFor,
  upsertFile,
  type Commit,
  type RepoFile,
} from "@/lib/repo";

type Tab = "code" | "history";

export function RepoPanel({
  profile,
  project,
  onClose,
}: {
  profile: WorkspaceProfile;
  project: Project;
  onClose: () => void;
}) {
  const [files, setFiles] = useState<RepoFile[]>([]);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [activePath, setActivePath] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState<Tab>("code");
  const [openCommit, setOpenCommit] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const active = files.find((f) => f.path === activePath) ?? null;
  const draft = activePath ? (drafts[activePath] ?? active?.content ?? "") : "";

  const dirtyPaths = useMemo(() => {
    const set = new Set<string>();
    for (const f of files) if (drafts[f.path] !== undefined && drafts[f.path] !== f.content) set.add(f.path);
    return set;
  }, [files, drafts]);

  useEffect(() => {
    let on = true;
    void (async () => {
      try {
        const [f, c] = await Promise.all([fetchFiles(project.id), fetchCommits(project.id)]);
        if (!on) return;
        setFiles(f);
        setCommits(c);
        if (f.length) {
          setOpenTabs([f[0].path]);
          setActivePath(f[0].path);
        }
      } catch (e) {
        if (on) setErr(e instanceof Error ? e.message : "Could not load the repository.");
      }
    })();
    return () => {
      on = false;
    };
  }, [project.id]);

  function openFile(f: RepoFile) {
    setTab("code");
    setActivePath(f.path);
    setOpenTabs((prev) => (prev.includes(f.path) ? prev : [...prev, f.path]));
  }

  function closeTab(path: string) {
    setOpenTabs((prev) => {
      const next = prev.filter((p) => p !== path);
      if (activePath === path) setActivePath(next[next.length - 1] ?? null);
      return next;
    });
  }

  async function commit() {
    if (!active) return;
    setBusy(true);
    setErr("");
    try {
      const rows = lineDiff(active.content, draft);
      const additions = rows.filter((r) => r.type === "add").length;
      const deletions = rows.filter((r) => r.type === "del").length;
      const patch = rows
        .filter((r) => r.type !== "same")
        .map((r) => (r.type === "add" ? "+" : "-") + r.text)
        .slice(0, 200)
        .join("\n");
      const saved = await upsertFile(profile.id, project.id, active.path, draft);
      setFiles((prev) => prev.map((f) => (f.path === saved.path ? saved : f)));
      setDrafts((prev) => ({ ...prev, [saved.path]: saved.content }));
      const c = await createCommit(profile.id, project.id, {
        author_name: profile.display_name,
        message: message.trim() || `Update ${active.path}`,
        additions,
        deletions,
        path: active.path,
        patch,
      });
      setCommits((prev) => [c, ...prev]);
      setMessage("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Commit failed.");
    }
    setBusy(false);
  }

  async function addFile() {
    const path = window.prompt("New file path", "src/new-file.ts");
    if (!path) return;
    setErr("");
    try {
      const f = await upsertFile(profile.id, project.id, path.trim(), "");
      setFiles((prev) =>
        [...prev.filter((x) => x.path !== f.path), f].sort((a, b) => a.path.localeCompare(b.path)),
      );
      openFile(f);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not create the file.");
    }
  }

  async function removeFile(f: RepoFile) {
    if (!window.confirm(`Delete ${f.path}?`)) return;
    await deleteFile(f.id);
    setFiles((prev) => prev.filter((x) => x.id !== f.id));
    closeTab(f.path);
  }

  const totals = commits.reduce(
    (acc, c) => ({ add: acc.add + c.additions, del: acc.del + c.deletions }),
    { add: 0, del: 0 },
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background/95 p-4 backdrop-blur-xl md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs tracking-widest text-primary uppercase">Repository</p>
            <h2 className="mt-1 text-2xl font-bold">
              {profile.display_name.toLowerCase().replace(/\s+/g, "-")} / {project.name}
            </h2>
            <p className="text-xs text-muted-foreground">
              main · {files.length} files · {commits.length} commits ·{" "}
              <span className="text-primary">+{totals.add}</span>{" "}
              <span className="text-destructive">-{totals.del}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-full border border-border p-1 text-xs">
              {(["code", "history"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-full px-3 py-1.5 capitalize transition-colors ${
                    tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              onClick={onClose}
              className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-primary/60"
            >
              Close
            </button>
          </div>
        </div>

        {err && <p className="mt-3 text-sm text-destructive">{err}</p>}

        {tab === "code" ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-[240px_1fr]">
            <aside className="max-h-[70vh] overflow-y-auto rounded-2xl border border-border bg-card p-3">
              <div className="flex items-center justify-between px-2 pb-2">
                <p className="text-[11px] tracking-widest text-muted-foreground uppercase">Files</p>
                <button onClick={() => void addFile()} className="text-xs text-primary">
                  + add
                </button>
              </div>
              <FileTree
                files={files}
                activePath={activePath}
                dirtyPaths={dirtyPaths}
                onOpen={openFile}
                onDelete={(f) => void removeFile(f)}
              />
              {files.length === 0 && (
                <p className="px-2 text-xs text-muted-foreground">Empty repo — add a file.</p>
              )}
            </aside>

            <section className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="hide-scrollbar flex items-stretch gap-1 overflow-x-auto border-b border-border bg-surface-elevated/40 px-2 pt-2">
                {openTabs.map((path) => (
                  <div
                    key={path}
                    className={`flex items-center gap-2 rounded-t-lg border-t border-r border-l px-3 py-2 font-mono text-xs transition-colors ${
                      activePath === path
                        ? "border-border bg-card text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <button onClick={() => setActivePath(path)} className="whitespace-nowrap">
                      {path.split("/").pop()}
                      {dirtyPaths.has(path) && <span className="ml-1.5 text-primary">•</span>}
                    </button>
                    <button
                      onClick={() => closeTab(path)}
                      aria-label={`Close ${path}`}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {openTabs.length === 0 && (
                  <span className="px-3 py-2 text-xs text-muted-foreground">No file open</span>
                )}
              </div>

              <header className="flex items-center justify-between border-b border-border px-4 py-2 text-xs">
                <span className="truncate font-mono text-muted-foreground">
                  {active ? active.path : "Select a file from the tree"}
                </span>
                <span className="shrink-0 text-muted-foreground">
                  {active ? languageFor(active.path) : ""}
                  {active && dirtyPaths.has(active.path) ? " · unsaved" : ""}
                </span>
              </header>

              {active ? (
                <CodeEditor
                  path={active.path}
                  value={draft}
                  onChange={(next) => setDrafts((prev) => ({ ...prev, [active.path]: next }))}
                />
              ) : (
                <div className="grid h-64 place-items-center text-sm text-muted-foreground">
                  Open a file to start editing.
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 border-t border-border p-3">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Commit message"
                  aria-label="Commit message"
                  className="min-w-0 flex-1 rounded-full border border-border bg-surface-elevated px-4 py-2 text-sm outline-none focus:border-primary/60"
                />
                <button
                  onClick={() => void commit()}
                  disabled={!active || busy}
                  className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                >
                  {busy ? "Committing…" : "Commit changes"}
                </button>
              </div>
            </section>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {commits.map((c) => {
              const open = openCommit === c.id;
              return (
                <article key={c.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                  <button
                    onClick={() => setOpenCommit(open ? null : c.id)}
                    aria-expanded={open}
                    className="flex w-full flex-wrap items-center gap-3 px-5 py-4 text-left"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-elevated text-[11px] font-bold">
                      {c.author_name.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{c.message}</span>
                      <span className="block text-[11px] text-muted-foreground">
                        {c.author_name} committed {new Date(c.created_at).toLocaleString()}
                        {c.path ? ` · ${c.path}` : ""}
                      </span>
                    </span>
                    <span className="font-mono text-[11px]">
                      <span className="text-primary">+{c.additions}</span>{" "}
                      <span className="text-destructive">-{c.deletions}</span>
                    </span>
                    <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                      {c.id.slice(0, 7)}
                    </span>
                  </button>
                  {open && (
                    <pre className="max-h-72 overflow-auto border-t border-border bg-background/50 p-4 font-mono text-xs leading-6">
                      {(c.patch || "No diff recorded for this commit.").split("\n").map((line, i) => (
                        <div
                          key={i}
                          className={
                            line.startsWith("+")
                              ? "bg-primary/10 text-primary"
                              : line.startsWith("-")
                                ? "bg-destructive/10 text-destructive"
                                : "text-muted-foreground"
                          }
                        >
                          {line || " "}
                        </div>
                      ))}
                    </pre>
                  )}
                </article>
              );
            })}
            {commits.length === 0 && (
              <p className="text-sm text-muted-foreground">No commits yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
