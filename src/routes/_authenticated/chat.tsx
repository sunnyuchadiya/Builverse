import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Loading, PageHead } from "@/components/app/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useSessionUser, type WorkspaceProfile } from "@/lib/session";
import { fetchMemberships, type Membership } from "@/lib/workspace";

export const Route = createFileRoute("/_authenticated/chat")({
  head: () => ({
    meta: [
      { title: "Chat — Nexus realtime rooms" },
      {
        name: "description",
        content:
          "Realtime team chat inside Nexus: shared rooms, live presence and instant message delivery.",
      },
      { property: "og:title", content: "Chat — Nexus realtime rooms" },
      {
        property: "og:description",
        content: "Shared rooms with live presence and instant delivery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

const ROOMS = ["general", "design", "engineering", "shipped"] as const;

type Message = {
  id: string;
  room: string;
  author_id: string;
  author_name: string;
  author_color: string;
  body: string;
  created_at: string;
};

function Room({ profile, room }: { profile: WorkspaceProfile; room: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [online, setOnline] = useState(1);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    setMessages([]);

    void supabase
      .from("chat_messages")
      .select("*")
      .eq("room", room)
      .order("created_at", { ascending: true })
      .limit(100)
      .then(({ data }) => {
        if (active && data) setMessages(data as Message[]);
      });

    const channel = supabase
      .channel(`chat:${room}`, { config: { presence: { key: profile.id } } })
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `room=eq.${room}` },
        (payload) => {
          const next = payload.new as Message;
          setMessages((prev) => (prev.some((m) => m.id === next.id) ? prev : [...prev, next]));
        },
      )
      .on("presence", { event: "sync" }, () => {
        setOnline(Object.keys(channel.presenceState()).length || 1);
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          void channel.track({ name: profile.display_name });
        }
      });

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, [room, profile.id, profile.display_name]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setDraft("");
    await supabase.from("chat_messages").insert({
      room,
      body,
      author_id: profile.id,
      author_name: profile.display_name,
      author_color: profile.color,
    });
  }

  return (
    <section className="flex h-[560px] flex-col rounded-2xl border border-border bg-card">
      <header className="flex items-center justify-between border-b border-border px-5 py-3">
        <div>
          <h2 className="font-semibold">#{room}</h2>
          <p className="text-xs text-muted-foreground">Messages sync instantly for everyone.</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
          <span className="size-1.5 animate-pulse rounded-full bg-primary" />
          {online} online
        </span>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto p-5">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No messages yet — say hi and start the thread.
          </p>
        )}
        {messages.map((m) => {
          const mine = m.author_id === profile.id;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                  mine
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-surface-elevated"
                }`}
              >
                {!mine && (
                  <p className="text-xs font-semibold" style={{ color: m.author_color }}>
                    {m.author_name}
                  </p>
                )}
                <p className="text-sm break-words">{m.body}</p>
                <p className={`mt-1 text-[10px] ${mine ? "opacity-70" : "text-muted-foreground"}`}>
                  {new Date(m.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottom} />
      </div>

      <form onSubmit={send} className="flex gap-2 border-t border-border p-4">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Message #${room}`}
          aria-label="Message"
          className="flex-1 rounded-full border border-border bg-surface-elevated px-4 py-2.5 text-sm outline-none focus:border-primary/60"
        />
        <button
          type="submit"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
        >
          Send
        </button>
      </form>
    </section>
  );
}

function ChatPage() {
  const { profile, ready } = useSessionUser();
  const [room, setRoom] = useState<string>("general");
  const [groups, setGroups] = useState<Membership[]>([]);

  useEffect(() => {
    if (!profile) return;
    void fetchMemberships(profile.id).then(setGroups);
  }, [profile?.id]);

  if (!ready || !profile) return <Loading />;

  return (
    <AppShell profile={profile}>
      <PageHead
        eyebrow="Chat"
        title="Realtime rooms"
        subtitle="Talk to your squad in shared rooms — every group you join gets its own channel here."
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl border border-border bg-card p-3">
          <p className="px-2 pt-1 pb-2 text-[11px] tracking-widest text-muted-foreground uppercase">
            Rooms
          </p>
          <ul className="space-y-1">
            {ROOMS.map((r) => (
              <li key={r}>
                <button
                  onClick={() => setRoom(r)}
                  className={`w-full rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                    room === r
                      ? "bg-surface-elevated text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  # {r}
                </button>
              </li>
            ))}
          </ul>
          <p className="px-2 pt-4 pb-2 text-[11px] tracking-widest text-muted-foreground uppercase">
            Your groups
          </p>
          {groups.length === 0 ? (
            <p className="px-2 pb-1 text-xs text-muted-foreground">
              Join a group to get its channel.
            </p>
          ) : (
            <ul className="space-y-1">
              {groups.map((g) => {
                const key = `group:${g.group_key}`;
                return (
                  <li key={g.id}>
                    <button
                      onClick={() => setRoom(key)}
                      className={`w-full truncate rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                        room === key
                          ? "bg-surface-elevated text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      # {g.group_name}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>
        <Room key={room} profile={profile} room={room} />
      </div>
    </AppShell>
  );
}
