import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sliders, 
  Eye, 
  Type, 
  Activity, 
  Volume2, 
  Vibrate, 
  CheckCircle2,
  Sparkles,
  ChevronLeft
} from 'lucide-react';

export const AccessibilitySettings: React.FC = () => {
  const { accessibility, updateAccessibility, showToast, triggerAudioCue, goBack } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-obsidian-800">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="p-2 rounded-xl bg-obsidian-900 hover:bg-obsidian-800 text-slate-400 hover:text-white border border-obsidian-800 transition-colors"
            title="Go back"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
                <Sliders className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Accessibility Settings</h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize display, contrast, typography, and sensory cues to match your communication preferences.
            </p>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="space-y-4">
        {/* 1. High Contrast */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800 text-cyan-400 mt-0.5">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold text-white">High Contrast Display</div>
              <div className="text-xs text-slate-400 max-w-md mt-0.5">
                Increases contrast to WCAG AAA standards with dark black backgrounds and vivid cyan accents.
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              updateAccessibility({ highContrast: !accessibility.highContrast });
              showToast(`High contrast ${!accessibility.highContrast ? 'enabled' : 'disabled'}`, 'info');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              accessibility.highContrast ? 'bg-cyan-400 text-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {accessibility.highContrast ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* 2. Text Scaling */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800 text-indigo-400 mt-0.5">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold text-white">Typography & Font Scaling</div>
              <div className="text-xs text-slate-400 max-w-md mt-0.5">
                Scales all button labels, sign glosses, and dialogue messages for optimal readability.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {(['normal', 'large', 'xlarge'] as const).map((size) => (
              <button
                key={size}
                onClick={() => updateAccessibility({ fontSize: size })}
                className={`py-2.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                  accessibility.fontSize === size
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {size} {size === 'xlarge' ? '(Max)' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Reduced Motion */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800 text-amber-400 mt-0.5">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold text-white">Reduced Motion</div>
              <div className="text-xs text-slate-400 max-w-md mt-0.5">
                Minimizes screen transitions, pulse animations, and parallax effects for users with vestibular sensitivities.
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              updateAccessibility({ reducedMotion: !accessibility.reducedMotion });
              showToast(`Reduced motion ${!accessibility.reducedMotion ? 'enabled' : 'disabled'}`, 'info');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              accessibility.reducedMotion ? 'bg-amber-400 text-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {accessibility.reducedMotion ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* 4. Audio Feedback Chimes */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800 text-emerald-400 mt-0.5">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold text-white">Audio Feedback Chimes</div>
              <div className="text-xs text-slate-400 max-w-md mt-0.5">
                Plays subtle audio tones when signs are recognized, turns are committed, or errors occur.
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              const next = !accessibility.audioFeedback;
              updateAccessibility({ audioFeedback: next });
              if (next) triggerAudioCue('detect');
              showToast(`Detection chimes ${next ? 'enabled' : 'disabled'}`, 'info');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              accessibility.audioFeedback ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {accessibility.audioFeedback ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>

      {/* Screen Reader & Standards Compliance Notice */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1.5">
        <div className="font-bold text-slate-200 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>WCAG 2.1 Level AA & AAA Design</span>
        </div>
        <p>
          SignEdge implements accessible keyboard focus rings, semantic landmark roles, ARIA live regions for speech transcription, and minimum 48px touch targets for mobile accessibility.
        </p>
      </div>
    </div>
  );
};
