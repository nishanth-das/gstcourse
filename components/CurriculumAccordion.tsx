"use client";

import { useState } from "react";
import { ModuleWithLessons } from "@/lib/supabase/queries";
import { PlayCircle, Lock, ChevronDown, ChevronUp, X } from "lucide-react";
import { PremiumVideoPlayer } from "./ui/premium-video-player";

export function CurriculumAccordion({ modules }: { modules: ModuleWithLessons[] }) {
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({
    // Open the first module by default
    [modules[0]?.id]: true
  });
  const [previewVideo, setPreviewVideo] = useState<{ id: string, title: string } | null>(null);

  const toggleModule = (id: string) => {
    setOpenModules(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatDuration = (seconds?: number | null) => {
    if (!seconds) return "";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        {modules.map((mod, index) => (
          <div key={mod.id} className={index !== 0 ? "border-t border-gray-200" : ""}>
            <button
              onClick={() => toggleModule(mod.id)}
              className="w-full flex items-center justify-between p-4 bg-[var(--color-surface)] hover:bg-gray-100 transition-colors text-left"
            >
              <h4 className="font-bold text-[var(--color-text-dark)]">{mod.title}</h4>
              {openModules[mod.id] ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {openModules[mod.id] && (
              <div className="p-0">
                {mod.lessons.length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {mod.lessons.map((lesson, i) => (
                      <li key={lesson.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          {lesson.is_preview ? (
                            <PlayCircle className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
                          ) : (
                            <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                          <div>
                            <span className={`text-sm ${lesson.is_preview ? 'font-medium text-[var(--color-primary)] cursor-pointer hover:underline' : 'text-[var(--color-text-dark)]'}`}
                                  onClick={() => lesson.is_preview && setPreviewVideo({ id: lesson.youtube_video_id, title: lesson.title })}
                            >
                              {i + 1}. {lesson.title}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {lesson.is_preview && (
                            <span className="text-xs bg-[var(--color-success)] text-white px-2 py-0.5 rounded-full font-medium">
                              Preview
                            </span>
                          )}
                          <span className="text-xs text-gray-500">{formatDuration(lesson.duration_seconds)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-sm text-gray-500">No lessons available in this module yet.</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm transition-all duration-300">
          <div 
            className="relative w-full max-w-5xl bg-[#0a0a0a] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-gray-800 animate-in fade-in zoom-in duration-300"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-800/60 bg-gradient-to-b from-gray-900/80 to-black">
              <h3 className="text-white font-bold text-lg px-2 flex items-center gap-3">
                <span className="bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs px-2.5 py-1 rounded-full border border-[var(--color-primary)]/30">Free Preview</span>
                {previewVideo.title}
              </h3>
              <button 
                onClick={() => setPreviewVideo(null)}
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 md:p-6 bg-black">
              <PremiumVideoPlayer videoId={previewVideo.id} />
            </div>
            <div className="p-4 md:p-6 bg-gray-900/50 border-t border-gray-800/60 flex justify-end">
               <p className="text-gray-400 text-sm">Want to see the rest of the lessons? <a href="#buy" onClick={(e) => { e.preventDefault(); setPreviewVideo(null); window.scrollTo({ top: 0, behavior: 'smooth' })}} className="text-[var(--color-primary)] font-bold hover:underline ml-1">Unlock Full Course</a></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
