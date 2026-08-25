import React, { useEffect, useState } from "react";
import { GraduationCap, Plus, BookOpen, Award, UserCheck, Trash2, RefreshCw, Play } from "lucide-react";
import { fetchCourses, createCourse, deleteCourse } from "@/lib/workspace";

export default function MentorCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("Core");
  const [summary, setSummary] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const loadCourses = async () => {
    try {
      const data = await fetchCourses();
      setCourses(data);
    } catch (e) {
      console.log("Mentor courses load note:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
    const interval = setInterval(loadCourses, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const created = await createCourse({
      title: title.trim(),
      level,
      summary: summary.trim() || "Mastering advanced engineering architecture.",
      videoUrl: videoUrl.trim() || undefined,
    });

    setCourses([created, ...courses]);
    setTitle("");
    setSummary("");
    setVideoUrl("");
    setShowAddModal(false);
  };

  const handleDelete = async (id) => {
    await deleteCourse(id);
    setCourses(courses.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight font-display">
            Mentor Academy Course Management ({courses.length})
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Create video masterclasses, upload video player links, and track student completion certificates.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadCourses}
            className="p-2.5 rounded-2xl bg-surface-elevated border border-border text-muted-foreground hover:text-foreground transition-colors"
            title="Refresh Courses"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-primary" : ""}`} />
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-primary text-primary-foreground text-xs font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Masterclass Course</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-3xl bg-card border border-border flex flex-col justify-between space-y-4 hover:border-primary/50 transition-colors shadow-xl"
          >
            <div>
              <div className="flex items-start justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-primary/15 text-primary border border-primary/30">
                  {c.level || "Core"}
                </span>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-1 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                  title="Delete Course"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-sm font-bold text-foreground mt-3 font-display leading-snug">{c.title}</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{c.summary}</p>
            </div>

            <div className="space-y-3 pt-3 border-t border-border/60">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                <span className="flex items-center space-x-1">
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                  <span>{c.lessonsCount || (c.lessons?.length || 2)} Video Lessons</span>
                </span>
                <span className="flex items-center space-x-1 text-emerald-400">
                  <Award className="w-3.5 h-3.5" />
                  <span>Certificate Enabled</span>
                </span>
              </div>

              {c.videoUrl && (
                <div className="p-2 rounded-xl bg-surface-elevated border border-border flex items-center space-x-2 text-[11px] text-muted-foreground font-mono truncate">
                  <Play className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="truncate">{c.videoUrl}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ADD MASTERCLASS MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleAddCourse}
            className="bg-card border border-border rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl"
          >
            <h3 className="text-sm font-bold text-foreground border-b border-border pb-3 font-display">
              Create New Masterclass Course
            </h3>

            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1 block">Course Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Full-Stack WebGPU Masterclass"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-elevated border border-border text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1 block">Level Tag</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-elevated border border-border text-xs text-foreground focus:outline-none focus:border-primary font-bold"
              >
                <option value="Core">Core</option>
                <option value="Advanced">Advanced</option>
                <option value="New">New</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1 block">Video Embed URL (YouTube/Vimeo/MP4)</label>
              <input
                type="url"
                placeholder="e.g. https://www.youtube.com/embed/g2nMKzhkvxA"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-elevated border border-border text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1 block">Course Summary</label>
              <textarea
                rows={3}
                placeholder="Key takeaways and curriculum topics..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-elevated border border-border text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-2xl bg-surface-elevated border border-border text-muted-foreground text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-2xl bg-primary text-primary-foreground text-xs font-bold shadow-lg shadow-primary/20"
              >
                Publish Masterclass →
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
