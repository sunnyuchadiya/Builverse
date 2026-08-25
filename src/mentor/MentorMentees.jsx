import React, { useState } from "react";
import { Users, Mail, MessageSquare, CheckCircle2 } from "lucide-react";

export default function MentorMentees() {
  const [mentees, setMentees] = useState([
    { id: "m1", name: "Alex Chen", email: "alex@buildverse.io", project: "Mobile App Redesign", progress: 85, status: "Active Building", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
    { id: "m2", name: "Sarah Chen", email: "sarah@buildverse.io", project: "Design System 2.0", progress: 100, status: "Completed", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
    { id: "m3", name: "Marcus Thorne", email: "marcus@buildverse.io", project: "Project Phoenix", progress: 74, status: "In Review", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground font-display tracking-tight">Assigned Student Mentees</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Direct mentorship directory and student project progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mentees.map((m) => (
          <div key={m.id} className="p-6 rounded-3xl bg-card border border-border space-y-4 hover:border-blue-500/40 transition-colors">
            <div className="flex items-center space-x-3">
              <img src={m.avatar} alt={m.name} className="w-12 h-12 rounded-full border border-border object-cover" />
              <div>
                <h3 className="text-sm font-bold text-foreground font-display">{m.name}</h3>
                <p className="text-xs text-muted-foreground">{m.email}</p>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-border">
              <p className="text-xs font-semibold text-foreground">Project: <span className="text-muted-foreground">{m.project}</span></p>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-muted-foreground">Completion</span>
                <span className="text-blue-400">{m.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-surface-elevated overflow-hidden border border-border">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${m.progress}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
