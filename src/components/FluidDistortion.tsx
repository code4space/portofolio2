import { useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import { Fluid } from '@whatisjery/react-fluid-distortion';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import porscheModel from '../assets/stylized_planet/scene.gltf?url';

interface FluidDistortionProps {
  className?: string;
}

// === Model component with smooth parallax scroll ===
const Model = ({ parallaxRef }: { parallaxRef: React.MutableRefObject<number> }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(porscheModel);

  const currentY = useRef(0);

  useFrame((state) => {
    if (groupRef.current) {
      // Read parallax value from ref
      const targetY = parallaxRef.current;

      // Smoothly interpolate to avoid jumps
      currentY.current = THREE.MathUtils.lerp(currentY.current, targetY, 0.1);

      // Apply rotation and parallax movement
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      groupRef.current.position.y = currentY.current + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <primitive
      ref={groupRef}
      object={scene.clone()}
      position={[0, 0, 0]}
      scale={[1, 1, 1]}
      rotation={[0, Math.PI / 4, 0]}
    />
  );
};

// Preload model for performance
useGLTF.preload(porscheModel);

// === Scene with Lights + Model ===
const Scene3D = ({ parallaxRef }: { parallaxRef: React.MutableRefObject<number> }) => {
  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#667eea" />
      <pointLight position={[-10, 5, -10]} intensity={1.2} color="#f093fb" />
      <pointLight position={[0, 10, 5]} intensity={1} color="#4facfe" />
      <directionalLight position={[5, 10, 5]} intensity={0.8} color="#ffffff" castShadow />

      <Suspense fallback={null}>
        <Model parallaxRef={parallaxRef} />
      </Suspense>
    </>
  );
};

// === Main FluidDistortion component ===
const FluidDistortion = ({ className = '' }: FluidDistortionProps) => {
  const parallaxRef = useRef(0);

  useEffect(() => {
    const calculateScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = documentHeight - windowHeight;
      const progress = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;

      // Update parallax offset in ref (no re-render)
      const maxParallax = 3;
      parallaxRef.current = progress * maxParallax;

      // Handle fade-out effect for contact section
    };

    // Throttle scroll events with rAF
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          calculateScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    calculateScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Canvas
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        pointerEvents: 'none',
        zIndex: 0,
        transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance', // better GPU scheduling
      }}
      camera={{ position: [0, 0, 2], fov: 75 }}
      performance={{ min: 0.5 }} // dynamic resolution scaling
    >
      <Scene3D parallaxRef={parallaxRef} />

      <EffectComposer>
        <Fluid
          fluidColor="#667eea"
          backgroundColor="transparent"
          showBackground={false}
          intensity={5}
          force={1}
          distortion={2}
          radius={0.3}
          curl={10}
          swirl={10}
          velocityDissipation={0.99}
          densityDissipation={0.95}
          pressure={0.3}
          rainbow={true}
        />
      </EffectComposer>
    </Canvas>
  );
};

export default FluidDistortion;
