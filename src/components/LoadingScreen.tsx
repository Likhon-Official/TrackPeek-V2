import React, { useState, useEffect } from 'react';
import { Terminal, Zap, Shield, Eye } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  
  const loadingSteps = [
    'Initializing security protocols...',
    'Establishing encrypted connection...',
    'Loading fingerprint modules...',
    'Activating surveillance systems...',
    'TrackPeek ready for deployment'
  ];

  useEffect(() => {
    let progressValue = 0;
    let stepIndex = 0;

    const progressInterval = setInterval(() => {
      progressValue += Math.random() * 15 + 10; // Faster progress
      
      if (progressValue >= 100) {
        progressValue = 100;
        setProgress(100);
        setDisplayText(loadingSteps[loadingSteps.length - 1]);
        clearInterval(progressInterval);
        
        // Complete loading after showing 100%
        setTimeout(() => {
          onComplete();
        }, 800);
      } else {
        setProgress(progressValue);
        
        // Update step text based on progress
        const newStepIndex = Math.min(
          Math.floor((progressValue / 100) * (loadingSteps.length - 1)), 
          loadingSteps.length - 1
        );
        
        if (newStepIndex !== stepIndex) {
          stepIndex = newStepIndex;
          setCurrentStep(stepIndex);
          setDisplayText(loadingSteps[stepIndex]);
        }
      }
    }, 120); // Faster interval

    // Reduced fallback timeout
    const fallbackTimeout = setTimeout(() => {
      setProgress(100);
      clearInterval(progressInterval);
      setTimeout(() => {
        onComplete();
      }, 300);
    }, 2500); // Shorter fallback

    return () => {
      clearInterval(progressInterval);
      clearTimeout(fallbackTimeout);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Simplified animated background - CSS only */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(90deg, #00ff41 1px, transparent 1px),
              linear-gradient(#00ff41 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'pulse 2s infinite'
          }}
        />
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto p-6">
        {/* Logo animation */}
        <div className="mb-8">
          <div className="relative inline-block">
            <Terminal size={64} className="text-green-400 animate-pulse" />
            <div className="absolute -top-2 -right-2">
              <Eye size={24} className="text-red-500 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-green-400 mb-2 font-mono">
          TrackPeek
        </h1>
        <p className="text-green-300 text-sm mb-8 font-mono">
          Digital Fingerprint Tracker
        </p>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-cyan-400 transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-green-400 mt-2 font-mono">
            <span>Loading...</span>
            <span>{Math.round(Math.min(progress, 100))}%</span>
          </div>
        </div>

        {/* Loading text */}
        <div className="text-green-400 font-mono text-sm min-h-[20px]">
          {displayText}
          <span className="animate-pulse">_</span>
        </div>

        {/* Security indicators */}
        <div className="flex justify-center gap-4 mt-8">
          <div className="flex items-center gap-2 text-xs text-green-500">
            <Shield size={12} />
            <span>SECURE</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-yellow-500">
            <Zap size={12} />
            <span>ACTIVE</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-red-500">
            <Eye size={12} />
            <span>MONITORING</span>
          </div>
        </div>
      </div>

      {/* Simplified scanlines effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full w-full opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #00ff41 2px, #00ff41 4px)',
          animation: 'scanlines 0.1s linear infinite'
        }}></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
