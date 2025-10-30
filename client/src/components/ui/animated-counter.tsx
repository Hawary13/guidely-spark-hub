import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  start?: number;
  delay?: number;
  suffix?: string;
  className?: string;
  trigger?: boolean;
}

export function AnimatedCounter({ 
  end, 
  duration = 2000, 
  start = 0, 
  delay = 0,
  suffix = "",
  className = "",
  trigger = true
}: AnimatedCounterProps) {
  const [count, setCount] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    
    const timer = setTimeout(() => {
      setHasStarted(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, trigger]);

  useEffect(() => {
    if (!hasStarted) return;

    const startTime = Date.now();
    const startValue = start;
    const endValue = end;
    const totalChange = endValue - startValue;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + totalChange * easeOutQuart);

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [hasStarted, start, end, duration]);

  return (
    <span className={className}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// Specialized component for percentage counters
export function AnimatedPercentage({ 
  value, 
  className, 
  duration = 2000 
}: { 
  value: number; 
  className?: string; 
  duration?: number; 
}) {
  return (
    <AnimatedCounter
      end={value}
      suffix="%"
      duration={duration}
      className={className}
    />
  );
}

// Specialized component for currency counters
export function AnimatedCurrency({ 
  value, 
  currency = '$', 
  className, 
  duration = 2000 
}: { 
  value: number; 
  currency?: string; 
  className?: string; 
  duration?: number; 
}) {
  return (
    <span className={className}>
      {currency}<AnimatedCounter
        end={value}
        duration={duration}
      />
    </span>
  );
}