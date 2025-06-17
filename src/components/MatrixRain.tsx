import React from 'react';

interface MatrixRainProps {
  intensity?: number;
  className?: string;
}

const MatrixRain: React.FC<MatrixRainProps> = ({ className = '' }) => {
  // Pure CSS implementation - no canvas, no JavaScript animation
  // This ensures compatibility with all build environments including GitHub Pages
  
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
        animation: 'matrixPulse 4s infinite ease-in-out'
      }}
    >
      {/* Additional matrix-like effect using CSS only */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              #00ff41 2px,
              #00ff41 3px
            )
          `,
          backgroundSize: '100% 20px',
          animation: 'matrixScan 2s linear infinite'
        }}
      />
      
      {/* Floating matrix characters using CSS */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-green-400 font-mono text-sm opacity-20 animate-pulse"
            style={{
              left: `${(i * 5) % 100}%`,
              top: `${(i * 7) % 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + (i % 3)}s`
            }}
          >
            {['0', '1', 'ア', 'イ', 'ウ'][i % 5]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatrixRain;
