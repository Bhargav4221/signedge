import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CameraPreview } from '../components/CameraPreview';
import { ConfidenceBar } from '../components/ConfidenceBar';
import { defaultLanguageProcessor } from '../ai/languageProcessor';
import { RecognitionResult } from '../ai/types';
import { 
  Copy, 
  Trash2, 
  Check, 
  HandMetal, 
  Sparkles, 
  Send,
  Sliders
} from 'lucide-react';

export const SignToText: React.FC = () => {
  const { addTurn, showToast, accessibility } = useApp();
  const [accumulatedText, setAccumulatedText] = useState<string>('');
  const [lastRecognized, setLastRecognized] = useState<RecognitionResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleRecognized = (result: RecognitionResult) => {
    setLastRecognized(result);
    if (result.isStable) {
      const processed = defaultLanguageProcessor.processGloss(result.gloss);
      setAccumulatedText(prev => {
        if (!prev) return processed.naturalText;
        if (prev.endsWith(processed.naturalText)) return prev;
        return `${prev} ${processed.naturalText}`;
      });
    }
  };

  const handleCopy = () => {
    if (!accumulatedText) return;
    navigator.clipboard.writeText(accumulatedText);
    setCopied(true);
    showToast('Copied text to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToSession = async () => {
    if (!accumulatedText.trim()) return;
    await addTurn({
      sender: 'signer',
      text: accumulatedText.trim(),
      gloss: lastRecognized?.gloss,
      confidence: lastRecognized?.confidence,
      category: lastRecognized?.category
    });
    showToast('Sent to conversation log', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
              <HandMetal className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Sign → Text Mode</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Continuous on-device temporal sign recognition into large, clear written text.
          </p>
        </div>

        {accumulatedText && (
          <button
            onClick={() => setAccumulatedText('')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-300 hover:bg-slate-800"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Text</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Camera Feed */}
        <div className="space-y-3">
          <CameraPreview onRecognized={handleRecognized} />
          
          <ConfidenceBar
            confidence={lastRecognized?.confidence || 0}
            isStable={lastRecognized?.isStable || false}
            label="Gesture Match Stability"
          />

          {lastRecognized && (
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-400">Current Sign Match:</span>
              <span className="font-bold text-cyan-400 font-mono">
                {lastRecognized.gloss} ({Math.round(lastRecognized.confidence * 100)}%)
              </span>
            </div>
          )}
        </div>

        {/* Large Text Display Card */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl min-h-[300px] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                <span>Accumulated Output</span>
                <span className="text-cyan-400 font-semibold">Live Feed</span>
              </div>

              {accumulatedText ? (
                <p className="text-2xl sm:text-3xl font-extrabold text-white leading-relaxed tracking-wide animate-in fade-in duration-200">
                  {accumulatedText}
                </p>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
                  <Sparkles className="w-8 h-8 text-slate-600 animate-pulse" />
                  <p className="text-sm">Perform signs into the camera to generate text.</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!accumulatedText}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-slate-200 border border-slate-700 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleSendToSession}
                disabled={!accumulatedText}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 disabled:opacity-40 text-xs font-bold text-white shadow-md transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Save to History</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
