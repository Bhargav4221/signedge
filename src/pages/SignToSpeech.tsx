import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CameraPreview } from '../components/CameraPreview';
import { ConfidenceBar } from '../components/ConfidenceBar';
import { defaultSpeechEngine } from '../ai/speechEngine';
import { defaultLanguageProcessor } from '../ai/languageProcessor';
import { RecognitionResult } from '../ai/types';
import { 
  Volume2, 
  RotateCcw, 
  Settings2, 
  Sparkles, 
  CheckCircle2,
  VolumeX,
  ChevronLeft
} from 'lucide-react';

export const SignToSpeech: React.FC = () => {
  const { addTurn, language, updateLanguage, showToast, goBack } = useApp();
  const [lastSpoken, setLastSpoken] = useState<string>('');
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);
  const [isSpeakingNow, setIsSpeakingNow] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<RecognitionResult | null>(null);

  const lastSpokenRef = useRef<string>('');

  const handleRecognized = (result: RecognitionResult) => {
    setCurrentResult(result);

    if (result.isStable && autoSpeak) {
      const processed = defaultLanguageProcessor.processGloss(result.gloss);
      const textToSpeak = processed.naturalText;

      // Throttle repeat speaking of same phrase within 3 seconds
      if (textToSpeak !== lastSpokenRef.current) {
        lastSpokenRef.current = textToSpeak;
        setLastSpoken(textToSpeak);
        speakText(textToSpeak);

        addTurn({
          sender: 'signer',
          text: textToSpeak,
          gloss: result.gloss,
          confidence: result.confidence,
          category: result.category
        });
      }
    }
  };

  const speakText = (text: string) => {
    if (!text) return;
    setIsSpeakingNow(true);
    defaultSpeechEngine.speak(text, {
      onEnd: () => setIsSpeakingNow(false),
      onError: () => setIsSpeakingNow(false)
    });
  };

  const handleManualReplay = () => {
    if (lastSpoken) {
      speakText(lastSpoken);
      showToast('Replaying spoken phrase', 'info');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="p-2 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-slate-300 border border-slate-700/80 transition-all active:scale-95"
            title="Go back"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300">
                <Volume2 className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Sign → Speech Mode</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Hands-free direct voice output: on-device signs speak audibly in real time.
            </p>
          </div>
        </div>

        {/* Auto-Speak Toggle */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          <span className="text-xs text-slate-300 font-medium">Auto-Speak:</span>
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors ${
              autoSpeak ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {autoSpeak ? 'Enabled' : 'Paused'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Camera View */}
        <div className="space-y-3">
          <CameraPreview onRecognized={handleRecognized} />

          <ConfidenceBar
            confidence={currentResult?.confidence || 0}
            isStable={currentResult?.isStable || false}
            label="Speech Trigger Threshold (75%+)"
          />

          {currentResult && (
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-400">Current Sign:</span>
              <span className="font-bold text-blue-400 font-mono">
                {currentResult.gloss}
              </span>
            </div>
          )}
        </div>

        {/* Spoken Output Display & Audio Controls */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
              <span>Audible Output Status</span>
              {isSpeakingNow ? (
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold animate-pulse">
                  <Volume2 className="w-4 h-4" />
                  <span>Speaking Now</span>
                </span>
              ) : (
                <span className="text-slate-500">Ready</span>
              )}
            </div>

            {/* Last Spoken Words */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 min-h-[140px] flex flex-col justify-center">
              {lastSpoken ? (
                <div className="space-y-2">
                  <span className="text-[11px] text-cyan-400 font-semibold uppercase tracking-wider">
                    Last Spoken Statement
                  </span>
                  <p className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
                    "{lastSpoken}"
                  </p>
                </div>
              ) : (
                <div className="text-center text-slate-500 text-sm space-y-2">
                  <Sparkles className="w-6 h-6 mx-auto text-slate-600" />
                  <p>Perform a sign to trigger automatic speech synthesis.</p>
                </div>
              )}
            </div>

            {/* Replay Button */}
            <button
              onClick={handleManualReplay}
              disabled={!lastSpoken}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white text-sm font-bold shadow-md transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Replay Last Spoken Words</span>
            </button>

            {/* Speech Sliders: Speed & Pitch */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Voice Speed ({language.speechRate}x)</span>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={language.speechRate}
                  onChange={(e) => updateLanguage({ speechRate: parseFloat(e.target.value) })}
                  className="w-32 accent-blue-500"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Voice Pitch ({language.speechPitch}x)</span>
                <input
                  type="range"
                  min="0.7"
                  max="1.3"
                  step="0.1"
                  value={language.speechPitch}
                  onChange={(e) => updateLanguage({ speechPitch: parseFloat(e.target.value) })}
                  className="w-32 accent-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
