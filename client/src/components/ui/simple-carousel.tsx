import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './card';
import { Target, Lightbulb, Users, TrendingUp, Heart, ChartLine, ChevronLeft, ChevronRight } from 'lucide-react';

const programsData = [
  {
    id: 'nitrous',
    title: 'Project Nitrous',
    description: 'Empowering individuals with disabilities by creating and providing assistive technology to enhance their independence and quality of life.',
    icon: Target,
    color: 'blue',
  },
  {
    id: 'eden',
    title: 'Eden Project',
    description: 'Bridging the educational gap for underprivileged children by establishing solar-powered digital labs and delivering immersive, technology-based learning experiences.',
    icon: Lightbulb,
    color: 'green',
  },
  {
    id: 'graphene',
    title: 'Project Graphene',
    description: 'Fostering economic independence for women by offering training in sustainable product design, digital fabrication, and entrepreneurship.',
    icon: Users,
    color: 'purple',
  },
  {
    id: 'bridgez',
    title: 'BridgEz Acceleration Program',
    description: 'Fueling the growth of social impact startups through structured mentorship, investment readiness training, and strategic networking opportunities.',
    icon: TrendingUp,
    color: 'orange',
  },
  {
    id: 'imentor',
    title: 'iMentor Program',
    description: 'Connecting social entrepreneurs with experienced industry experts to provide tailored guidance and support for their ventures.',
    icon: Heart,
    color: 'red',
  },
];

export function SimpleCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % programsData.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + programsData.length) % programsData.length);
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
    const totalSlides = programsData.length;
    
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
        <div className="relative h-[500px] flex items-center justify-center py-8">
          {programsData.map((program, index) => {
            const IconComponent = program.icon;
            const colorClasses = getColorClasses(program.color);
            const slideStyles = getSlideStyles(index);
            
            return (
              <div
                key={program.id}
                className="absolute w-80 h-[450px] flex items-center justify-center px-4"
                style={slideStyles}
              >
                <Card className="w-full h-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer">
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className={`w-16 h-16 bg-gradient-to-br ${colorClasses} rounded-xl flex items-center justify-center mb-6 shadow-md`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-heading text-xl font-bold text-gsf-primary dark:text-white mb-3">
                        {program.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 text-base">
                        {program.description}
                      </p>
                    </div>
                    <div className="flex items-center text-gsf-secondary hover:text-blue-600 transition-colors duration-300 mt-auto">
                      <span className="text-sm font-medium">Learn More</span>
                      <ChartLine className="ml-2 h-4 w-4" />
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
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-gsf-primary dark:text-white hover:bg-gsf-primary hover:text-white z-20 disabled:opacity-50"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button 
          onClick={nextSlide}
          disabled={isAnimating}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-gsf-primary dark:text-white hover:bg-gsf-primary hover:text-white z-20 disabled:opacity-50"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center mt-8 space-x-2">
        {programsData.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isAnimating}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-gsf-primary dark:bg-gsf-secondary scale-125'
                : 'bg-gray-300 dark:bg-slate-600 hover:bg-gsf-primary dark:hover:bg-gsf-secondary'
            } disabled:opacity-50`}
          />
        ))}
      </div>
    </div>
  );
} 