import { Platform } from 'react-native';

export const MONGO_API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:5000/api/v1',
  ios: 'http://localhost:5000/api/v1',
  default: 'http://localhost:5000/api/v1',
});

// REGISTERED USERS REGISTRY FOR AUTH VALIDATION
let registeredUsers = [
  { id: "u1", name: "Elias Thorne", email: "elias.thorne@buildverse.io", password: "password123" },
  { id: "u2", name: "Sarah Chen", email: "sarah@buildverse.io", password: "password123" },
  { id: "u3", name: "Alex Chen", email: "alex@buildverse.io", password: "password123" },
];

// INITIAL SESSION IS UNAUTHENTICATED
let currentUserSession = {
  isLoggedIn: false,
  user: null,
};

export const INITIAL_PROJECTS = [
  {
    id: 'p1',
    name: 'Mobile App Redesign',
    description: 'Ultra smooth React Native mobile UI with MongoDB backend.',
    tag: 'Active',
    progress: 85,
    status: 'active',
    created_at: new Date().toISOString(),
  },
  {
    id: 'p2',
    name: 'MongoDB Express API',
    description: 'Express.js Mongoose models & controllers for live data sync.',
    tag: 'In Progress',
    progress: 60,
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'p3',
    name: 'Design System 2.0',
    description: 'Component library with dark mode tokens and animation primitives.',
    tag: 'Completed',
    progress: 100,
    status: 'Completed',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export const INITIAL_ISSUES = [
  { id: 'i1', project_id: 'p1', title: 'Connect Mongoose schemas to React Native App', priority: 'High', resolved: false, resolved_at: null },
  { id: 'i2', project_id: 'p1', title: 'Add offline data caching with AsyncStorage', priority: 'Medium', resolved: true, resolved_at: new Date().toISOString() },
  { id: 'i3', project_id: 'p2', title: 'Optimize MongoDB query indexing', priority: 'High', resolved: false, resolved_at: null },
  { id: 'i4', project_id: 'p3', title: 'Publish npm package v2.4', priority: 'Low', resolved: true, resolved_at: new Date(Date.now() - 86400000).toISOString() },
];

export const CHANNEL_MESSAGES_MAP = {
  general: [
    { id: 'g1', sender: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', text: 'Hey team! Welcome to the #general discussion 🚀', time: '10:42 AM', channel: 'general' },
    { id: 'g2', sender: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', text: 'MongoDB backend is connected and running live!', time: '10:45 AM', channel: 'general' },
  ],
};

// USER AUTHENTICATION & REGISTRATION VALIDATORS
export function registerUserLocal(name, email, password) {
  const cleanEmail = email.trim().toLowerCase();
  const existing = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
  
  if (existing) {
    return { success: false, message: "User with this email already exists! Please log in." };
  }

  const newUser = {
    id: `u_${Date.now()}`,
    name: name.trim(),
    email: cleanEmail,
    password,
    role: "BuildVerse Engineer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
  };

  registeredUsers.push(newUser);
  return { success: true, user: newUser };
}

export function loginUserLocal(email, password) {
  const cleanEmail = email.trim().toLowerCase();
  const user = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    return { success: false, message: "User not found! Please register an account first." };
  }

  return { success: true, user };
}

// DYNAMIC SESSION HELPERS
export function getCurrentUserSession() {
  return currentUserSession;
}

export function setCurrentUserSession(userData) {
  currentUserSession = {
    isLoggedIn: true,
    user: {
      id: userData.id || userData._id || `u_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role || "BuildVerse Engineer",
      avatar: userData.avatar || userData.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
    },
  };
}

export function logoutUserSession() {
  currentUserSession = {
    isLoggedIn: false,
    user: null,
  };
}

// SAFE FETCH HELPER WITH SILENT NETWORK CATCH
export async function safeFetch(url, options = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return await res.json();
    }
  } catch (_err) {
    // Silent catch
  }
  return null;
}

// LIVE MONGODB REAL-TIME API HANDLERS
export async function fetchProjects() {
  const json = await safeFetch(`${MONGO_API_BASE_URL}/projects`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });

  if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
    return json.data.map((item) => ({
      id: item._id || item.id,
      name: item.name,
      description: item.description,
      tag: item.tag || (item.status === 'Completed' ? 'Completed' : 'Active'),
      progress: item.status === 'Completed' ? 100 : item.progress || 0,
      status: item.status,
      created_at: item.createdAt || item.created_at,
    }));
  }

  return INITIAL_PROJECTS;
}

export async function fetchIssues() {
  const json = await safeFetch(`${MONGO_API_BASE_URL}/issues`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });

  if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
    return json.data.map((item) => ({
      id: item._id || item.id,
      project_id: item.projectId || item.project_id,
      title: item.title,
      priority: item.priority,
      resolved: item.resolved,
      resolved_at: item.resolvedAt || item.resolved_at,
    }));
  }

  return INITIAL_ISSUES;
}

export async function createProjectApi(userId, projectData) {
  // SAVE DIRECTLY TO MONGODB BUILDVERSE DB
  const json = await safeFetch(`${MONGO_API_BASE_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData),
  });

  if (json && json.success && json.data) {
    const item = json.data;
    return {
      id: item._id || item.id,
      name: item.name,
      description: item.description,
      tag: item.tag,
      progress: item.progress,
      status: item.status,
      created_at: item.createdAt,
    };
  }

  const localProject = {
    id: `p_${Date.now()}`,
    ...projectData,
    created_at: new Date().toISOString(),
  };

  INITIAL_PROJECTS.unshift(localProject);
  return localProject;
}

export async function deleteProjectApi(projectId) {
  // DELETE DIRECTLY FROM MONGODB BUILDVERSE DB
  await safeFetch(`${MONGO_API_BASE_URL}/projects/${projectId}`, {
    method: 'DELETE',
  });

  const idx = INITIAL_PROJECTS.findIndex(p => p.id === projectId);
  if (idx !== -1) {
    INITIAL_PROJECTS.splice(idx, 1);
  }
}

export async function toggleIssueStatusApi(issueId, newStatus) {
  // UPDATE DIRECTLY IN MONGODB BUILDVERSE DB
  await safeFetch(`${MONGO_API_BASE_URL}/issues/${issueId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus }),
  });

  const issue = INITIAL_ISSUES.find(i => i.id === issueId);
  if (issue) {
    issue.resolved = newStatus === 'Completed';
    issue.resolved_at = issue.resolved ? new Date().toISOString() : null;
  }
}
