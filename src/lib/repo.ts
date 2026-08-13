import { supabase } from "@/integrations/supabase/client";

export type RepoFile = {
  id: string;
  project_id: string;
  path: string;
  content: string;
  language: string;
  updated_at: string;
};

export type Commit = {
  id: string;
  project_id: string;
  author_name: string;
  message: string;
  files_changed: number;
  additions: number;
  deletions: number;
  path: string;
  patch: string;
  created_at: string;
};

export function languageFor(path: string) {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    ts: "TypeScript",
    tsx: "TypeScript",
    js: "JavaScript",
    jsx: "JavaScript",
    css: "CSS",
    json: "JSON",
    md: "Markdown",
    py: "Python",
    sql: "SQL",
    html: "HTML",
  };
  return map[ext] ?? "Plain text";
}

export async function fetchFiles(projectId: string) {
  const { data, error } = await supabase
    .from("project_files")
    .select("id, project_id, path, content, language, updated_at")
    .eq("project_id", projectId)
    .order("path", { ascending: true });
  if (error) throw error;
  return (data ?? []) as RepoFile[];
}

export async function upsertFile(
  userId: string,
  projectId: string,
  path: string,
  content: string,
) {
  const { data, error } = await supabase
    .from("project_files")
    .upsert(
      { user_id: userId, project_id: projectId, path, content, language: languageFor(path) },
      { onConflict: "project_id,path" },
    )
    .select("id, project_id, path, content, language, updated_at")
    .single();
  if (error) throw error;
  return data as RepoFile;
}

export async function deleteFile(id: string) {
  const { error } = await supabase.from("project_files").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchCommits(projectId: string) {
  const { data, error } = await supabase
    .from("project_commits")
    .select(
      "id, project_id, author_name, message, files_changed, additions, deletions, path, patch, created_at",
    )
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(30);
  if (error) throw error;
  return (data ?? []) as unknown as Commit[];
}

export async function createCommit(
  userId: string,
  projectId: string,
  input: {
    author_name: string;
    message: string;
    additions: number;
    deletions: number;
    path?: string;
    patch?: string;
  },
) {
  const { data, error } = await supabase
    .from("project_commits")
    .insert({
      user_id: userId,
      project_id: projectId,
      files_changed: 1,
      path: "",
      patch: "",
      ...input,
    })
    .select(
      "id, project_id, author_name, message, files_changed, additions, deletions, path, patch, created_at",
    )
    .single();
  if (error) throw error;
  return data as unknown as Commit;
}

/* ---------------- community ---------------- */

export type CommunityPost = {
  id: string;
  author_id: string;
  author_name: string;
  author_color: string;
  title: string;
  body: string;
  tag: string;
  link: string;
  created_at: string;
};

export async function fetchPosts() {
  const { data, error } = await supabase
    .from("community_posts")
    .select("id, author_id, author_name, author_color, title, body, tag, link, created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? []) as CommunityPost[];
}

export async function createPost(
  author: { id: string; display_name: string; color: string },
  input: { title: string; body: string; tag: string; link: string },
) {
  const { data, error } = await supabase
    .from("community_posts")
    .insert({
      author_id: author.id,
      author_name: author.display_name,
      author_color: author.color,
      ...input,
    })
    .select("id, author_id, author_name, author_color, title, body, tag, link, created_at")
    .single();
  if (error) throw error;
  return data as CommunityPost;
}

export async function deletePost(id: string) {
  const { error } = await supabase.from("community_posts").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchLikes() {
  const { data, error } = await supabase.from("community_post_likes").select("post_id, user_id");
  if (error) throw error;
  return (data ?? []) as { post_id: string; user_id: string }[];
}

export async function toggleLike(postId: string, userId: string, liked: boolean) {
  if (liked) {
    const { error } = await supabase
      .from("community_post_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("community_post_likes")
      .insert({ post_id: postId, user_id: userId });
    if (error) throw error;
  }
}