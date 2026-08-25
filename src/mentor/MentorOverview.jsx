import React, { useState } from "react";
import { Users, Code2, Video, Star, TrendingUp, CheckCircle2, Clock, MessageSquare } from "lucide-react";

export default function MentorOverview({ setActiveTab }) {
  const [reviews, setReviews] = useState([
    { id: "r1", student: "Alex Chen", project: "Mobile App Redesign", PR: "PR #42: Mongoose Cache Hook", time: "2h ago", status: "Pending" },
    { id: "r2", student: "Sarah Chen", project: "Design System 2.0", PR: "PR #18: Dark Tokens", time: "4h ago", status: "Pending" },
    { id: "r3", student: "Marcus Thorne", project: "Project Phoenix", PR: "PR #09: Auth Middleware", time: "1d ago", status: "Approved" },
  ]);

  const handleApprove = (id) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status: "Approved" } : r)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground font-display tracking-tight">Mentor Command Center</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Track assigned student mentees, pending pull requests, and live workshops.
        </p>
      </div>

      {/* 4 TOP BENTO CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-card border border-border flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Assigned Mentees</p>
            <p className="text-3xl font-black text-foreground font-display mt-1">12</p>
          </div>
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Pending Reviews</p>
            <p className="text-3xl font-black text-foreground font-display mt-1">4</p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Code2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Live Workshops</p>
            <p className="text-3xl font-black text-foreground font-display mt-1">2</p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Video className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Mentor Rating</p>
            <p className="text-3xl font-black text-foreground font-display mt-1">4.9 / 5.0</p>
          </div>
          <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <Star className="w-5 h-5 fill-primary" />
          </div>
        </div>
      </div>

      {/* PENDING CODE REVIEWS TABLE */}
      <div className="rounded-3xl bg-card border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground font-display">Code Review Queue</h2>
          <button
            onClick={() => setActiveTab && setActiveTab("reviews")}
            className="text-xs font-bold text-blue-400 hover:underline"
          >
            View All Reviews →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-muted-foreground">
            <thead className="bg-surface-elevated text-muted-foreground uppercase font-extrabold text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Project Scope</th>
                <th className="px-4 py-3">Pull Request Title</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reviews.map((r) => (
                <tr key={r.id} className="hover:bg-surface-elevated/50 transition-colors">
                  <td className="px-4 py-3 font-bold text-foreground">{r.student}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.project}</td>
                  <td className="px-4 py-3 font-mono text-foreground">{r.PR}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.time}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        r.status === "Approved"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.status !== "Approved" && (
                      <button
                        onClick={() => handleApprove(r.id)}
                        className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-extrabold hover:bg-emerald-500 hover:text-black transition-colors"
                      >
                        Approve PR ✓
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
