import React, { useRef, useEffect } from 'react';
import { Button } from './button';
import { TypingAnimation } from './typing-animation';
import heroBg from "@/assets/meina-yin-vz1V8bDC-HY-unsplash.jpg";

declare global {
  interface Window {
    particlesJS: any;
  }
}

interface ParticlesHeroProps {
  title: string;
  subtitle: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
}

export function ParticlesHero({
  title,
  subtitle,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryClick,
  onSecondaryClick,
}: ParticlesHeroProps) {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Import particles.js library
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    script.onload = () => {
      if (window.particlesJS && particlesRef.current) {
        window.particlesJS('particles-js', {
          particles: {
            number: {
              value: 120,
              density: {
                enable: true,
                value_area: 800
              }
            },
            color: {
              value: '#3b82f6' // Blue color matching our brand
            },
            shape: {
              type: 'circle'
            },
            opacity: {
              value: 0.4,
              random: true,
              anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
              }
            },
            size: {
              value: 3,
              random: true,
              anim: {
                enable: true,
                speed: 2,
                size_min: 0.1,
                sync: false
              }
            },
            line_linked: {
              enable: true,
              distance: 150,
              color: '#3b82f6', // Blue connecting lines
              opacity: 0.2,
              width: 1
            },
            move: {
              enable: true,
              speed: 2,
              direction: 'none',
              random: false,
              straight: false,
              out_mode: 'out',
              bounce: false,
              attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
              }
            }
          },
          interactivity: {
            detect_on: 'canvas',
            events: {
              onhover: {
                enable: true,
                mode: 'repulse'
              },
              onclick: {
                enable: true,
                mode: 'push'
              },
              resize: true
            },
            modes: {
              grab: {
                distance: 140,
                line_linked: {
                  opacity: 1
                }
              },
              bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3
              },
              repulse: {
                distance: 120,
                duration: 0.4
              },
              push: {
                particles_nb: 4
              },
              remove: {
                particles_nb: 2
              }
            }
          },
          retina_detect: true
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-blue-900 to-blue-700 dark:from-slate-900 dark:to-slate-800 py-12 lg:py-16 overflow-hidden">
      {/* Background Image Layer (under particles) */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          zIndex: 0,
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top center'
        }}
      />
      {/* Particles Background */}
      <div
        id="particles-js"
        ref={particlesRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />
      
      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <div className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white max-w-4xl mx-auto">
            <div className="mb-2">Shaping Cairo’s Future</div>
            <div className="h-40 md:h-44 lg:h-48 flex flex-col justify-start text-gsf-yellow">
              <TypingAnimation 
                texts={[
                  "Workshops • Mentorship • Opportunities"
                ]}
                typingSpeed={80}
                deletingSpeed={0}
                pauseTime={1000}
                className="block space-y-1"
                fixOnComplete={true}
              />
            </div>
          </div>
          
          <p className="text-xl text-white/90 dark:text-blue-100 mb-8 max-w-3xl mx-auto">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              onClick={onPrimaryClick}
              size="lg"
              className="bg-gsf-yellow hover:bg-yellow-400 text-gsf-primary font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-lg px-8 py-3"
            >
              {primaryButtonText}
            </Button>
            <Button
              onClick={onSecondaryClick}
              variant="outline"
              size="lg"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 font-semibold transition-all duration-200 text-lg px-8 py-3"
            >
              {secondaryButtonText}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}