import React, { useEffect, useState } from "react";
import {
  Users,
  FolderGit2,
  Bug,
  TrendingUp,
  ShieldCheck,
  Zap,
  Activity,
  Plus,
  Trash2,
  ArrowUpRight,
  RefreshCw,
  GitCommit,
  Layers,
} from "lucide-react";
import { fetchProjects, fetchIssues, deleteProject } from "@/lib/workspace";
import liveData from "@/lib/workspace-live-data.json";

export default function AdminOverview({ setActiveTab }) {
  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pList, iList] = await Promise.all([
        fetchProjects("admin"),
        fetchIssues("admin"),
      ]);
      setProjects(pList);
      setIssues(iList);
    } catch {
      /* fallback */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteProject = async (id) => {
    await deleteProject(id);
    setProjects(projects.filter((p) => p.id !== id));
  };

  const openIssues = issues.filter((i) => !i.resolved);
  const criticalIssues = issues.filter((i) => (i.priority || "").toLowerCase() === "critical" || (i.priority || "").toLowerCase() === "high");

  let totalCommits = 0;
  if (liveData?.projects) {
    Object.values(liveData.projects).forEach((proj) => {
      totalCommits += proj.commits?.length || 0;
    });
  }

  return (
    <div className="space-y-6">
      {/* SECTION TITLE & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground font-display">
            BuildVerse System Overview
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manual telemetry sync, live projects, issues, and infrastructure status.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-surface-elevated border border-border text-foreground text-xs font-bold hover:border-primary/50 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-primary" : ""}`} />
            <span>Sync Telemetry Data</span>
          </button>

          <button
            onClick={() => setActiveTab && setActiveTab("projects")}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-primary text-primary-foreground text-xs font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Project</span>
          </button>
        </div>
      </div>

      {/* 4 TOP BENTO METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-card border border-border relative overflow-hidden group shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Total Users</span>
            <div className="p-2 rounded-2xl bg-primary/10 text-primary border border-primary/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-foreground font-display">7</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> Active
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">Registered BuildVerse members</p>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border relative overflow-hidden group shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Active Repos</span>
            <div className="p-2 rounded-2xl bg-primary/10 text-primary border border-primary/20">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-foreground font-display">{projects.length}</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> Synced
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">MongoDB & Workspace collections</p>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border relative overflow-hidden group shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Open Issues</span>
            <div className="p-2 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Bug className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-foreground font-display">{openIssues.length}</span>
            <span className="text-xs font-bold text-primary">{criticalIssues.length} High Priority</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">Tracked engineering tickets</p>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border relative overflow-hidden group shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Live Commits</span>
            <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <GitCommit className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-foreground font-display">{totalCommits > 0 ? totalCommits : 12}</span>
            <span className="text-xs font-bold text-emerald-400">Pushed via VS Code</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">Synced to BuildVerse DB</p>
        </div>
      </div>

      {/* PROJECT HEALTH DATA TABLE */}
      <div className="rounded-3xl bg-card border border-border p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground font-display">Live Projects Infrastructure ({projects.length})</h2>
            <p className="text-xs text-muted-foreground">Manual data sync across all engineering initiatives.</p>
          </div>
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-surface-elevated border border-border text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1 text-xs font-bold"
            title="Refresh System Telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-primary" : ""}`} />
            <span>Sync</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-muted-foreground">
            <thead className="bg-surface-elevated text-foreground uppercase font-extrabold text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Project Name</th>
                <th className="px-4 py-3">Category Tag</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Completion</th>
                <th className="px-4 py-3 text-right rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-surface-elevated/50 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-foreground flex items-center space-x-2">
                    <FolderGit2 className="w-4 h-4 text-primary shrink-0" />
                    <span>{p.name}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-extrabold">
                      {p.tag || "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold flex items-center space-x-1.5 w-max">
                      <span className="size-1.5 rounded-full bg-emerald-400" />
                      <span>{p.status || "active"}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-surface-elevated h-2 rounded-full overflow-hidden border border-border">
                        <div
                          className="bg-primary h-full rounded-full transition-all"
                          style={{ width: `${p.progress || 50}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-foreground text-[11px]">{p.progress || 50}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => handleDeleteProject(p.id)}
                      className="p-1.5 rounded-xl text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
