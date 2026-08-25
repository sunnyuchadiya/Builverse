import React, { useEffect, useState } from "react";
import { GraduationCap, Plus, Trash2, BookOpen, Video, Award, RefreshCw, UserCheck } from "lucide-react";
import { fetchCourses, createCourse, deleteCourse } from "@/lib/workspace";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("Core");
  const [summary, setSummary] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const loadCourses = async () => {
    setLoading(true);
    try {
      const list = await fetchCourses();
      setCourses(list);
    } catch {
      /* fallback */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const created = await createCourse({
      title: title.trim(),
      level,
      summary: summary.trim() || "Mastering modern engineering principles.",
      videoUrl: videoUrl.trim() || "https://www.youtube.com/embed/g2nMKzhkvxA",
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
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground font-display">
            Course Curriculum & Academy Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manual data sync, HD video masterclasses, and verified certificates.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadCourses}
            className="p-2.5 rounded-2xl bg-surface-elevated border border-border text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1.5 text-xs font-bold"
            title="Refresh Courses"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-primary" : ""}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-primary text-primary-foreground text-xs font-black flex items-center space-x-2 shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Masterclass</span>
          </button>
        </div>
      </div>

      {/* COURSES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course) => (
          <div
            key={course.id}
            className="p-6 rounded-3xl bg-card border border-border space-y-4 hover:border-primary/50 transition-all shadow-xl group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-extrabold uppercase">
                  {course.level || "Core"}
                </span>

                <button
                  onClick={() => handleDelete(course.id)}
                  className="p-1.5 rounded-xl text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete Course"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-base font-bold text-foreground font-display group-hover:text-primary transition-colors flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-primary shrink-0" />
                <span>{course.title}</span>
              </h3>

              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{course.summary}</p>
            </div>

            <div className="pt-3 border-t border-border/60 space-y-2 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center space-x-1 font-semibold">
                  <UserCheck className="w-3.5 h-3.5 text-primary" />
                  <span>{course.mentor || "Elias Thorne"}</span>
                </span>
                <span className="flex items-center space-x-1 font-mono text-[10px]">
                  <Video className="w-3 h-3 text-emerald-400" />
                  <span>HD Video Lesson</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MASTERCLASS MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground font-display">Publish New Masterclass</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleAddCourse} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design Systems 2.0 & Token Architecture"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-11 px-4 rounded-2xl bg-surface-elevated border border-input text-xs text-foreground focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">HD Video Embed URL</label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/embed/g2nMKzhkvxA"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full h-11 px-4 rounded-2xl bg-surface-elevated border border-input text-xs text-foreground focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Summary</label>
                <textarea
                  rows={3}
                  placeholder="Brief course overview and curriculum topics..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-surface-elevated border border-input text-xs text-foreground focus:border-primary outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full h-11 px-4 rounded-2xl bg-surface-elevated border border-input text-xs text-foreground focus:border-primary outline-none"
                >
                  <option value="Core">Core</option>
                  <option value="Advanced">Advanced</option>
                  <option value="New">New</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-2xl border border-border text-xs font-bold text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl bg-primary text-primary-foreground text-xs font-black shadow-lg shadow-primary/20"
                >
                  Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
