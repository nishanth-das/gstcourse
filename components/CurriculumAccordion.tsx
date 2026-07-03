"use client";

import { useState } from "react";
import { ModuleWithLessons } from "@/lib/supabase/queries";
import { PlayCircle, Lock, ChevronDown, ChevronUp, X } from "lucide-react";

export function CurriculumAccordion({ modules }: { modules: ModuleWithLessons[] }) {
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({
    // Open the first module by default
    [modules[0]?.id]: true
  });
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

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
                                  onClick={() => lesson.is_preview && setPreviewVideo(lesson.youtube_video_id)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden shadow-2xl">
            <button 
              onClick={() => setPreviewVideo(null)}
              className="absolute top-2 right-2 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-video w-full">
              <iframe 
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${previewVideo}?autoplay=1&rel=0&modestbranding=1`} 
                title="Preview Video" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
