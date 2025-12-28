import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const AnimatedBackground = () => {
  const containerRef = useRef(null);
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);
  const blob3Ref = useRef(null);

  useGSAP(() => {
    // Random movement for blobs
    const moveBlob = (target) => {
        if (!target) return;
        
      gsap.to(target, {
        x: 'random(-200, 200)',
        y: 'random(-200, 200)',
        scale: 'random(0.8, 1.2)',
        rotation: 'random(-180, 180)',
        duration: 'random(10, 20)',
        ease: 'sine.inOut',
        onComplete: () => moveBlob(target),
      });
    };

    moveBlob(blob1Ref.current);
    moveBlob(blob2Ref.current);
    moveBlob(blob3Ref.current);

  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
        pointerEvents: 'none',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', // Very light base
      }}
      className="animated-bg"
    >
        {/* Dark mode override handled via CSS or class if needed, checking standard practice */}
        {/* We can rely on global CSS variables if available, but for now hardcode some nice gradients */}
      
      <div
        ref={blob1Ref}
        style={{
          position: 'absolute',
          top: '20%',
          left: '20%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0) 70%)',
          filter: 'blur(40px)',
          opacity: 0.8,
        }}
      />
      <div
        ref={blob2Ref}
        style={{
          position: 'absolute',
          top: '60%',
          right: '20%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(168, 85, 247, 0) 70%)',
          filter: 'blur(50px)',
          opacity: 0.8,
        }}
      />
      <div
        ref={blob3Ref}
        style={{
          position: 'absolute',
          top: '10%',
          right: '30%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, rgba(236, 72, 153, 0) 70%)',
          filter: 'blur(30px)',
          opacity: 0.8,
        }}
      />
      
      {/* Overlay to ensure text readability if needed, or just let the blur do the work */}
      <div 
        style={{
            position: 'absolute',
            inset: 0,
            backdropFilter: 'blur(30px)', // Heavy blur to mesh them together like a lava lamp
            zIndex: 1, // Above blobs, below content
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
