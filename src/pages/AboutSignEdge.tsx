import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Wifi, 
  Cpu, 
  Heart, 
  Globe, 
  Code, 
  CheckCircle2,
  Users
} from 'lucide-react';

export const AboutSignEdge: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Brand Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-400 via-brand-500 to-blue-700 flex items-center justify-center mx-auto shadow-xl shadow-brand-500/20 p-3">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-white">
            <path d="M28 66 C28 58, 32 50, 42 46 C40 38, 45 32, 50 32 C55 32, 57 37, 57 42 C60 40, 65 41, 67 45 C70 47, 72 52, 72 58 C72 70, 62 76, 50 76 C36 76, 28 72, 28 66 Z" fill="currentColor" />
            <circle cx="50" cy="32" r="6" fill="#00e5ff" />
            <circle cx="42" cy="46" r="5" fill="#00e5ff" />
            <circle cx="57" cy="42" r="5" fill="#00e5ff" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-white">SignEdge</h1>
        <p className="text-base font-semibold bg-gradient-to-r from-brand-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
          Communication without barriers.
        </p>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          SignEdge is an offline-first, privacy-focused mobile accessibility communication platform 
          engineered to bridge interaction between supported sign-language users and spoken-language 
          speakers using on-device edge AI.
        </p>
      </div>

      {/* Production Purpose Statement */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-400" />
          <span>Public Accessibility Mission</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          SignEdge is designed as a serious public accessibility application intended for individuals, 
          families, healthcare facilities, schools, public service counters, emergency responders, 
          and accessibility organizations. We reject universal translation hype in favor of 
          rigorous, verified on-device models that deliver reliable communication when it matters most.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Wifi className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-white">Offline-First</h4>
          <p className="text-xs text-slate-400">
            Core sign recognition, reverse cue playback, and dialogue logging function without continuous internet connectivity.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-white">Privacy-Focused</h4>
          <p className="text-xs text-slate-400">
            Camera frames and microphone audio stay strictly on the local device. No conversation telemetry leaves the hardware boundary.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-white">Low-Latency Mobile Edge</h4>
          <p className="text-xs text-slate-400">
            Optimized for smartphone processors with dynamic hardware tiering, frame skipping, and adaptive resolution scaling.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Heart className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-white">Accessibility-First</h4>
          <p className="text-xs text-slate-400">
            WCAG-compliant high contrast modes, large-format typography, reduced motion accommodations, and sensory feedback chimes.
          </p>
        </div>
      </div>

      {/* Version & Technical Specification Card */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-400">
        <div className="flex items-center justify-between text-slate-200 font-semibold pb-2 border-b border-slate-800">
          <span>SignEdge Technical Architecture</span>
          <span className="font-mono text-cyan-400">v1.0.0 Production Release</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1">
          <div>
            <span className="text-slate-500 block text-[10px]">Client Runtime</span>
            <span className="text-white font-medium">React 18 + Vite + TS</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Styling & A11y</span>
            <span className="text-white font-medium">Tailwind CSS (WCAG AAA)</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">On-Device Inference</span>
            <span className="text-white font-medium">Modular Temporal Classifier</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Persistence</span>
            <span className="text-white font-medium">Client IndexedDB</span>
          </div>
        </div>

        <p className="pt-2 text-[11px] text-slate-500 border-t border-slate-900">
          Open-Source Community Accessibility Software • Distributed under the MIT License.
        </p>
      </div>
    </div>
  );
};
