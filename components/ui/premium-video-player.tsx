"use client";

import { useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import { Play } from "lucide-react";

export function PremiumVideoPlayer({ 
  videoId,
  title
}: { 
  videoId: string;
  title?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      rel: 0,
      modestbranding: 1,
    },
  };

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  if (!isPlaying) {
    return (
      <div 
        className="relative w-full aspect-video bg-black rounded-xl overflow-hidden cursor-pointer group shadow-lg"
        onClick={() => setIsPlaying(true)}
      >
        <img 
          src={thumbnailUrl} 
          alt={title || "Video thumbnail"} 
          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/60 opacity-80" />
        
        {title && (
          <div className="absolute top-0 left-0 right-0 p-6 z-10">
            <h3 className="text-white font-bold text-xl drop-shadow-md">{title}</h3>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:bg-[var(--color-primary)]/90 transition-all duration-300">
            <Play className="w-8 h-8 text-white ml-2 drop-shadow-lg" fill="currentColor" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
      <YouTube 
        videoId={videoId} 
        opts={opts} 
        className="absolute inset-0 w-full h-full" 
        iframeClassName="w-full h-full"
      />
    </div>
  );
}
