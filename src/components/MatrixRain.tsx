import React, { useEffect, useRef, useState } from 'react';

interface MatrixRainProps {
  intensity?: number;
  className?: string;
}

const MatrixRain: React.FC<MatrixRainProps> = ({ intensity = 0.02, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Check if device can handle canvas animation
    const checkPerformance = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
      const isSlowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
      
      // Disable canvas on low-performance devices
      if (isMobile || isLowMemory || isSlowCPU) {
        setShouldRender(false);
      }
    };

    checkPerformance();
  }, []);

  useEffect(() => {
    if (!shouldRender) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(Math.min(columns, 100)).fill(1); // Limit columns

    let lastTime = 0;
    const targetFPS = 20; // Lower FPS for better performance
    const frameInterval = 1000 / targetFPS;

    // Animation function
    const animate = (currentTime: number) => {
      if (currentTime - lastTime < frameInterval) {
        if (isVisible) {
          animationRef.current = requestAnimationFrame(animate);
        }
        return;
      }
      
      lastTime = currentTime;

      // Semi-transparent black background for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px monospace`;

      // Only update some drops each frame
      const dropsToUpdate = Math.ceil(drops.length * 0.2);
      for (let i = 0; i < dropsToUpdate; i++) {
        const dropIndex = Math.floor(Math.random() * drops.length);
        
        // Random character
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        // Draw character
        ctx.fillText(char, dropIndex * fontSize, drops[dropIndex] * fontSize);

        // Reset drop randomly or when it reaches bottom
        if (drops[dropIndex] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[dropIndex] = 0;
        }
        
        drops[dropIndex]++;
      }

      if (isVisible) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (isVisible) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, intensity, shouldRender]);

  // Pause animation when not visible for performance
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Return CSS fallback for low-performance devices
  if (!shouldRender) {
    return (
      <div 
        className={`fixed inset-0 pointer-events-none opacity-10 ${className}`}
        style={{ 
          zIndex: 0,
          backgroundImage: `
            linear-gradient(90deg, #00ff41 1px, transparent 1px),
            linear-gradient(#00ff41 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'pulse 3s infinite'
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none opacity-20 ${className}`}
      style={{ zIndex: 0 }}
    />
  );
};

export default MatrixRain;
