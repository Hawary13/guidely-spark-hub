import React, { useEffect, useRef } from 'react';
import Glide from '@glidejs/glide';
import '@glidejs/glide/dist/css/glide.core.min.css';
import '@glidejs/glide/dist/css/glide.theme.min.css';
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

export function GlideCarousel() {
  const glideRef = useRef<HTMLDivElement>(null);
  const glideInstance = useRef<any>(null);

  useEffect(() => {
    if (glideRef.current && !glideInstance.current) {
      glideInstance.current = new Glide(glideRef.current, {
        type: 'carousel',
        startAt: 0,
        perView: 3,
        focusAt: 'center',
        gap: 30,
        autoplay: 4000,
        hoverpause: true,
        animationDuration: 600,
        animationTimingFunc: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        breakpoints: {
          1024: {
            perView: 2,
            gap: 20,
          },
          768: {
            perView: 1,
            gap: 15,
          },
        },
      });

      // Simple center focus effect
      const updateSlideScales = () => {
        const slides = glideRef.current?.querySelectorAll('.glide__slide');
        if (slides) {
          slides.forEach((slide, index) => {
            const slideElement = slide as HTMLElement;
            const activeIndex = glideInstance.current.index;
            
            if (index === activeIndex) {
              // Center slide - largest
              slideElement.style.transform = 'scale(1.05)';
              slideElement.style.opacity = '1';
              slideElement.style.zIndex = '10';
            } else if (Math.abs(index - activeIndex) === 1) {
              // Adjacent slides - medium
              slideElement.style.transform = 'scale(0.9)';
              slideElement.style.opacity = '0.8';
              slideElement.style.zIndex = '5';
            } else {
              // Far slides - smallest
              slideElement.style.transform = 'scale(0.8)';
              slideElement.style.opacity = '0.6';
              slideElement.style.zIndex = '1';
            }
          });
        }
      };

      // Update on mount and after each transition
      glideInstance.current.on('run.after', updateSlideScales);
      glideInstance.current.mount();
      
      // Initial update
      setTimeout(updateSlideScales, 100);
    }

    return () => {
      if (glideInstance.current) {
        glideInstance.current.destroy();
        glideInstance.current = null;
      }
    };
  }, []);

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: 'from-blue-500 to-blue-600',
        hover: 'group-hover:text-blue-600',
      },
      green: {
        bg: 'from-green-500 to-green-600',
        hover: 'group-hover:text-green-600',
      },
      purple: {
        bg: 'from-purple-500 to-purple-600',
        hover: 'group-hover:text-purple-600',
      },
      orange: {
        bg: 'from-orange-500 to-orange-600',
        hover: 'group-hover:text-orange-600',
      },
      red: {
        bg: 'from-red-500 to-red-600',
        hover: 'group-hover:text-red-600',
      },
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="w-full max-w-7xl mx-auto relative">
      <div ref={glideRef} className="glide">
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {programsData.map((program) => {
              const IconComponent = program.icon;
              const colorClasses = getColorClasses(program.color);
              
              return (
                <li key={program.id} className="glide__slide">
                  <Card className="h-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer mx-2">
                    <CardContent className="p-8 h-full flex flex-col">
                      <div className={`w-16 h-16 bg-gradient-to-br ${colorClasses.bg} rounded-xl flex items-center justify-center mb-6 shadow-md`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-heading text-2xl font-bold text-gsf-primary dark:text-white mb-4">
                          {program.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-lg">
                          {program.description}
                        </p>
                      </div>
                      <div className={`flex items-center text-gsf-secondary ${colorClasses.hover} transition-colors duration-300`}>
                        <span className="text-sm font-medium">Learn More</span>
                        <ChartLine className="ml-2 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Custom Navigation Arrows */}
        <div className="glide__arrows" data-glide-el="controls">
          <button 
            className="glide__arrow glide__arrow--left absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-gsf-primary dark:text-white hover:bg-gsf-primary hover:text-white z-10"
            data-glide-dir="<"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            className="glide__arrow glide__arrow--right absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-gsf-primary dark:text-white hover:bg-gsf-primary hover:text-white z-10"
            data-glide-dir=">"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="glide__bullets flex justify-center mt-8 space-x-2" data-glide-el="controls[nav]">
          {programsData.map((_, index) => (
            <button
              key={index}
              className="glide__bullet w-3 h-3 rounded-full bg-gray-300 dark:bg-slate-600 hover:bg-gsf-primary dark:hover:bg-gsf-secondary transition-all duration-300 data-[glide-active]:bg-gsf-primary data-[glide-active]:dark:bg-gsf-secondary"
              data-glide-dir={`=${index}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 