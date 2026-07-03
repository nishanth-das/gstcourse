"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LessonsClient({ courseId }: { courseId: string }) {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const anySupabase = supabase as any;
  // Modal / Form states
  const [activeForm, setActiveForm] = useState<"module" | "lesson" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Module Form
  const [moduleTitle, setModuleTitle] = useState("");
  
  // Lesson Form
  const [lessonModuleId, setLessonModuleId] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonYoutube, setLessonYoutube] = useState("");
  const [lessonDurationMin, setLessonDurationMin] = useState("");
  const [lessonDurationSec, setLessonDurationSec] = useState("");
  const [lessonPreview, setLessonPreview] = useState(false);
  const [lessonMaterialTitle, setLessonMaterialTitle] = useState("");
  const [lessonMaterialFile, setLessonMaterialFile] = useState<File | null>(null);
  const [lessonMaterialUrl, setLessonMaterialUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await anySupabase
        .from("modules")
      .select("*, lessons(*)")
      .eq("course_id", courseId)
      .order("sort_order", { ascending: true });

    if (data) {
      // Sort lessons within modules
      const sortedModules = data.map((mod: any) => ({
        ...mod,
        lessons: (mod.lessons || []).sort((a: any, b: any) => a.sort_order - b.sort_order)
      }));
      setModules(sortedModules);
    }
    setLoading(false);
  };

  // --- Utility ---
  const extractYoutubeId = (url: string) => {
    if (!url) return "";
    // If it's already just an ID (no slashes), return it
    if (!url.includes("/") && url.length === 11) return url;
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  // --- Module Actions ---
  const saveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleTitle) return;

    if (editingId) {
      await anySupabase.from("modules").update({ title: moduleTitle }).eq("id", editingId);
    } else {
      const maxSort = modules.length > 0 ? Math.max(...modules.map(m => m.sort_order)) : -1;
      await anySupabase.from("modules").insert({ 
        course_id: courseId, 
        title: moduleTitle, 
        sort_order: maxSort + 1 
      });
    }

    closeForm();
    fetchData();
  };

  const deleteModule = async (id: string) => {
    if (confirm("Are you sure? This will delete all lessons inside this module too!")) {
      await anySupabase.from("modules").delete().eq("id", id);
      fetchData();
    }
  };

  const moveModule = async (id: string, direction: "up" | "down") => {
    const index = modules.findIndex(m => m.id === id);
    if (direction === "up" && index > 0) {
      const prev = modules[index - 1];
      await Promise.all([
        anySupabase.from("modules").update({ sort_order: prev.sort_order }).eq("id", id),
        anySupabase.from("modules").update({ sort_order: modules[index].sort_order }).eq("id", prev.id)
      ]);
      fetchData();
    } else if (direction === "down" && index < modules.length - 1) {
      const next = modules[index + 1];
      await Promise.all([
        anySupabase.from("modules").update({ sort_order: next.sort_order }).eq("id", id),
        anySupabase.from("modules").update({ sort_order: modules[index].sort_order }).eq("id", next.id)
      ]);
      fetchData();
    }
  };

  // --- Lesson Actions ---
  const saveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle || !lessonYoutube || !lessonModuleId) return;

    setSaving(true);
    const parsedVideoId = extractYoutubeId(lessonYoutube);
    const mod = modules.find(m => m.id === lessonModuleId);
    if (!mod) {
      setSaving(false);
      return;
    }

    let uploadedMaterialUrl = lessonMaterialUrl;
    
    if (lessonMaterialFile) {
      const fileExt = lessonMaterialFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `materials/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('lesson-materials')
        .upload(filePath, lessonMaterialFile);

      if (!uploadError) {
        const { data } = supabase.storage
          .from('lesson-materials')
          .getPublicUrl(filePath);
        uploadedMaterialUrl = data.publicUrl;
      }
    }

    const min = parseInt(lessonDurationMin) || 0;
    const sec = parseInt(lessonDurationSec) || 0;
    const totalSeconds = (min * 60) + sec;

    const payload = {
      module_id: lessonModuleId,
      title: lessonTitle,
      youtube_video_id: parsedVideoId,
      duration_seconds: totalSeconds > 0 ? totalSeconds : null,
      is_preview: lessonPreview,
      material_title: lessonMaterialTitle,
      material_url: uploadedMaterialUrl
    };

    if (editingId) {
      await anySupabase.from("lessons").update(payload).eq("id", editingId);
    } else {
      const maxSort = mod.lessons.length > 0 ? Math.max(...mod.lessons.map((l: any) => l.sort_order)) : -1;
      await anySupabase.from("lessons").insert({ ...payload, sort_order: maxSort + 1 });
    }

    setSaving(false);
    closeForm();
    fetchData();
  };

  const deleteLesson = async (id: string) => {
    if (confirm("Are you sure you want to delete this lesson?")) {
      await anySupabase.from("lessons").delete().eq("id", id);
      fetchData();
    }
  };

  const moveLesson = async (modId: string, lessonId: string, direction: "up" | "down") => {
    const mod = modules.find(m => m.id === modId);
    if (!mod) return;
    
    const index = mod.lessons.findIndex((l: any) => l.id === lessonId);
    if (direction === "up" && index > 0) {
      const prev = mod.lessons[index - 1];
      await Promise.all([
        anySupabase.from("lessons").update({ sort_order: prev.sort_order }).eq("id", lessonId),
        anySupabase.from("lessons").update({ sort_order: mod.lessons[index].sort_order }).eq("id", prev.id)
      ]);
      fetchData();
    } else if (direction === "down" && index < mod.lessons.length - 1) {
      const next = mod.lessons[index + 1];
      await Promise.all([
        anySupabase.from("lessons").update({ sort_order: next.sort_order }).eq("id", lessonId),
        anySupabase.from("lessons").update({ sort_order: mod.lessons[index].sort_order }).eq("id", next.id)
      ]);
      fetchData();
    }
  };

  // --- UI Helpers ---
  const closeForm = () => {
    setActiveForm(null);
    setEditingId(null);
    setModuleTitle("");
    setLessonTitle("");
    setLessonYoutube("");
    setLessonDurationMin("");
    setLessonDurationSec("");
    setLessonPreview(false);
    setLessonMaterialTitle("");
    setLessonMaterialFile(null);
    setLessonMaterialUrl("");
  };

  const openEditModule = (mod: any) => {
    setEditingId(mod.id);
    setModuleTitle(mod.title);
    setActiveForm("module");
  };

  const openAddLesson = (modId: string) => {
    setEditingId(null);
    setLessonModuleId(modId);
    setLessonTitle("");
    setLessonYoutube("");
    setLessonDurationMin("");
    setLessonDurationSec("");
    setLessonPreview(false);
    setLessonMaterialTitle("");
    setLessonMaterialFile(null);
    setLessonMaterialUrl("");
    setActiveForm("lesson");
  };

  const openEditLesson = (lesson: any, modId: string) => {
    setEditingId(lesson.id);
    setLessonModuleId(modId);
    setLessonTitle(lesson.title);
    setLessonYoutube(lesson.youtube_video_id);
    setLessonDurationMin(lesson.duration_seconds ? String(Math.floor(lesson.duration_seconds / 60)) : "");
    setLessonDurationSec(lesson.duration_seconds ? String(lesson.duration_seconds % 60) : "");
    setLessonPreview(lesson.is_preview);
    setLessonMaterialTitle(lesson.material_title || "");
    setLessonMaterialUrl(lesson.material_url || "");
    setLessonMaterialFile(null);
    setActiveForm("lesson");
  };

  if (loading) return <div className="animate-pulse">Loading curriculum...</div>;

  return (
    <div className="relative">
      {/* Action Bar */}
      <div className="mb-6 flex gap-3">
        <Button onClick={() => { closeForm(); setActiveForm("module"); }}>+ Add Module</Button>
      </div>

      {/* Curriculum List */}
      <div className="space-y-6">
        {modules.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-gray-100 shadow-sm text-gray-500">
            No modules created yet. Add a module to start building your course.
          </div>
        ) : (
          modules.map((mod, index) => {
            const isFirst = index === 0;
            const isLast = index === modules.length - 1;
            
            return (
              <div key={mod.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Module Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <button disabled={isFirst} onClick={() => moveModule(mod.id, "up")} className="text-gray-400 hover:text-gray-900 disabled:opacity-30">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                      </button>
                      <button disabled={isLast} onClick={() => moveModule(mod.id, "down")} className="text-gray-400 hover:text-gray-900 disabled:opacity-30">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </button>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Module {index + 1}: {mod.title}</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={() => openAddLesson(mod.id)}>+ Lesson</Button>
                    <button onClick={() => openEditModule(mod)} className="text-sm text-blue-600 hover:underline">Edit</button>
                    <span className="text-gray-300">|</span>
                    <button onClick={() => deleteModule(mod.id)} className="text-sm text-red-600 hover:underline">Delete</button>
                  </div>
                </div>

                {/* Lessons List */}
                <div className="divide-y divide-gray-100">
                  {mod.lessons.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500 bg-white">
                      No lessons in this module.
                    </div>
                  ) : (
                    mod.lessons.map((lesson: any, lIndex: number) => {
                      const lIsFirst = lIndex === 0;
                      const lIsLast = lIndex === mod.lessons.length - 1;
                      
                      return (
                        <div key={lesson.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors bg-white">
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                              <button disabled={lIsFirst} onClick={() => moveLesson(mod.id, lesson.id, "up")} className="text-gray-300 hover:text-gray-900 disabled:opacity-30">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                              </button>
                              <button disabled={lIsLast} onClick={() => moveLesson(mod.id, lesson.id, "down")} className="text-gray-300 hover:text-gray-900 disabled:opacity-30">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                              </button>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 flex items-center gap-2">
                                  {lesson.title}
                                  {lesson.is_preview && (
                                    <span className="bg-green-100 text-green-800 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">Free Preview</span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                                  <span>ID: {lesson.youtube_video_id}</span>
                                  {lesson.duration_seconds && <span>• {Math.floor(lesson.duration_seconds / 60)}m {lesson.duration_seconds % 60}s</span>}
                                  {lesson.material_url && (
                                    <span className="flex items-center gap-1 text-[var(--color-primary)] ml-2">
                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                      Has Material
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ opacity: 1 }}>
                            <button onClick={() => openEditLesson(lesson, mod.id)} className="text-sm text-blue-600 hover:underline">Edit</button>
                            <span className="text-gray-300">|</span>
                            <button onClick={() => deleteLesson(lesson.id)} className="text-sm text-red-600 hover:underline">Delete</button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Forms Overlays */}
      {activeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {activeForm === "module" 
                ? (editingId ? "Edit Module" : "Add Module") 
                : (editingId ? "Edit Lesson" : "Add Lesson")}
            </h2>
            
            {activeForm === "module" ? (
              <form onSubmit={saveModule} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Module Title *</label>
                  <Input value={moduleTitle} onChange={(e) => setModuleTitle(e.target.value)} required placeholder="e.g. Introduction to GST" />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={closeForm} disabled={saving}>Cancel</Button>
                  <Button type="submit" disabled={saving}>Save Module</Button>
                </div>
              </form>
            ) : (
              <form onSubmit={saveLesson} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title *</label>
                  <Input value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} required placeholder="e.g. What is Output Tax?" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL or Video ID *</label>
                  <Input value={lessonYoutube} onChange={(e) => setLessonYoutube(e.target.value)} required placeholder="e.g. https://youtube.com/watch?v=..." />
                  <p className="text-xs text-gray-500 mt-1">Paste the full URL or just the 11-character Video ID.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <div className="flex items-center gap-2">
                    <Input type="number" min="0" value={lessonDurationMin} onChange={(e) => setLessonDurationMin(e.target.value)} placeholder="Minutes" />
                    <span className="text-sm font-medium text-gray-500">min</span>
                    <Input type="number" min="0" max="59" value={lessonDurationSec} onChange={(e) => setLessonDurationSec(e.target.value)} placeholder="Seconds" />
                    <span className="text-sm font-medium text-gray-500">sec</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Optional. Used to display video length.</p>
                </div>
                <div className="flex items-center gap-2 mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
                  <input 
                    type="checkbox" 
                    id="preview-toggle"
                    checked={lessonPreview}
                    onChange={(e) => setLessonPreview(e.target.checked)}
                    className="w-4 h-4 text-[var(--color-primary)] rounded border-gray-300 focus:ring-[var(--color-primary)]"
                  />
                  <label htmlFor="preview-toggle" className="text-sm font-medium text-blue-900 cursor-pointer">
                    Mark as Free Preview
                  </label>
                </div>
                <p className="text-xs text-blue-700 mt-1 px-1">
                  Enabling this makes the video playable to anyone on the public course page without purchasing.
                </p>

                <div className="pt-4 mt-4 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Study Material (Optional)</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Material Name</label>
                      <Input value={lessonMaterialTitle} onChange={(e) => setLessonMaterialTitle(e.target.value)} placeholder="e.g. Tally Shortcut Keys Cheatsheet" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">File Attachment</label>
                      <input 
                        type="file" 
                        onChange={(e) => setLessonMaterialFile(e.target.files ? e.target.files[0] : null)}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-gray-500 file:border-0 file:bg-gray-100 file:px-4 file:py-1 file:text-sm file:font-semibold file:text-[var(--color-primary)] hover:file:bg-gray-200 file:rounded-md cursor-pointer"
                      />
                      <div className="bg-yellow-50 text-yellow-800 text-xs p-3 rounded-md border border-yellow-100 mt-2 flex gap-2 items-start">
                        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p><strong>Tip:</strong> Only 1 file can be uploaded per lesson. If you want to attach multiple files, please put them in a single .zip file and upload that.</p>
                      </div>
                      {lessonMaterialUrl && !lessonMaterialFile && (
                        <p className="text-xs text-green-600 mt-2 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Current file: Attached
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 mt-6">
                  <Button type="button" variant="outline" onClick={closeForm} disabled={saving}>Cancel</Button>
                  <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Lesson"}</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
