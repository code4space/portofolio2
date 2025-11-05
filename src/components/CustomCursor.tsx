import { motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

type CursorType = 'default' | 'pointer' | 'pressed';

// Check if device is mobile/touch device
const isMobileDevice = () => {
  return (
    'ontouchstart' in window ||
    (window.matchMedia && window.matchMedia('(max-width: 768px)').matches)
  );
};

const CustomCursor = () => {
  const shouldReduceMotion = useReducedMotion();
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  console.log('ontouchstart' in window,"'ontouchstart' in window");
  console.log(navigator.maxTouchPoints,'maxTouchPoints');
  console.log(window.matchMedia('(max-width: 768px)').matches,'matches');

  const [cursorType, setCursorType] = useState<CursorType>('default');
  const [isHoveringButton, setIsHoveringButton] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(isMobileDevice());
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Direct position (no spring for instant response)
  const cursorX = mouseX;
  const cursorY = mouseY;

  useEffect(() => {
    if (shouldReduceMotion || isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseDown = () => {
      setCursorType('pressed');
    };

    const handleMouseUp = () => {
      setCursorType(isHoveringButton ? 'pointer' : 'default');
    };

    const checkElementType = (target: HTMLElement) => {
      // Check if clickable first (higher priority)
      const clickableElement = target.closest('a') || target.closest('button') ||
        (target.tagName === 'A' ? target : null) ||
        (target.tagName === 'BUTTON' ? target : null);

      if (clickableElement) {
        setCursorType('pointer');
        setIsHoveringButton(true);
        return;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      checkElementType(e.target as HTMLElement);
    };

    const handleMouseEnter = (e: Event) => {
      const target = (e.target as HTMLElement).closest('a, button');
      if (target) {
        setCursorType('pointer');
        setIsHoveringButton(true);
      }
    };

    const handleMouseLeave = (e: Event) => {
      const target = (e.target as HTMLElement).closest('a, button');
      if (target) {
        setCursorType('default');
        setIsHoveringButton(false);
      }
    };

    // Add event listeners to all clickable elements for better accuracy
    const setupClickableElements = () => {
      const clickableElements = document.querySelectorAll('a, button, [role="button"]');
      clickableElements.forEach((el) => {
        el.addEventListener('mouseenter', handleMouseEnter as EventListener);
        el.addEventListener('mouseleave', handleMouseLeave as EventListener);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver as any);

    setupClickableElements();
    // Re-setup when DOM changes
    const observer = new MutationObserver(setupClickableElements);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver as any);
      observer.disconnect();
      const clickableElements = document.querySelectorAll('a, button, [role="button"]');
      clickableElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter as EventListener);
        el.removeEventListener('mouseleave', handleMouseLeave as EventListener);
      });
    };
  }, [shouldReduceMotion, isMobile, mouseX, mouseY, cursorType, isHoveringButton]);

  if (shouldReduceMotion || isMobile) return null;

  // Cursor size based on type
  const cursorSize = {
    default: 8,
    pointer: isHoveringButton ? 30 : 12,
    text: 4,
    pressed: 6,
  }[cursorType];

  return (
    <>
      {/* Hide default cursor */}
      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>

      {/* Custom cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-9999 mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        <motion.div
          style={{
            transform: 'translate(-50%, -50%)',
          }}
        >
          <motion.div
            variants={{
              default: {
                width: cursorSize,
                height: cursorSize,
                borderRadius: '50%',
                scale: 1,
              },
              pointer: {
                width: cursorSize,
                height: cursorSize,
                borderRadius: '50%',
                scale: isHoveringButton ? 1.5 : 1,
              },
              text: {
                width: 2,
                height: cursorSize * 8,
                borderRadius: '2px',
                scale: 1,
              },
              pressed: {
                width: cursorSize,
                height: cursorSize,
                borderRadius: '50%',
                scale: 0.8,
              },
            }}
            animate={cursorType}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
            }}
            className="relative"
          >
            {/* Default white dot / text cursor */}
            <motion.div
              className="bg-white"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
              }}
            />
          </motion.div>


          {/* Magnetic ring effect for buttons */}
          <motion.div
            className="absolute border-2 border-white/50 rounded-full"
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              left: isHoveringButton ? 0 : '-150%',
              top: isHoveringButton ? 0 : '-150%',
              width: isHoveringButton ? 0 : cursorSize * 4,
              height: isHoveringButton ? 0 : cursorSize * 4,
            }}
          />
        </motion.div>
      </motion.div>
    </>
  );
};

export default CustomCursor;
