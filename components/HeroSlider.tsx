"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const slides = [
  "/images/hero-bg.png",
  "/images/hero-bg-2.png",
  "/images/hero-bg-3.png"
];

interface HeroSliderProps {
  headline: string;
  subheadline: string;
}

export function HeroSlider({ headline, subheadline }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-28 md:py-40 overflow-hidden bg-gray-900 group">
      {/* Slider Images */}
      {slides.map((src, index) => (
        <div 
          key={src}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image 
            src={src} 
            alt={`Hero Background ${index + 1}`} 
            fill 
            className="object-cover opacity-40 mix-blend-overlay transform transition-transform duration-[10000ms] ease-linear scale-100 hover:scale-105"
            priority={index === 0}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/50 to-gray-900/90 z-0" />
      
      {/* Content */}
      <Container className="text-center relative z-10 text-white animate-fade-in">
        <Badge variant="outline" className="mb-6 border-orange-500/50 bg-orange-500/10 text-orange-200 backdrop-blur-sm px-4 py-1.5 text-sm hover:bg-orange-500/20 transition-colors">
          India's #1 Practical Tax Platform
        </Badge>
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl drop-shadow-xl max-w-4xl mx-auto">
          {headline}
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-200 drop-shadow-md">
          {subheadline}
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/courses">
            <Button size="lg" className="text-base h-14 px-10 shadow-[0_0_20px_rgba(247,148,29,0.4)] hover:shadow-[0_0_40px_rgba(247,148,29,0.7)] transition-all bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white hover:-translate-y-1">
              Browse Courses
            </Button>
          </Link>
        </div>
      </Container>

      {/* Indicators */}
      <div className="absolute bottom-16 left-0 right-0 z-10 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-orange-500 w-8" : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
