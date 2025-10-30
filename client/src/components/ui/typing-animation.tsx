import React, { useState, useEffect } from 'react';

interface TypingAnimationProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
  className?: string;
  fixOnComplete?: boolean;
}

export function TypingAnimation({ 
  texts, 
  typingSpeed = 100, 
  deletingSpeed = 50, 
  pauseTime = 2000,
  className = "",
  fixOnComplete = false
}: TypingAnimationProps) {
  const [completedTexts, setCompletedTexts] = useState<string[]>([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isComplete) return;

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        if (fixOnComplete) {
          // Add current text to completed texts and move to next
          setCompletedTexts(prev => [...prev, texts[currentTextIndex]]);
          setCurrentText('');
          if (currentTextIndex + 1 >= texts.length) {
            setIsComplete(true);
          } else {
            setCurrentTextIndex(prev => prev + 1);
          }
        } else {
          setIsDeleting(true);
        }
      }, pauseTime);
      return () => clearTimeout(pauseTimer);
    }

    const targetText = texts[currentTextIndex];
    
    if (!isDeleting && currentText === targetText) {
      setIsPaused(true);
      return;
    }

    if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    const timeout = setTimeout(() => {
      if (isDeleting) {
        setCurrentText(targetText.substring(0, currentText.length - 1));
      } else {
        setCurrentText(targetText.substring(0, currentText.length + 1));
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, currentTextIndex, isDeleting, isPaused, texts, typingSpeed, deletingSpeed, pauseTime, fixOnComplete, isComplete]);

  if (fixOnComplete) {
    return (
      <div className={className}>
        {completedTexts.map((text, index) => (
          <div key={index} className="leading-relaxed">
            {text}
          </div>
        ))}
        {!isComplete && (
          <div className="leading-relaxed">
            {currentText}
            <span className="animate-pulse">|</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <span className={className}>
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
} 