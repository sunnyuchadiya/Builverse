const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_BACKEND_URL)
    ? `${import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "")}/api/v1`
    : "http://localhost:5000/api/v1";

const DEMO_PROJECTS = [
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

const DEMO_ISSUES = [
  { id: "JIRA-101", project_id: "p1", title: "Setup MongoDB Indexing & Mongoose Schemas", priority: "Critical", status: "todo", assignee: "Elias Thorne", resolved: false, resolved_at: null },
  { id: "JIRA-102", project_id: "p1", title: "Live Group Sync to Chat Channels", priority: "High", status: "in_progress", assignee: "Alex Chen", resolved: false, resolved_at: null },
  { id: "JIRA-103", project_id: "p1", title: "Dark Mode Glassmorphism Tokens", priority: "Medium", status: "in_review", assignee: "Sarah Chen", resolved: false, resolved_at: null },
  { id: "JIRA-104", project_id: "p1", title: "User & Admin JWT Authentication", priority: "High", status: "done", assignee: "Elias Thorne", resolved: true, resolved_at: new Date().toISOString() },
  { id: "JIRA-105", project_id: "p1", title: "WebGPU Render Pipeline Optimization", priority: "Medium", status: "in_progress", assignee: "Erik Solberg", resolved: false, resolved_at: null },
  { id: "JIRA-106", project_id: "p1", title: "Mentor Office Hours Scheduler", priority: "Low", status: "todo", assignee: "Elena Rostova", resolved: false, resolved_at: null },
];

const DEMO_COURSES = [
  {
    id: "c1",
    title: "Design Systems 2.0 & Token Architecture",
    slug: "design-systems-2.0",
    level: "Core",
    summary: "Master design tokens, glassmorphic UI components, and scalable design systems.",
    lessonsCount: 3,
    mentor: "Elias Thorne",
    videoUrl: "https://www.youtube.com/embed/g2nMKzhkvxA",
    lessons: [
      { id: "l1", title: "01. Introduction to Design Tokens & Tailwind v4", duration: "12:45", videoUrl: "https://www.youtube.com/embed/g2nMKzhkvxA", completed: true },
      { id: "l2", title: "02. Building Glassmorphism Components in React", duration: "18:20", videoUrl: "https://www.youtube.com/embed/g2nMKzhkvxA", completed: true },
      { id: "l3", title: "03. Animation Primitives & Accessible Micro-interactions", duration: "15:10", videoUrl: "https://www.youtube.com/embed/g2nMKzhkvxA", completed: false },
    ],
    certificateEarned: false,
    isEnrolled: true,
  },
  {
    id: "c2",
    title: "Web & Mobile Design System Architecture",
    slug: "web-mobile-design-architecture",
    level: "Advanced",
    summary: "Learn layout grid mechanics, typography rhythm, and cross-platform UI engineering.",
    lessonsCount: 2,
    mentor: "Sarah Chen",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    lessons: [
      { id: "l4", title: "01. Responsive Grid & Touch Targets", duration: "14:00", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", completed: true },
      { id: "l5", title: "02. Multi-platform React Native Layout Sync", duration: "22:15", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", completed: true },
    ],
    certificateEarned: true,
    isEnrolled: true,
  },
  {
    id: "c3",
    title: "Rust & WebGPU High Performance 3D Engine",
    slug: "rust-webgpu-high-performance-rendering",
    level: "New",
    summary: "Build high-throughput WebGPU rendering pipelines with WGSL shaders in Rust.",
    lessonsCount: 2,
    mentor: "Erik Solberg",
    videoUrl: "https://www.youtube.com/embed/g2nMKzhkvxA",
    lessons: [
      { id: "l6", title: "01. WebGPU Context Initialization & Buffer Management", duration: "25:30", videoUrl: "https://www.youtube.com/embed/g2nMKzhkvxA", completed: false },
      { id: "l7", title: "02. WGSL Shaders & Realtime Lighting Effects", duration: "30:10", videoUrl: "https://www.youtube.com/embed/g2nMKzhkvxA", completed: false },
    ],
    certificateEarned: false,
    isEnrolled: false,
  },
];

const LOCAL_STORAGE_PROJECTS_KEY = "buildverse_custom_projects";
const LOCAL_STORAGE_ISSUES_KEY = "buildverse_custom_issues";
const LOCAL_STORAGE_COURSES_KEY = "buildverse_custom_courses";
const LOCAL_STORAGE_ENROLLED_KEY = "buildverse_enrolled_courses";

// Helper Functions
function getLocalProjects() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalProjects(list) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(list));
  } catch {
    /* fallback */
  }
}

function getLocalIssues() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ISSUES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalIssues(list) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_ISSUES_KEY, JSON.stringify(list));
  } catch {
    /* fallback */
  }
}

function getLocalCourses() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_COURSES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCourses(list) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_COURSES_KEY, JSON.stringify(list));
  } catch {
    /* fallback */
  }
}

function getEnrolledIds() {
  if (typeof window === "undefined") return ["c1", "c2"];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ENROLLED_KEY);
    return raw ? JSON.parse(raw) : ["c1", "c2"];
  } catch {
    return ["c1", "c2"];
  }
}

function saveEnrolledIds(ids) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_ENROLLED_KEY, JSON.stringify(ids));
  } catch {
    /* fallback */
  }
}

// PROJECTS
export async function fetchProjects(_userId) {
  let apiProjects = [];
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 800);
    const res = await fetch(`${API_BASE}/projects`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        apiProjects = json.data.map((p) => ({
          id: p._id || p.id,
          name: p.name,
          description: p.description,
          tag: p.tag || "Active",
          progress: p.progress || 20,
          status: p.status || "active",
          created_at: p.createdAt || p.created_at || new Date().toISOString(),
        }));
      }
    }
  } catch {
    /* Silent fallback */
  }

  const localProjects = getLocalProjects();
  const mergedMap = new Map();

  [...apiProjects, ...localProjects, ...DEMO_PROJECTS].forEach((p) => {
    const key = (p.id || p.name).toLowerCase();
    if (!mergedMap.has(key)) {
      mergedMap.set(key, p);
    }
  });

  return Array.from(mergedMap.values());
}

export async function createProject(_userId, input) {
  let createdProject = null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);
    const res = await fetch(`${API_BASE}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const p = json.data;
        createdProject = {
          id: p._id || p.id,
          name: p.name,
          description: p.description,
          tag: p.tag || input.tag || "Active",
          progress: p.progress || input.progress || 10,
          status: p.status || "active",
          created_at: p.createdAt || new Date().toISOString(),
        };
      }
    }
  } catch {
    /* Silent fallback */
  }

  if (!createdProject) {
    createdProject = {
      id: `p_${Date.now()}`,
      name: input.name,
      description: input.description || "New workspace project",
      tag: input.tag || "Active",
      progress: input.progress || 10,
      status: "active",
      created_at: new Date().toISOString(),
    };
  }

  const currentLocal = getLocalProjects();
  const updatedLocal = [createdProject, ...currentLocal.filter((p) => p.name !== createdProject?.name)];
  saveLocalProjects(updatedLocal);

  return createdProject;
}

export async function updateProject(id, patch) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);
    await fetch(`${API_BASE}/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
  } catch {
    /* Silent fallback */
  }

  const current = getLocalProjects();
  const updated = current.map((p) => (p.id === id ? { ...p, ...patch } : p));
  saveLocalProjects(updated);
}

export async function deleteProject(id) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);
    await fetch(`${API_BASE}/projects/${id}`, { method: "DELETE", signal: controller.signal });
    clearTimeout(timeoutId);
  } catch {
    /* Silent fallback */
  }

  const current = getLocalProjects();
  const updated = current.filter((p) => p.id !== id);
  saveLocalProjects(updated);
}

// ISSUES / JIRA TICKETS
export async function fetchIssues(_userId) {
  let apiIssues = [];
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 800);
    const res = await fetch(`${API_BASE}/issues`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        apiIssues = json.data.map((i) => ({
          id: i.jiraId || i._id || i.id,
          project_id: i.projectId || i.project_id,
          title: i.title,
          priority: i.priority || "Medium",
          status: i.status || (i.resolved ? "done" : "todo"),
          assignee: i.assignee || "Elias Thorne",
          resolved: i.resolved || i.status === "done" || false,
          resolved_at: i.resolvedAt || i.resolved_at,
        }));
      }
    }
  } catch {
    /* Silent fallback */
  }

  const localIssues = getLocalIssues();
  const mergedMap = new Map();

  [...apiIssues, ...localIssues, ...DEMO_ISSUES].forEach((i) => {
    const key = (i.id || i.title).toLowerCase();
    if (!mergedMap.has(key)) {
      mergedMap.set(key, i);
    }
  });

  return Array.from(mergedMap.values());
}

export async function createIssue(_userId, input) {
  let created = null;
  const isDone = input.status === "done";
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);
    const res = await fetch(`${API_BASE}/issues`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: input.title,
        priority: input.priority || "Medium",
        projectId: input.project_id,
        status: input.status || "todo",
        assignee: input.assignee || "Elias Thorne",
        resolved: isDone,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const i = json.data;
        created = {
          id: i.jiraId || i._id || i.id,
          project_id: i.projectId,
          title: i.title,
          priority: i.priority || "Medium",
          status: i.status || "todo",
          assignee: i.assignee || "Elias Thorne",
          resolved: i.resolved || isDone,
          resolved_at: i.resolvedAt,
        };
      }
    }
  } catch {
    /* Silent fallback */
  }

  if (!created) {
    created = {
      id: `JIRA-${Math.floor(100 + Math.random() * 900)}`,
      project_id: input.project_id || null,
      title: input.title,
      priority: input.priority || "Medium",
      status: input.status || "todo",
      assignee: input.assignee || "Elias Thorne",
      resolved: isDone,
      resolved_at: isDone ? new Date().toISOString() : null,
    };
  }

  const currentLocal = getLocalIssues();
  saveLocalIssues([created, ...currentLocal]);

  return created;
}

export async function updateIssueStatus(id, nextStatus) {
  const isDone = nextStatus === "done";
  const current = getLocalIssues();
  const updated = current.map((i) =>
    i.id === id ? { ...i, status: nextStatus, resolved: isDone, resolved_at: isDone ? new Date().toISOString() : null } : i
  );
  saveLocalIssues(updated);
}

export async function setIssueResolved(id, resolved) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);
    await fetch(`${API_BASE}/issues/${id}/toggle`, { method: "PATCH", signal: controller.signal });
    clearTimeout(timeoutId);
  } catch {
    /* Silent fallback */
  }

  const current = getLocalIssues();
  const updated = current.map((i) =>
    i.id === id
      ? {
          ...i,
          resolved,
          status: resolved ? "done" : "todo",
          resolved_at: resolved ? new Date().toISOString() : null,
        }
      : i
  );
  saveLocalIssues(updated);

  return new Date().toISOString();
}

export async function deleteIssue(id) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);
    await fetch(`${API_BASE}/issues/${id}`, { method: "DELETE", signal: controller.signal });
    clearTimeout(timeoutId);
  } catch {
    /* Silent fallback */
  }

  const current = getLocalIssues();
  saveLocalIssues(current.filter((i) => i.id !== id));
}

// COURSES WITH LESSONS, ENROLLMENT & CERTIFICATES
export async function fetchCourses() {
  let apiCourses = [];
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 800);
    const res = await fetch(`${API_BASE}/courses`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        apiCourses = json.data;
      }
    }
  } catch {
    /* Silent fallback */
  }

  const localCourses = getLocalCourses();
  const enrolledIds = getEnrolledIds();
  const mergedMap = new Map();

  [...apiCourses, ...localCourses, ...DEMO_COURSES].forEach((c) => {
    const key = (c.id || c.title).toLowerCase();
    if (!mergedMap.has(key)) {
      mergedMap.set(key, {
        ...c,
        isEnrolled: enrolledIds.includes(c.id) || c.isEnrolled || false,
      });
    }
  });

  return Array.from(mergedMap.values());
}

export async function fetchEnrolledCourses() {
  const all = await fetchCourses();
  return all.filter((c) => c.isEnrolled);
}

export async function toggleCourseEnrollment(courseId) {
  const currentEnrolled = getEnrolledIds();
  const exists = currentEnrolled.includes(courseId);
  const updatedEnrolled = exists ? currentEnrolled.filter((id) => id !== courseId) : [...currentEnrolled, courseId];
  saveEnrolledIds(updatedEnrolled);
  return fetchCourses();
}

export async function createCourse(input) {
  let created = null;
  const slug = input.title.toLowerCase().replace(/\s+/g, "-");
  const defaultVideo = input.videoUrl || "https://www.youtube.com/embed/g2nMKzhkvxA";

  const newCourse = {
    id: `c_${Date.now()}`,
    title: input.title,
    slug,
    level: input.level || "Core",
    summary: input.summary || "Mastering advanced engineering architecture.",
    lessonsCount: 2,
    mentor: "Elias Thorne",
    videoUrl: defaultVideo,
    lessons: [
      { id: `l_${Date.now()}_1`, title: "01. Architecture Overview & Core Setup", duration: "15:00", videoUrl: defaultVideo, completed: false },
      { id: `l_${Date.now()}_2`, title: "02. Advanced Implementation & Deployment", duration: "20:00", videoUrl: defaultVideo, completed: false },
    ],
    certificateEarned: false,
    isEnrolled: true,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);
    const res = await fetch(`${API_BASE}/courses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCourse),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        created = json.data;
      }
    }
  } catch {
    /* Silent fallback */
  }

  if (!created) {
    created = newCourse;
  }

  const currentLocal = getLocalCourses();
  saveLocalCourses([created, ...currentLocal]);

  const enrolledIds = getEnrolledIds();
  saveEnrolledIds([...enrolledIds, created.id]);

  return created;
}

export async function toggleLessonCompleted(courseId, lessonId) {
  const current = getLocalCourses();
  const allCourses = current.length > 0 ? current : DEMO_COURSES;

  let targetCourse = null;
  const updatedCourses = allCourses.map((c) => {
    if (c.id === courseId) {
      const updatedLessons = (c.lessons || []).map((l) => (l.id === lessonId ? { ...l, completed: !l.completed } : l));
      const allDone = updatedLessons.length > 0 && updatedLessons.every((l) => l.completed);
      targetCourse = {
        ...c,
        lessons: updatedLessons,
        certificateEarned: allDone,
      };
      return targetCourse;
    }
    return c;
  });

  saveLocalCourses(updatedCourses);
  return targetCourse;
}

export async function deleteCourse(id) {
  const current = getLocalCourses();
  saveLocalCourses(current.filter((c) => c.id !== id));
}

// MEMBERSHIPS & GROUPS
export async function fetchMemberships(_userId) {
  return [
    { id: "g1", group_key: "designers", group_name: "Design Crafters" },
    { id: "g2", group_key: "engineers", group_name: "Frontend Engineers" },
  ];
}

export async function joinGroup(_userId, key, name) {
  return { id: `g_${Date.now()}`, group_key: key, group_name: name };
}

export async function leaveGroup(_userId, _key) {
  // Group leave helper
}
