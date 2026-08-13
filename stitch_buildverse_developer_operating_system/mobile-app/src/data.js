export const mainTabs = [
  { name: 'Home', icon: 'home' },
  { name: 'Projects', icon: 'account-tree' },
  { name: 'Groups', icon: 'groups' },
  { name: 'Chat', icon: 'forum' },
  { name: 'Profile', icon: 'person' },
];

export const trendingTags = ['#Rust', '#NextJS', '#Web3', '#AI'];

export const featuredCommunities = [
  {
    id: 'rust-systems',
    name: 'Rust Systems',
    members: '862 Members',
    icon: 'memory',
    description: 'Low-level optimization, memory safety enthusiasts, and WASM builders.',
  },
  {
    id: 'go-collective',
    name: 'Go Collective',
    members: '1.2k Members',
    icon: 'terminal',
    description: 'Cloud-native development, microservices, and distributed systems architecture.',
  },
  {
    id: 'ai-ethics',
    name: 'AI Ethics Node',
    members: '540 Members',
    icon: 'science',
    description: 'Discussion and building of responsible AI, model transparency, and safety protocols.',
  },
];

export const conversations = [
  {
    id: 'state-management',
    title: 'State management in Next.js 14: Is Jotai the new standard?',
    group: '#Frontend',
    meta: '24 replies • 12 mins ago',
    icon: 'forum',
  },
  {
    id: 'rust-db',
    title: 'Building a Rust-based DB engine: Seeking contributors.',
    group: '#RustSystems',
    meta: '8 replies • 1 hour ago',
    icon: 'rocket-launch',
  },
];

export const dashboardStats = [
  { label: 'Global Groups', value: '842' },
  { label: 'Active Contributors', value: '12k+' },
  { label: 'Commits/Day', value: '2.4k' },
];

export const activeProjects = [
  { id: 'phoenix', name: 'Project Phoenix', tag: 'GitHub Sync', progress: 85, subtitle: 'Cloud Infrastructure V2', icon: 'terminal' },
  { id: 'aero', name: 'Aero Engine', tag: 'Linear Tasks', progress: null, subtitle: 'High Perf Logic API', icon: 'rocket-launch', tasks: '12 pending tasks' },
];

export const projectCards = [
  {
    id: 'neuralcanvas',
    name: 'NeuralCanvas OS',
    labelA: 'AI Framework',
    labelB: 'Python',
    description: 'The world\'s first open-source operating system designed specifically for running localized AI agents with zero latency and complete privacy.',
    owner: 'Quantum Studio',
    button: 'View Project',
  },
  {
    id: 'etherdb',
    name: 'EtherDB',
    description: 'Decentralized, high-throughput vector database for edge nodes.',
    button: 'Join',
  },
  {
    id: 'titan',
    name: 'Titan Engine',
    description: 'A 3D rendering engine built entirely in Rust for performance.',
    button: 'Join',
  },
];

export const milestones = [
  {
    id: 'phx-102',
    key: 'PHX-102 — Database Migration',
    detail: 'Transitioning core clusters to PostgreSQL 16',
    status: 'In Progress',
    icon: 'radio-button-checked',
    done: false,
  },
  {
    id: 'phx-103',
    key: 'PHX-103 — Edge Function Refactor',
    detail: 'Optimizing cold starts for global deployments',
    status: 'Backlog',
    icon: 'circle',
    done: false,
  },
  {
    id: 'phx-098',
    key: 'PHX-098 — API Documentation',
    detail: 'v1.2 OpenAPI specifications finalized',
    status: 'Completed',
    icon: 'check-circle',
    done: true,
  },
];

export const teamMembers = [
  { name: 'Erik Solberg', role: 'Lead Architect' },
  { name: 'Astrid Lind', role: 'Infrastructure' },
  { name: 'Jonas Berg', role: 'Frontend Lead' },
];

export const issueItems = [
  { title: 'Security: Dependency Vulnerability', meta: 'High Priority • GH-241', badge: 'Critical', icon: 'warning' },
  { title: 'Layout: Mobile Overflow', meta: 'UI/UX • GH-238', badge: 'Review', icon: 'bug-report' },
  { title: 'Performance: Asset Minification', meta: 'Optim • GH-244', badge: 'Next Sprint', icon: 'speed' },
  { title: 'Feedback: User Permissions Flow', meta: 'Community • GH-239', badge: 'Triaged', icon: 'chat-bubble-outline' },
];

export const chatThreads = [
  {
    id: 'sarah',
    name: 'Sarah Chen',
    preview: 'The refactor for the auth module is live.',
    time: 'Now',
    active: true,
  },
  {
    id: 'marcus',
    name: 'Marcus Thorne',
    preview: 'Did you check the PR #442?',
    time: '12m',
    active: false,
  },
  {
    id: 'elena',
    name: 'Elena Rodriguez',
    preview: 'The new design tokens are looking great.',
    time: '2h',
    active: false,
  },
  {
    id: 'jordan',
    name: 'Jordan Vance',
    preview: 'Sent you the API documentation.',
    time: 'Yesterday',
    active: false,
  },
];

export const profileProjects = [
  {
    id: 'lumina',
    name: 'Lumina Engine',
    stars: '2.4k',
    description: 'A high-performance rendering engine built for the modern web using WebGPU and Rust.',
    tag: 'Rust',
    updated: 'Updated 2 days ago',
  },
  {
    id: 'synapse',
    name: 'Synapse CLI',
    stars: '842',
    description: 'An intelligent command-line interface for managing distributed microservices with ease.',
    tag: 'Go',
    updated: 'Updated 1 week ago',
  },
];
