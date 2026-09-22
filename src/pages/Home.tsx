import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageSquare, 
  HandMetal, 
  Mic, 
  Volume2, 
  Users, 
  Eye, 
  BookOpen, 
  ShieldCheck, 
  Wifi, 
  WifiOff, 
  Cpu, 
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const Home: React.FC = () => {
  const { 
    navigateTo, 
    isOnline, 
    deviceTier, 
    conversations, 
    accessibility, 
    updateAccessibility 
  } = useApp();

  const featureCards = [
    {
      title: 'Sign → Text',
      desc: 'Real-time temporal hand & body sign recognition into readable text.',
      screen: 'sign-to-text' as const,
      icon: HandMetal,
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-300'
    },
    {
      title: 'Sign → Speech',
      desc: 'Hands-free communication converting recognized sign language directly into audio voice.',
      screen: 'sign-to-speech' as const,
      icon: Volume2,
      color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-300'
    },
    {
      title: 'Speech → Text',
      desc: 'Large-caption speech transcription designed for deaf and hard-of-hearing users.',
      screen: 'speech-to-text' as const,
      icon: Mic,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300'
    },
    {
      title: 'Speech → Visual Cues',
      desc: 'Translates spoken phrases into supported visual sign sequences and directional cues.',
      screen: 'speech-to-visual-cues' as const,
      icon: Eye,
      color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-300'
    },
    {
      title: 'Conversation Mode',
      desc: 'Two-way face-to-face screen with dual directional view for seated dialogue.',
      screen: 'conversation-mode' as const,
      icon: Users,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-300'
    },
    {
      title: 'Supported Signs Dictionary',
      desc: 'Browse all supported signs, motion steps, and visual cue animations.',
      screen: 'supported-signs' as const,
      icon: BookOpen,
      color: 'from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-300'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-6 sm:p-10 shadow-2xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/15 border border-brand-500/30 text-brand-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Public Accessibility Platform • Offline-First</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            SignEdge
            <span className="block text-xl sm:text-3xl font-semibold bg-gradient-to-r from-brand-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent mt-1">
              Communication without barriers.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            An offline-first, privacy-focused mobile communication platform designed to bridge 
            interaction between supported sign-language users and spoken-language speakers using 
            real-time on-device edge AI.
          </p>

          <div className="pt-2 flex flex-wrap gap-3 sm:gap-4">
            <button
              onClick={() => navigateTo('communication')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-brand-600/30 transition-all active:scale-95"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Launch Communication Mode</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => navigateTo('conversation-mode')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
            >
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Two-Person Face-to-Face</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Health & Architecture Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Core AI Status</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {isOnline ? 'Edge AI Active' : 'Offline Ready'}
            </div>
            <div className="text-[11px] text-slate-500">100% on-device inference</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Privacy Architecture</div>
            <div className="text-sm font-bold text-white mt-0.5">Local Boundary</div>
            <div className="text-[11px] text-slate-500">Zero cloud audio/video logs</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Hardware Tier</div>
            <div className="text-sm font-bold text-white mt-0.5 capitalize">
              {deviceTier} Device Profile
            </div>
            <div className="text-[11px] text-slate-500">Adaptive FPS & buffer tuning</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Active Vocabulary</div>
            <div className="text-sm font-bold text-white mt-0.5">21 Essential Signs</div>
            <div className="text-[11px] text-slate-500">Medical, Emergency, Daily</div>
          </div>
        </div>
      </div>

      {/* Primary Communication Workflows Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span>Communication Modes</span>
          </h2>
          <span className="text-xs text-slate-400">All modes run locally on device</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.screen}
                onClick={() => navigateTo(card.screen)}
                className={`p-5 rounded-2xl border text-left transition-all hover:scale-[1.01] active:scale-[0.99] flex flex-col justify-between bg-gradient-to-br ${card.color} hover:border-slate-600 shadow-md group`}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-center mb-3 text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-white mt-4 pt-2 border-t border-slate-800/60">
                  <span>Open Mode</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Snippet & Quick Accessibility */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Session History Snippet */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Recent Session Messages</h3>
            <button
              onClick={() => navigateTo('history')}
              className="text-xs text-brand-400 hover:text-brand-300 font-medium"
            >
              View Full History →
            </button>
          </div>

          {conversations.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No conversations logged yet. Start communication to build local transcripts.
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.slice(-3).map((turn) => (
                <div 
                  key={turn.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5 truncate pr-2">
                    <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider">
                      {turn.sender === 'signer' ? 'Visual Sign' : 'Voice Speech'}
                    </span>
                    <p className="text-slate-200 font-medium truncate">"{turn.text}"</p>
                  </div>
                  <span className="text-slate-500 whitespace-nowrap text-[11px]">
                    {new Date(turn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Accessibility Controls */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Quick Accessibility</h3>
          
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">High Contrast Mode</span>
              <button
                onClick={() => updateAccessibility({ highContrast: !accessibility.highContrast })}
                className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                  accessibility.highContrast ? 'bg-cyan-400 text-black' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {accessibility.highContrast ? 'Active' : 'Off'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-300">Text Scaling</span>
              <button
                onClick={() => {
                  const next = accessibility.fontSize === 'normal' ? 'large' : accessibility.fontSize === 'large' ? 'xlarge' : 'normal';
                  updateAccessibility({ fontSize: next });
                }}
                className="px-3 py-1 rounded-full font-semibold bg-slate-800 text-slate-200 uppercase"
              >
                {accessibility.fontSize}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-300">Detection Sound Chimes</span>
              <button
                onClick={() => updateAccessibility({ audioFeedback: !accessibility.audioFeedback })}
                className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                  accessibility.audioFeedback ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {accessibility.audioFeedback ? 'Enabled' : 'Muted'}
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => navigateTo('accessibility-settings')}
                className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
              >
                All Accessibility Options →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
