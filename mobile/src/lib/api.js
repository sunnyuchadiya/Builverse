import { Platform } from 'react-native';

export const MONGO_API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:5000/api/v1',
  ios: 'http://localhost:5000/api/v1',
  default: 'http://localhost:5000/api/v1',
});

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
    status: 'completed',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export const INITIAL_ISSUES = [
  { id: 'i1', project_id: 'p1', title: 'Connect Mongoose schemas to React Native App', priority: 'High', resolved: false, resolved_at: null },
  { id: 'i2', project_id: 'p1', title: 'Add offline data caching with AsyncStorage', priority: 'Medium', resolved: true, resolved_at: new Date().toISOString() },
  { id: 'i3', project_id: 'p2', title: 'Optimize MongoDB query indexing', priority: 'High', resolved: false, resolved_at: null },
  { id: 'i4', project_id: 'p3', title: 'Publish npm package v2.4', priority: 'Low', resolved: true, resolved_at: new Date(Date.now() - 86400000).toISOString() },
];

// Channel-specific initial fallback messages
export const CHANNEL_MESSAGES_MAP = {
  general: [
    { id: 'g1', sender: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', text: 'Hey team! Welcome to the #general discussion 🚀', time: '10:42 AM', channel: 'general' },
    { id: 'g2', sender: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', text: 'MongoDB backend is connected and running live!', time: '10:45 AM', channel: 'general' },
  ],
  design: [
    { id: 'd1', sender: 'Molly Hellmuth', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', text: 'Updated design tokens are now available in the Figma library ✨', time: '11:10 AM', channel: 'design' },
    { id: 'd2', sender: 'Femi Manuel', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', text: 'Check out the new dark mode contrast guidelines!', time: '11:25 AM', channel: 'design' },
  ],
  engineering: [
    { id: 'e1', sender: 'Sarah Connor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', text: 'React Native navigation refactored to pure BottomTabs. 100% crash-free!', time: '09:15 AM', channel: 'engineering' },
    { id: 'e2', sender: 'Dan Mall', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', text: 'Zod schemas added for authentication payload validation.', time: '09:40 AM', channel: 'engineering' },
  ],
  showcase: [
    { id: 's1', sender: 'David Hoang', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', text: 'Just shipped our new AI Native design workflow! Check it out 🎉', time: '12:00 PM', channel: 'showcase' },
  ],
};

export async function fetchProjects() {
  try {
    const res = await fetch(`${MONGO_API_BASE_URL}/projects`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((item) => ({
        id: item._id || item.id,
        name: item.name,
        description: item.description,
        tag: item.tag,
        progress: item.progress,
        status: item.status,
        created_at: item.createdAt || item.created_at,
      }));
    }
  } catch (err) {
    console.log('[API] MongoDB fetch projects fallback:', err.message);
  }
  return INITIAL_PROJECTS;
}

export async function fetchIssues() {
  try {
    const res = await fetch(`${MONGO_API_BASE_URL}/issues`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((item) => ({
        id: item._id || item.id,
        project_id: item.projectId || item.project_id,
        title: item.title,
        priority: item.priority,
        resolved: item.resolved,
        resolved_at: item.resolvedAt || item.resolved_at,
      }));
    }
  } catch (err) {
    console.log('[API] MongoDB fetch issues fallback:', err.message);
  }
  return INITIAL_ISSUES;
}

export async function fetchChatMessages(channel = 'general') {
  try {
    const res = await fetch(`${MONGO_API_BASE_URL}/chat?channel=${channel}`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((item) => ({
        id: item._id || item.id,
        sender: item.sender,
        avatar: item.avatar,
        text: item.text,
        time: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel: item.channel,
      }));
    }
  } catch (err) {
    console.log('[API] MongoDB fetch chat messages fallback:', err.message);
  }
  return CHANNEL_MESSAGES_MAP[channel] || CHANNEL_MESSAGES_MAP.general;
}

export async function sendChatMessageApi(messageData) {
  try {
    const res = await fetch(`${MONGO_API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData),
    });
    const json = await res.json();
    if (json.success && json.data) {
      const item = json.data;
      return {
        id: item._id || item.id,
        sender: item.sender,
        avatar: item.avatar,
        text: item.text,
        time: 'Just now',
        channel: item.channel,
      };
    }
  } catch (err) {
    console.log('[API] MongoDB send chat message fallback:', err.message);
  }
  return {
    id: `m_${Date.now()}`,
    ...messageData,
    time: 'Just now',
  };
}

export async function createProjectApi(userId, projectData) {
  try {
    const res = await fetch(`${MONGO_API_BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    });
    const json = await res.json();
    if (json.success && json.data) {
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
  } catch (err) {
    console.log('[API] MongoDB create project fallback:', err.message);
  }
  return {
    id: `p_${Date.now()}`,
    ...projectData,
    created_at: new Date().toISOString(),
  };
}

export async function toggleIssueResolvedApi(issueId, currentResolvedState) {
  try {
    await fetch(`${MONGO_API_BASE_URL}/issues/${issueId}/toggle`, {
      method: 'PATCH',
    });
  } catch (err) {
    console.log('[API] MongoDB toggle issue fallback:', err.message);
  }
}
