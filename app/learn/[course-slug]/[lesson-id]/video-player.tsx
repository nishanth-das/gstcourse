"use client";

import { useRef, useState, useEffect } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import { useRouter } from "next/navigation";

export default function VideoPlayer({ 
  videoId, 
  lessonId, 
  startPosition,
  nextLessonUrl 
}: { 
  videoId: string;
  lessonId: string;
  startPosition: number;
  nextLessonUrl: string | null;
}) {
  const router = useRouter();
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);

  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: hasStartedPlaying ? 1 : 0,
      rel: 0,
      modestbranding: 1,
      iv_load_policy: 3, // Hides annotations and interactive cards
      showinfo: 0, // Deprecated by YT, but good to include just in case
      start: startPosition > 5 ? startPosition - 3 : startPosition, // rewind slightly if resuming
    },
  };

  // Save progress periodically when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && isReady && playerRef.current) {
      interval = setInterval(async () => {
        const time = await playerRef.current.getCurrentTime();
        if (time > 0) {
          fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lesson_id: lessonId,
              position: time
            })
          }).catch(console.error);
        }
      }, 15000); // Save every 15 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isReady, lessonId]);

  const onReady: YouTubeProps['onReady'] = (event) => {
    playerRef.current = event.target;
    setIsReady(true);
  };

  const onStateChange: YouTubeProps['onStateChange'] = (event) => {
    // 1 = playing, 2 = paused, 0 = ended
    if (event.data === 1) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
      
      // Save progress immediately on pause
      if (event.data === 2) {
        const time = event.target.getCurrentTime();
        fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lesson_id: lessonId,
            position: time
          })
        }).catch(console.error);
      }
    }
  };

  const onEnd: YouTubeProps['onEnd'] = async (event) => {
    // Mark as completed
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lesson_id: lessonId,
        completed: true
      })
    }).catch(console.error);
    
    router.refresh(); // Refresh to update sidebar checkmark
    
    // Optional: Auto-advance to next lesson after a few seconds
    if (nextLessonUrl) {
      setTimeout(() => {
        router.push(nextLessonUrl);
      }, 3000);
    }
  };

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="absolute inset-0 w-full h-full bg-black">
      {!hasStartedPlaying && (
        <div 
          className="absolute inset-0 z-20 cursor-pointer group"
          onClick={() => setHasStartedPlaying(true)}
        >
          <img 
            src={thumbnailUrl} 
            alt="Video thumbnail" 
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/60 opacity-80" />
          
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:bg-[var(--color-primary)]/90 transition-all duration-300">
              <svg className="w-8 h-8 text-white ml-2 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {hasStartedPlaying && (
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={onReady}
          onStateChange={onStateChange}
          onEnd={onEnd}
          className="absolute inset-0 w-full h-full"
          iframeClassName="w-full h-full"
        />
      )}
    </div>
  );
}
