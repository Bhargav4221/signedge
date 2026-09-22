import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface ConfidenceBarProps {
  confidence: number; // 0.0 - 1.0
  isStable?: boolean;
  label?: string;
}

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  confidence,
  isStable = false,
  label = 'Inference Confidence'
}) => {
  const { accessibility } = useApp();
  const percentage = Math.round(Math.min(1.0, Math.max(0, confidence)) * 100);

  const getStatusColor = () => {
    if (percentage >= 75 && isStable) return 'bg-emerald-400';
    if (percentage >= 65) return 'bg-cyan-400';
    if (percentage >= 50) return 'bg-amber-400';
    return 'bg-rose-400';
  };

  const getStatusLabel = () => {
    if (percentage >= 75 && isStable) return 'High Confidence (Stable)';
    if (percentage >= 65) return 'Recognizing';
    if (percentage >= 50) return 'Analyzing Movement';
    return 'Calibrating';
  };

  return (
    <div 
      className="space-y-1.5"
      role="status"
      aria-label={`${label}: ${percentage}%, ${getStatusLabel()}`}
    >
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium flex items-center gap-1.5">
          {isStable && percentage >= 75 ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-slate-500" />
          )}
          <span>{label}</span>
        </span>
        <span className="font-semibold text-slate-200">
          {percentage}% — <span className="text-slate-400 font-normal">{getStatusLabel()}</span>
        </span>
      </div>

      {/* Progress Track */}
      <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 rounded-full ${getStatusColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
