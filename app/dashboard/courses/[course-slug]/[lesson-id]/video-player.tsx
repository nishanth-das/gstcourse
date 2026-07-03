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

  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      rel: 0,
      modestbranding: 1,
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

  return (
    <div className="absolute inset-0 w-full h-full">
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        onStateChange={onStateChange}
        onEnd={onEnd}
        className="w-full h-full"
        iframeClassName="w-full h-full"
      />
    </div>
  );
}
