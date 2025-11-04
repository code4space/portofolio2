import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface DecryptTextProps {
  children: string;
  className?: string;
  speed?: number; // Character reveal speed in ms
  delay?: number; // Delay before starting decryption
  encryptedChars?: string; // Characters to use for encryption
}

const DecryptText = ({
  children,
  className = '',
  speed = 50,
  delay = 0,
  encryptedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?',
}: DecryptTextProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px', amount: 0.3 });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasStartedRef = useRef(false);
  
  const [displayText, setDisplayText] = useState(() => {
    // Initialize with encrypted text
    return children
      .split('')
      .map((char) => {
        if (char === ' ') return ' ';
        return encryptedChars[Math.floor(Math.random() * encryptedChars.length)];
      })
      .join('');
  });

  useEffect(() => {
    // Only start once when coming into view for the first time
    if (!isInView || hasStartedRef.current) return;
    
    hasStartedRef.current = true;

    const text = children;
    let currentIndex = 0;

    // Start decryption after delay
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        if (currentIndex < text.length) {
          // Build the text: revealed characters + encrypted characters
          const revealed = text.slice(0, currentIndex + 1);
          const remaining = text.slice(currentIndex + 1);
          const encrypted = remaining
            .split('')
            .map((char) => {
              // For spaces, keep them as spaces
              if (char === ' ') return ' ';
              return encryptedChars[Math.floor(Math.random() * encryptedChars.length)];
            })
            .join('');
          
          setDisplayText(revealed + encrypted);
          currentIndex++;
        } else {
          // Finished decrypting
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setDisplayText(text); // Ensure final text is correct
        }
      }, speed);
    }, delay);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isInView, children, speed, delay, encryptedChars]);

  return (
    <motion.span
      ref={ref}
      className={className}
    >
      {displayText}
    </motion.span>
  );
};

export default DecryptText;
