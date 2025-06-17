import React, { useEffect, useRef, useState } from 'react';

interface MatrixRainProps {
  intensity?: number;
  className?: string;
}

const MatrixRain: React.FC<MatrixRainProps> = ({ intensity = 0.02, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // More robust performance and compatibility checking
    const checkPerformance = () => {
      try {
        // Check if we're in a browser environment
        if (typeof window === 'undefined' || typeof document === 'undefined') {
          setShouldRender(false);
          return;
        }

        // Check for canvas support
        const testCanvas = document.createElement('canvas');
        const testContext = testCanvas.getContext('2d');
        if (!testContext) {
          setShouldRender(false);
          return;
        }

        // Check for basic browser capabilities
        const hasRequestAnimationFrame = typeof requestAnimationFrame !== 'undefined';
        const hasPerformanceNow = typeof performance !== 'undefined' && typeof performance.now === 'function';
        
        if (!hasRequestAnimationFrame || !hasPerformanceNow) {
          setShouldRender(false);
          return;
        }

        // Device capability checks
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
        const isSlowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        
        // Check if running in CI environment (GitHub Actions)
        const isCI = typeof process !== 'undefined' && (
          process.env?.CI === 'true' || 
          process.env?.GITHUB_ACTIONS === 'true' ||
          navigator.userAgent.includes('HeadlessChrome')
        );

        // Disable canvas on low-performance devices or CI environments
        if (isMobile || isLowMemory || isSlowCPU || isCI) {
          setShouldRender(false);
        } else {
          setShouldRender(true);
        }
      } catch (error) {
        console.warn('MatrixRain: Performance check failed, disabling canvas animation', error);
        setShouldRender(false);
      }
    };

    // Delay the check to ensure DOM is ready
    const timer = setTimeout(() => {
      checkPerformance();
      setIsInitialized(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!shouldRender || !isInitialized) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx: CanvasRenderingContext2D | null = null;
    
    try {
      ctx = canvas.getContext('2d');
      if (!ctx) {
        console.warn('MatrixRain: Could not get 2D context');
        return;
      }
    } catch (error) {
      console.warn('MatrixRain: Canvas context error', error);
      return;
    }

    // Set canvas size with error handling
    const resizeCanvas = () => {
      try {
        if (!canvas) return;
        
        const width = Math.min(window.innerWidth, 1920); // Cap max width
        const height = Math.min(window.innerHeight, 1080); // Cap max height
        
        canvas.width = width;
        canvas.height = height;
      } catch (error) {
        console.warn('MatrixRain: Resize error', error);
      }
    };
    
    resizeCanvas();
    
    // Add resize listener with error handling
    const handleResize = () => {
      try {
        resizeCanvas();
      } catch (error) {
        console.warn('MatrixRain: Resize handler error', error);
      }
    };
    
    window.addEventListener('resize', handleResize);

    // Matrix characters
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    const columns = Math.min(Math.floor(canvas.width / fontSize), 100); // Limit columns
    const drops: number[] = Array(columns).fill(1);

    let lastTime = 0;
    const targetFPS = 15; // Even lower FPS for better performance
    const frameInterval = 1000 / targetFPS;
    let frameCount = 0;

    // Animation function with comprehensive error handling
    const animate = (currentTime: number) => {
      try {
        if (!isVisible || !ctx || !canvas) {
          return;
        }

        if (currentTime - lastTime < frameInterval) {
          if (isVisible) {
            animationRef.current = requestAnimationFrame(animate);
          }
          return;
        }
        
        lastTime = currentTime;
        frameCount++;

        // Reduce frequency of operations for better performance
        if (frameCount % 2 === 0) {
          // Semi-transparent black background for trail effect
          ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.fillStyle = '#00ff41';
        ctx.font = `${fontSize}px monospace`;

        // Only update a small subset of drops each frame
        const dropsToUpdate = Math.max(1, Math.ceil(drops.length * 0.1));
        for (let i = 0; i < dropsToUpdate; i++) {
          const dropIndex = Math.floor(Math.random() * drops.length);
          
          // Random character
          const char = chars[Math.floor(Math.random() * chars.length)];
          
          // Draw character with error handling
          try {
            ctx.fillText(char, dropIndex * fontSize, drops[dropIndex] * fontSize);
          } catch (error) {
            // Ignore individual draw errors
          }

          // Reset drop randomly or when it reaches bottom
          if (drops[dropIndex] * fontSize > canvas.height && Math.random() > 0.98) {
            drops[dropIndex] = 0;
          }
          
          drops[dropIndex]++;
        }

        if (isVisible) {
          animationRef.current = requestAnimationFrame(animate);
        }
      } catch (error) {
        console.warn('MatrixRain: Animation error', error);
        // Stop animation on error
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      }
    };

    if (isVisible) {
      try {
        animationRef.current = requestAnimationFrame(animate);
      } catch (error) {
        console.warn('MatrixRain: Failed to start animation', error);
      }
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        try {
          cancelAnimationFrame(animationRef.current);
        } catch (error) {
          console.warn('MatrixRain: Cleanup error', error);
        }
      }
    };
  }, [isVisible, intensity, shouldRender, isInitialized]);

  // Pause animation when not visible for performance
  useEffect(() => {
    const handleVisibilityChange = () => {
      try {
        setIsVisible(!document.hidden);
      } catch (error) {
        console.warn('MatrixRain: Visibility change error', error);
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, []);

  // Return CSS fallback for low-performance devices or when canvas is not supported
  if (!shouldRender || !isInitialized) {
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
      onError={() => {
        console.warn('MatrixRain: Canvas error, falling back to CSS');
        setShouldRender(false);
      }}
    />
  );
};

export default MatrixRain;
