const API_BASE = "http://localhost:5000/api/v1";

export type Project = {
  id: string;
  name: string;
  description: string;
  tag: string;
  progress: number;
  status: string;
  created_at: string;
};

export type Issue = {
  id: string;
  project_id: string | null;
  title: string;
  priority: string;
  resolved: boolean;
  resolved_at: string | null;
};

export type Membership = { id: string; group_key: string; group_name: string };

const DEMO_PROJECTS: Project[] = [
  {
    id: "p1",
    name: "Mobile App Redesign",
    description: "Ultra smooth React Native mobile UI with MongoDB backend.",
    tag: "Active",
    progress: 85,
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    id: "p2",
    name: "MongoDB Express API",
    description: "Express.js Mongoose models & controllers for live data sync.",
    tag: "In Progress",
    progress: 60,
    status: "active",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const DEMO_ISSUES: Issue[] = [
  { id: "i1", project_id: "p1", title: "Connect Mongoose schemas to React Native App", priority: "High", resolved: false, resolved_at: null },
  { id: "i2", project_id: "p1", title: "Add MongoDB auth controller", priority: "Medium", resolved: true, resolved_at: new Date().toISOString() },
];

export async function fetchProjects(_userId: string): Promise<Project[]> {
  try {
    const res = await fetch(`${API_BASE}/projects`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((p: any) => ({
        id: p._id || p.id,
        name: p.name,
        description: p.description,
        tag: p.tag,
        progress: p.progress,
        status: p.status,
        created_at: p.createdAt || p.created_at,
      }));
    }
  } catch (e) {
    console.log("[MongoDB API] Projects fetch fallback:", e);
  }
  return DEMO_PROJECTS;
}

export async function createProject(
  _userId: string,
  input: { name: string; description: string; tag: string; progress: number },
): Promise<Project> {
  try {
    const res = await fetch(`${API_BASE}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const json = await res.json();
    if (json.success && json.data) {
      const p = json.data;
      return {
        id: p._id || p.id,
        name: p.name,
        description: p.description,
        tag: p.tag,
        progress: p.progress,
        status: p.status,
        created_at: p.createdAt,
      };
    }
  } catch (e) {
    console.log("[MongoDB API] Create project fallback:", e);
  }
  return { id: `p_${Date.now()}`, ...input, status: "active", created_at: new Date().toISOString() };
}

export async function updateProject(id: string, patch: Partial<Project>) {
  try {
    await fetch(`${API_BASE}/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  } catch (e) {
    console.log("[MongoDB API] Update project fallback:", e);
  }
}

export async function deleteProject(id: string) {
  try {
    await fetch(`${API_BASE}/projects/${id}`, { method: "DELETE" });
  } catch (e) {
    console.log("[MongoDB API] Delete project fallback:", e);
  }
}

export async function fetchIssues(_userId: string): Promise<Issue[]> {
  try {
    const res = await fetch(`${API_BASE}/issues`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((i: any) => ({
        id: i._id || i.id,
        project_id: i.projectId || i.project_id,
        title: i.title,
        priority: i.priority,
        resolved: i.resolved,
        resolved_at: i.resolvedAt || i.resolved_at,
      }));
    }
  } catch (e) {
    console.log("[MongoDB API] Issues fetch fallback:", e);
  }
  return DEMO_ISSUES;
}

export async function createIssue(
  _userId: string,
  input: { project_id: string | null; title: string; priority?: string },
): Promise<Issue> {
  try {
    const res = await fetch(`${API_BASE}/issues`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: input.title, priority: input.priority || "Medium", projectId: input.project_id }),
    });
    const json = await res.json();
    if (json.success && json.data) {
      const i = json.data;
      return {
        id: i._id || i.id,
        project_id: i.projectId,
        title: i.title,
        priority: i.priority,
        resolved: i.resolved,
        resolved_at: i.resolvedAt,
      };
    }
  } catch (e) {
    console.log("[MongoDB API] Create issue fallback:", e);
  }
  return { id: `i_${Date.now()}`, project_id: input.project_id, title: input.title, priority: input.priority || "Medium", resolved: false, resolved_at: null };
}

export async function setIssueResolved(id: string, _resolved: boolean) {
  try {
    await fetch(`${API_BASE}/issues/${id}/toggle`, { method: "PATCH" });
  } catch (e) {
    console.log("[MongoDB API] Set issue resolved fallback:", e);
  }
  return new Date().toISOString();
}

export async function deleteIssue(id: string) {
  try {
    await fetch(`${API_BASE}/issues/${id}`, { method: "DELETE" });
  } catch (e) {
    console.log("[MongoDB API] Delete issue fallback:", e);
  }
}

export async function fetchMemberships(_userId: string): Promise<Membership[]> {
  return [
    { id: "g1", group_key: "designers", group_name: "Design Crafters" },
    { id: "g2", group_key: "engineers", group_name: "Frontend Engineers" },
  ];
}

export async function joinGroup(_userId: string, key: string, name: string): Promise<Membership> {
  return { id: `g_${Date.now()}`, group_key: key, group_name: name };
}

export async function leaveGroup(_userId: string, _key: string) {
  // Group leave helper
}
