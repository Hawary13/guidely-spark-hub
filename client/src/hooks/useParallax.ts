import { useEffect, useState, useRef } from 'react';

interface ParallaxOptions {
  speed?: number;
  direction?: 'up' | 'down';
  startOffset?: number;
  endOffset?: number;
}

export const useParallax = (options: ParallaxOptions = {}) => {
  const { speed = 0.5, direction = 'up', startOffset = 0, endOffset = 0 } = options;
  const [offset, setOffset] = useState(0);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;

      const scrollY = window.scrollY;
      const elementTop = elementRef.current.offsetTop;
      const elementHeight = elementRef.current.offsetHeight;
      const windowHeight = window.innerHeight;

      // Check if element is in viewport
      const isInViewport = 
        scrollY + windowHeight > elementTop + startOffset && 
        scrollY < elementTop + elementHeight + endOffset;

      if (isInViewport) {
        const relativePos = scrollY - elementTop;
        const parallaxOffset = direction === 'up' 
          ? relativePos * speed 
          : -relativePos * speed;
        
        setOffset(parallaxOffset);
      }
    };

    handleScroll(); // Calculate initial position
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, direction, startOffset, endOffset]);

  return { elementRef, offset };
};

export const useParallaxBackground = (options: ParallaxOptions = {}) => {
  const { speed = 0.3 } = options;
  const [backgroundY, setBackgroundY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setBackgroundY(scrollY * speed);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return backgroundY;
};

export const useScrollReveal = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold]);

  return { elementRef, isVisible };
};
