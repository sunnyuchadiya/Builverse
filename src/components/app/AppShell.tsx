import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { WorkspaceProfile } from "@/lib/session";

const NAV = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Projects", to: "/projects" },
  { label: "Groups", to: "/groups" },
  { label: "Community", to: "/community" },
  { label: "Chat", to: "/chat" },
  { label: "Portfolio", to: "/portfolio" },
] as const;

export function AppShell({
  profile,
  children,
}: {
  profile: WorkspaceProfile;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex min-w-0 items-center gap-7">
            <Link to="/" className="font-display text-lg font-bold">
              nexus<span className="text-primary">.</span>
            </Link>
            <ul className="hide-scrollbar flex items-center gap-5 overflow-x-auto text-sm text-muted-foreground">
              {NAV.map((n) => (
                <li key={n.to} className="shrink-0">
                  <Link
                    to={n.to}
                    className="transition-colors hover:text-foreground"
                    activeProps={{ className: "text-foreground font-medium" }}
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span
              className="grid size-9 place-items-center rounded-full bg-surface-elevated text-xs font-bold"
              style={{ color: profile.color }}
            >
              {profile.display_name.slice(0, 2).toUpperCase()}
            </span>
            <button
              onClick={handleSignOut}
              className="rounded-full border border-border px-3.5 py-1.5 text-sm transition-colors hover:border-primary/60"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
    </div>
  );
}

export function PageHead({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs tracking-widest text-primary uppercase">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">{title}</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

export function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground">
      Loading your workspace…
    </div>
  );
}
