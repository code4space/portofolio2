import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoadingProps {
  isLoading: boolean;
  progress?: number;
}

const Loading = ({ isLoading, progress = 0 }: LoadingProps) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (progress > 0) {
      const timer = setTimeout(() => {
        setDisplayProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };

    if (isLoading) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isLoading, mouseX, mouseY]);

  // Animated gradient blob
  const GradientBlob = ({ delay = 0, size = 400, colors }: { delay?: number; size?: number; colors: string[] }) => {
    return (
      <motion.div
        className="absolute rounded-full blur-3xl opacity-40"
        style={{
          width: size,
          height: size,
          background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
        }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 100, 0],
          y: [0, -100, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    );
  };

  // Spinning ring loader
  const SpinningRing = () => {
    return (
      <div className="relative w-32 h-32">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-4 border-transparent"
            style={{
              borderTopColor: i === 0 ? '#667eea' : i === 1 ? '#764ba2' : '#f093fb',
              borderRightColor: i === 0 ? '#667eea' : i === 1 ? '#764ba2' : '#f093fb',
            }}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 2 - i * 0.3,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    );
  };

  // Pulsing dots
  const PulsingDots = () => {
    return (
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full bg-linear-to-r from-purple-400 to-pink-400"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0a0a1f 0%, #150a2e 50%, #0a0a1f 100%)',
          }}
        >
          {/* Animated gradient background blobs */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2">
              <GradientBlob delay={0} size={500} colors={['#667eea', '#764ba2']} />
            </div>
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2">
              <GradientBlob delay={2} size={400} colors={['#f093fb', '#4facfe']} />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <GradientBlob delay={4} size={600} colors={['#764ba2', '#667eea']} />
            </div>
          </div>

          {/* Interactive cursor effect */}
          <motion.div
            className="absolute w-96 h-96 rounded-full pointer-events-none"
            style={{
              x,
              y,
              background: 'radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />

          {/* Main loading content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col items-center gap-8"
          >
            {/* Glass morphism card */}
            <motion.div
              className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/20 p-12 shadow-2xl"
              style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 60px rgba(102, 126, 234, 0.1)',
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Spinning rings */}
              <div className="flex justify-center mb-8">
                <SpinningRing />
              </div>

              {/* Loading text */}
              <motion.h2
                className="text-3xl font-bold mb-4 text-center bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: '200% auto',
                }}
              >
                Loading
              </motion.h2>

              {/* Progress bar */}
              <div className="w-64 mb-6">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                  <motion.div
                    className="h-full bg-linear-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${displayProgress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{
                      boxShadow: '0 0 20px rgba(102, 126, 234, 0.6)',
                    }}
                  />
                </div>
                <motion.p
                  className="text-center mt-2 text-white/60 text-sm"
                  key={displayProgress}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {Math.round(displayProgress)}%
                </motion.p>
              </div>

              {/* Pulsing dots */}
              <div className="flex justify-center">
                <PulsingDots />
              </div>
            </motion.div>

            {/* Floating particles around the card */}
            <div className="absolute inset-0 pointer-events-none -z-10">
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const baseRadius = 220;
                return (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full bg-linear-to-r from-purple-400 to-pink-400"
                    style={{
                      left: '50%',
                      top: '50%',
                    }}
                    animate={{
                      scale: [0.5, 1.2, 0.5],
                      opacity: [0.3, 1, 0.3],
                      x: [
                        Math.cos(angle) * baseRadius,
                        Math.cos(angle) * (baseRadius + 30),
                        Math.cos(angle) * baseRadius
                      ],
                      y: [
                        Math.sin(angle) * baseRadius,
                        Math.sin(angle) * (baseRadius + 30),
                        Math.sin(angle) * baseRadius
                      ],
                    }}
                    transition={{
                      duration: 3,
                      delay: i * 0.15,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                );
              })}
            </div>
          </motion.div>

          {/* Animated grid background */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <svg className="w-full h-full">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Animated connecting lines */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 6 }).map((_, i) => {
              const angle = (i / 6) * Math.PI * 2;
              const startRadius = 100;
              const endRadius = 300;
              return (
                <motion.svg
                  key={i}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  width="600"
                  height="600"
                  style={{ overflow: 'visible' }}
                >
                  <motion.line
                    x1={300 + Math.cos(angle) * startRadius}
                    y1={300 + Math.sin(angle) * startRadius}
                    x2={300 + Math.cos(angle) * endRadius}
                    y2={300 + Math.sin(angle) * endRadius}
                    stroke="rgba(102, 126, 234, 0.2)"
                    strokeWidth="1"
                    strokeDasharray="5,5"
                    animate={{
                      pathLength: [0, 1, 0],
                      opacity: [0, 0.5, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.svg>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loading;

