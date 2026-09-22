import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { defaultSpeechEngine } from '../ai/speechEngine';
import { 
  Globe, 
  Volume2, 
  HandMetal, 
  Sliders, 
  Check, 
  Play, 
  Sparkles 
} from 'lucide-react';

export const LanguageSettings: React.FC = () => {
  const { language, updateLanguage, showToast } = useApp();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');

  useEffect(() => {
    const list = defaultSpeechEngine.getAvailableVoices();
    setVoices(list);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        setVoices(defaultSpeechEngine.getAvailableVoices());
      };
    }
  }, []);

  const handleTestVoice = () => {
    defaultSpeechEngine.speak('Hello! This is SignEdge on-device speech synthesis.', {
      onError: (err) => showToast('Voice synthesis test error', 'error')
    });
  };

  const dialects = [
    {
      id: 'ASL' as const,
      name: 'American Sign Language (ASL)',
      status: 'Primary On-Device Model',
      signsCount: '21 signs'
    },
    {
      id: 'ISL' as const,
      name: 'Indian Sign Language (ISL)',
      status: 'Universal Core Cues',
      signsCount: 'Core vocabulary'
    },
    {
      id: 'BSL' as const,
      name: 'British Sign Language (BSL)',
      status: 'Visual Cues Set',
      signsCount: 'Core vocabulary'
    }
  ];

  const spokenLocales = [
    { code: 'en-US', label: 'English (United States)' },
    { code: 'en-GB', label: 'English (United Kingdom)' },
    { code: 'es-ES', label: 'Spanish (Español)' },
    { code: 'fr-FR', label: 'French (Français)' },
    { code: 'hi-IN', label: 'Hindi (हिंदी)' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300">
            <Globe className="w-5 h-5" />
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Language & Voice Settings</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Configure sign language dialect profiles and local speech synthesis voice properties.
        </p>
      </div>

      {/* Sign Language Dialect Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <HandMetal className="w-4 h-4 text-cyan-400" />
          <span>Supported Sign Language Dialect</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {dialects.map((dialect) => {
            const isSelected = language.signDialect === dialect.id;
            return (
              <button
                key={dialect.id}
                onClick={() => {
                  updateLanguage({ signDialect: dialect.id });
                  showToast(`Sign dialect set to ${dialect.name}`, 'info');
                }}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-brand-600/20 border-brand-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-white">{dialect.id}</span>
                  {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                </div>
                <div className="text-xs text-slate-300">{dialect.name}</div>
                <div className="text-[11px] text-slate-500 mt-2">{dialect.status}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Spoken Voice & Locale Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-brand-400" />
          <span>Speech Recognition & Synthesis Configuration</span>
        </h3>

        {/* Spoken Locale Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">
            Spoken Language & Accent
          </label>
          <select
            value={language.spokenLang}
            onChange={(e) => updateLanguage({ spokenLang: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
          >
            {spokenLocales.map((loc) => (
              <option key={loc.code} value={loc.code}>
                {loc.label} ({loc.code})
              </option>
            ))}
          </select>
        </div>

        {/* System Voices Picker */}
        {voices.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              Installed System TTS Voice ({voices.length} detected)
            </label>
            <div className="flex gap-2">
              <select
                value={selectedVoiceURI}
                onChange={(e) => {
                  setSelectedVoiceURI(e.target.value);
                  defaultSpeechEngine.updateSettings({ voiceURI: e.target.value });
                }}
                className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 truncate"
              >
                <option value="">Default System Voice</option>
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>

              <button
                onClick={handleTestVoice}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5"
                title="Test audio speech"
              >
                <Play className="w-3.5 h-3.5 text-cyan-400" />
                <span>Test Voice</span>
              </button>
            </div>
          </div>
        )}

        {/* Speed and Pitch Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Speech Rate</span>
              <span className="font-bold text-white">{language.speechRate}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={language.speechRate}
              onChange={(e) => updateLanguage({ speechRate: parseFloat(e.target.value) })}
              className="w-full accent-brand-500"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Speech Pitch</span>
              <span className="font-bold text-white">{language.speechPitch}x</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.3"
              step="0.1"
              value={language.speechPitch}
              onChange={(e) => updateLanguage({ speechPitch: parseFloat(e.target.value) })}
              className="w-full accent-brand-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
