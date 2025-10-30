import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ArrowUp, MessageCircle, Phone, Mail } from 'lucide-react';

interface FloatingActionButtonProps {
  className?: string;
}

export function FloatingActionButton({ className }: FloatingActionButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsExpanded(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const actions = [
    {
      icon: Mail,
      label: 'Contact Us',
      href: 'mailto:info@gsf.org.eg',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      icon: Phone,
      label: 'Call Us',
      href: 'tel:+20123456789',
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      icon: MessageCircle,
      label: 'Live Chat',
      href: '#',
      color: 'bg-purple-600 hover:bg-purple-700',
    },
  ];

  if (!isVisible) return null;

  return (
    <div className={cn('fixed bottom-6 right-6 z-50', className)}>
      {/* Action Buttons */}
      <div className={cn(
        'flex flex-col-reverse gap-3 mb-3 transition-all duration-500 transform',
        isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      )}>
        {actions.map((action, index) => (
          <div key={index} className="relative group">
            <a
              href={action.href}
              className={cn(
                'flex items-center justify-center w-12 h-12 rounded-full text-white shadow-lg',
                'transform transition-all duration-300 hover:scale-110 hover:-translate-y-1',
                'hover:shadow-xl active:scale-95',
                action.color
              )}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <action.icon className="w-5 h-5" />
            </a>
            
            {/* Tooltip */}
            <div className={cn(
              'absolute right-full mr-3 top-1/2 -translate-y-1/2',
              'bg-black text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap',
              'opacity-0 group-hover:opacity-100 transition-all duration-300',
              'transform translate-x-2 group-hover:translate-x-0 pointer-events-none'
            )}>
              {action.label}
              <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-black"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Main FAB */}
      <button
        onClick={() => {
          if (isExpanded) {
            setIsExpanded(false);
            setTimeout(scrollToTop, 200);
          } else {
            setIsExpanded(!isExpanded);
          }
        }}
        className={cn(
          'w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg',
          'flex items-center justify-center transition-all duration-500',
          'transform hover:scale-110 hover:-translate-y-1 hover:shadow-xl active:scale-95',
          'hover:rotate-12 focus:outline-none focus:ring-4 focus:ring-blue-300'
        )}
      >
        <ArrowUp 
          className={cn(
            'w-6 h-6 transition-transform duration-500',
            isExpanded ? 'rotate-180' : 'rotate-0'
          )} 
        />
      </button>
    </div>
  );
}