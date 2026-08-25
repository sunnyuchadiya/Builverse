import React, { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Loading, PageHead } from "@/components/app/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useSessionUser } from "@/lib/session";
import { fetchMemberships } from "@/lib/workspace";
import { MessageSquare, Users, Sparkles, Send } from "lucide-react";

export const Route = createFileRoute("/_authenticated/chat")({
  head: () => ({
    meta: [
      { title: "Chat — BuildVerse Realtime Channels" },
      {
        name: "description",
        content:
          "Realtime team chat inside BuildVerse: shared rooms, live presence, and instant message delivery.",
      },
    ],
  }),
  component: ChatPage,
});

const DEFAULT_ROOMS = ["general", "react-native-guild", "mongodb-architecture", "webgpu-engines"];

function Room({ profile, room }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [online, setOnline] = useState(1);
  const bottom = useRef(null);

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
        if (active && data) setMessages(data);
      });

    const channel = supabase
      .channel(`chat:${room}`, { config: { presence: { key: profile.id } } })
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `room=eq.${room}` },
        (payload) => {
          const next = payload.new;
          setMessages((prev) => (prev.some((m) => m.id === next.id) ? prev : [...prev, next]));
        }
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

  async function send(e) {
    e.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setDraft("");

    const newMsg = {
      id: Math.random().toString(36).substring(2, 9),
      room,
      body,
      author_id: profile.id,
      author_name: profile.display_name,
      author_color: profile.color || "#3b82f6",
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);

    try {
      await supabase.from("chat_messages").insert({
        room,
        body,
        author_id: profile.id,
        author_name: profile.display_name,
        author_color: profile.color || "#3b82f6",
      });
    } catch {
      /* Fallback local message sync */
    }
  }

  return (
    <section className="flex h-[580px] flex-col rounded-3xl border border-border bg-card shadow-2xl">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h2 className="text-base font-bold text-foreground font-display flex items-center space-x-2">
            <span>#{room}</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Realtime group messages sync live in DB.</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-400">
          <span className="size-2 animate-pulse rounded-full bg-emerald-400" />
          {online} active online
        </span>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto p-6">
        {messages.length === 0 && (
          <div className="p-8 text-center rounded-2xl border border-dashed border-border">
            <Sparkles className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xs font-bold text-foreground">Welcome to #{room} channel!</p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Be the first to post a message or start a discussion thread.
            </p>
          </div>
        )}

        {messages.map((m) => {
          const mine = m.author_id === profile.id;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-md ${
                  mine
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "border border-border bg-surface-elevated text-foreground"
                }`}
              >
                {!mine && (
                  <p className="text-[11px] font-black uppercase tracking-wider mb-1" style={{ color: m.author_color }}>
                    {m.author_name}
                  </p>
                )}
                <p className="text-xs leading-relaxed break-words">{m.body}</p>
                <p className={`mt-1.5 text-[10px] ${mine ? "opacity-70 text-right" : "text-muted-foreground"}`}>
                  {new Date(m.created_at || Date.now()).toLocaleTimeString([], {
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

      <form onSubmit={send} className="flex gap-2 border-t border-border p-4 bg-surface-elevated/40">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Message #${room}...`}
          aria-label="Message"
          className="flex-1 rounded-2xl border border-border bg-card px-4 py-2.5 text-xs text-foreground outline-none focus:border-primary transition-colors"
        />
        <button
          type="submit"
          className="rounded-2xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground transition-transform hover:scale-105 flex items-center space-x-1.5 shadow-lg shadow-primary/20"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </section>
  );
}

function ChatPage() {
  const { profile, ready } = useSessionUser();
  const [room, setRoom] = useState("general");
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (!profile) return;
    void fetchMemberships(profile.id).then(setGroups);
  }, [profile?.id]);

  if (!ready || !profile) return <Loading />;

  return (
    <AppShell profile={profile}>
      <PageHead
        eyebrow="Chat Channels"
        title="Realtime Squad Rooms"
        subtitle="Every group you join on BuildVerse automatically unlocks its own dedicated live channel here."
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-3xl border border-border bg-card p-4 space-y-4">
          <div>
            <p className="px-2 pb-2 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
              Global Channels
            </p>
            <ul className="space-y-1">
              {DEFAULT_ROOMS.map((r) => (
                <li key={r}>
                  <button
                    onClick={() => setRoom(r)}
                    className={`w-full rounded-2xl px-3.5 py-2.5 text-left text-xs font-bold transition-all ${
                      room === r
                        ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated"
                    }`}
                  >
                    # {r}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 border-t border-border">
            <p className="px-2 pb-2 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
              Joined Groups ({groups.length})
            </p>
            {groups.length === 0 ? (
              <p className="px-2 text-xs text-muted-foreground">
                Join a group on /groups to get its room.
              </p>
            ) : (
              <ul className="space-y-1">
                {groups.map((g) => {
                  const key = g.group_key || g.group_name.toLowerCase().replace(/\s+/g, "-");
                  return (
                    <li key={g.id}>
                      <button
                        onClick={() => setRoom(key)}
                        className={`w-full truncate rounded-2xl px-3.5 py-2.5 text-left text-xs font-bold transition-all ${
                          room === key
                            ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
                            : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated"
                        }`}
                      >
                        # {g.group_name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>

        <Room key={room} profile={profile} room={room} />
      </div>
    </AppShell>
  );
}
