import React, { useState, useEffect } from 'react';
import { SignDefinition, VisualSignSequence } from '../ai/types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  ArrowUp, 
  ArrowDown, 
  ArrowRight, 
  Repeat, 
  Activity 
} from 'lucide-react';

interface VisualCuePlayerProps {
  sequence?: VisualSignSequence | null;
  singleSign?: SignDefinition | null;
  autoPlay?: boolean;
}

export const VisualCuePlayer: React.FC<VisualCuePlayerProps> = ({
  sequence,
  singleSign,
  autoPlay = true
}) => {
  const signs = sequence?.mappedSigns || (singleSign ? [singleSign] : []);
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);

  const activeSign = signs[currentSignIndex] || null;
  const currentStep = activeSign?.visualCues[currentStepIndex] || null;
  const totalSteps = activeSign?.visualCues.length || 1;

  // Auto-advancement playback timer
  useEffect(() => {
    if (!isPlaying || !activeSign || totalSteps === 0) return;

    const stepInterval = Math.max(700, Math.floor(1800 / speedMultiplier));
    const timer = setInterval(() => {
      setCurrentStepIndex(prevStep => {
        if (prevStep < totalSteps - 1) {
          return prevStep + 1;
        } else {
          // Move to next sign in sequence or loop
          setCurrentSignIndex(prevSign => {
            if (prevSign < signs.length - 1) {
              return prevSign + 1;
            }
            return 0; // Loop back
          });
          return 0;
        }
      });
    }, stepInterval);

    return () => clearInterval(timer);
  }, [isPlaying, activeSign, totalSteps, signs.length, speedMultiplier]);

  // Reset indices when signs change
  useEffect(() => {
    setCurrentSignIndex(0);
    setCurrentStepIndex(0);
  }, [sequence, singleSign]);

  if (!activeSign || !currentStep) {
    return (
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 text-center text-slate-400">
        <Activity className="w-8 h-8 mx-auto mb-2 text-slate-600" />
        <p className="text-sm">No visual sign sequence loaded</p>
      </div>
    );
  }

  // Render directional motion arrow icon
  const renderDirectionIcon = (direction?: string) => {
    switch (direction) {
      case 'up':
        return <ArrowUp className="w-7 h-7 text-cyan-400 animate-bounce" />;
      case 'down':
        return <ArrowDown className="w-7 h-7 text-cyan-400 animate-bounce" />;
      case 'forward':
        return <ArrowRight className="w-7 h-7 text-brand-400 animate-pulse" />;
      case 'circular':
        return <Repeat className="w-7 h-7 text-purple-400 animate-spin" />;
      case 'wave':
        return <Activity className="w-7 h-7 text-amber-400 animate-pulse" />;
      default:
        return <ArrowRight className="w-7 h-7 text-cyan-400" />;
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
      {/* Header Banner */}
      <div className="px-5 py-3.5 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
              GLOSS: {activeSign.gloss}
            </span>
            {signs.length > 1 && (
              <span className="text-xs text-slate-400">
                Sign {currentSignIndex + 1} of {signs.length}
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-white mt-0.5">{activeSign.name}</h3>
        </div>

        {/* Speed Toggle */}
        <button
          onClick={() => setSpeedMultiplier(prev => (prev === 1.0 ? 0.6 : prev === 0.6 ? 1.4 : 1.0))}
          className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          title="Playback speed"
        >
          {speedMultiplier}x Speed
        </button>
      </div>

      {/* Main Cue Display Area */}
      <div className="p-6 flex flex-col items-center justify-center text-center relative min-h-[220px] bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
        {/* Step Progression Indicators */}
        <div className="flex gap-1.5 mb-4">
          {activeSign.visualCues.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentStepIndex
                  ? 'w-7 bg-cyan-400'
                  : idx < currentStepIndex
                  ? 'w-3 bg-cyan-800'
                  : 'w-3 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Handshape Badge & Position */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm">
            Handshape: {currentStep.handShape}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
            Location: {currentStep.handPositionLabel}
          </span>
        </div>

        {/* Animated Directional Graphic */}
        <div className="w-20 h-20 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center my-2 shadow-inner">
          {renderDirectionIcon(currentStep.arrowDirection)}
        </div>

        {/* Instruction Text */}
        <p className="text-base sm:text-lg font-semibold text-white max-w-md mt-2">
          {currentStep.instruction}
        </p>

        <p className="text-xs text-slate-400 mt-1">
          Step {currentStepIndex + 1} of {totalSteps}
        </p>
      </div>

      {/* Playback Controls */}
      <div className="px-5 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
        <button
          onClick={() => {
            setCurrentStepIndex(prev => Math.max(0, prev - 1));
          }}
          disabled={currentStepIndex === 0 && currentSignIndex === 0}
          className="p-2 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous step"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition-colors"
            aria-label={isPlaying ? 'Pause visual cues' : 'Play visual cues'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={() => {
              setCurrentSignIndex(0);
              setCurrentStepIndex(0);
              setIsPlaying(true);
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-white"
            title="Replay sequence"
            aria-label="Replay sequence"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => {
            if (currentStepIndex < totalSteps - 1) {
              setCurrentStepIndex(prev => prev + 1);
            } else if (currentSignIndex < signs.length - 1) {
              setCurrentSignIndex(prev => prev + 1);
              setCurrentStepIndex(0);
            }
          }}
          disabled={currentStepIndex === totalSteps - 1 && currentSignIndex === signs.length - 1}
          className="p-2 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next step"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
