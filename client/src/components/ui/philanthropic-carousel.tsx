import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PhilanthropicProject {
  id: string;
  title: string;
  description: string;
  logo: string;
}

interface PhilanthropicCarouselProps {
  projects: PhilanthropicProject[];
}

export function PhilanthropicCarousel({ projects }: PhilanthropicCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 600);
  };

  // Auto-play functionality
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      if (!isAnimating && !isPaused) {
        nextSlide();
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isAnimating, isPaused]);

  const getSlidePosition = (index: number) => {
    const diff = index - currentIndex;
    const totalSlides = projects.length;
    
    // Handle wraparound
    let position = diff;
    if (Math.abs(diff) > totalSlides / 2) {
      position = diff > 0 ? diff - totalSlides : diff + totalSlides;
    }
    
    return position;
  };

  const getSlideStyles = (index: number) => {
    const position = getSlidePosition(index);
    
    let transform = '';
    let opacity = 1;
    let zIndex = 5;
    let scale = 1;
    
    if (position === 0) {
      // Center slide
      transform = 'translateX(0%) scale(1.05)';
      opacity = 1;
      zIndex = 10;
      scale = 1.05;
    } else if (Math.abs(position) === 1) {
      // Adjacent slides
      transform = `translateX(${position * 100}%) scale(0.9)`;
      opacity = 0.8;
      zIndex = 5;
      scale = 0.9;
    } else {
      // Far slides
      transform = `translateX(${position * 100}%) scale(0.8)`;
      opacity = 0.6;
      zIndex = 1;
      scale = 0.8;
    }
    
    return {
      transform,
      opacity,
      zIndex,
      transition: isAnimating ? 'all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)' : 'none',
    };
  };

  return (
    <div 
      className="w-full max-w-7xl mx-auto relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative">
        {/* Carousel Container */}
        <div className="relative h-[600px] flex items-center justify-center py-8">
          {projects.map((project, index) => {
            const slideStyles = getSlideStyles(index);
            
            return (
              <div
                key={project.id}
                className="absolute w-80 h-[550px] flex items-center justify-center px-4 cursor-pointer"
                style={slideStyles}
                onClick={() => goToSlide(index)}
              >
                <Card className="w-full h-full backdrop-blur-md bg-white/10 border border-white/20 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 group">
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="mb-6 text-center transform transition-all duration-500 group-hover:scale-110">
                      <img 
                        src={project.logo} 
                        alt={`${project.title} Logo`} 
                        className="mx-auto w-48 h-auto object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-heading text-xl font-bold text-white mb-3">
                        {project.title}
                      </h4>
                      <p className="text-white/90 leading-relaxed text-left transition-all duration-300 group-hover:text-white text-base">
                        {project.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          disabled={isAnimating}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-white hover:bg-white/20 z-30 disabled:opacity-50"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button 
          onClick={nextSlide}
          disabled={isAnimating}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-white hover:bg-white/20 z-30 disabled:opacity-50"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center mt-8 space-x-2">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isAnimating}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white scale-125'
                : 'bg-white/30 hover:bg-white/60'
            } disabled:opacity-50`}
          />
        ))}
      </div>
    </div>
  );
} 