import React, { useState, useEffect } from 'react';
import { Terminal, Zap, Shield, Eye } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
  progress: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, progress }) => {
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
    const stepIndex = Math.min(Math.floor((progress / 100) * loadingSteps.length), loadingSteps.length - 1);
    if (stepIndex !== currentStep && stepIndex < loadingSteps.length) {
      setCurrentStep(stepIndex);
      setDisplayText(loadingSteps[stepIndex]);
    }
    
    // Ensure completion happens when progress reaches 100
    if (progress >= 100) {
      setTimeout(() => {
        onComplete();
      }, 800);
    }
  }, [progress, onComplete, currentStep, loadingSteps]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Simplified animated background grid */}
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
