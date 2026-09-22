import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { defaultSpeechEngine } from '../ai/speechEngine';
import { 
  Mic, 
  MicOff, 
  Trash2, 
  Copy, 
  Check, 
  Volume2, 
  Send, 
  Sparkles,
  AlertCircle,
  ChevronLeft 
} from 'lucide-react';

export const SpeechToText: React.FC = () => {
  const { addTurn, showToast, accessibility, goBack } = useApp();
  const [isListening, setIsListening] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [fullHistory, setFullHistory] = useState<string[]>([]);
  const [micError, setMicError] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState<string>('');

  const quickReplies = [
    'Yes, I understand.',
    'No, not quite.',
    'Could you please repeat that?',
    'Please write it down.',
    'Thank you.',
    'One moment, please.'
  ];

  const toggleListening = () => {
    setMicError(null);
    if (isListening) {
      defaultSpeechEngine.stopListening();
      setIsListening(false);
    } else {
      const started = defaultSpeechEngine.startListening({
        onResult: (text, isFinal) => {
          setLiveTranscript(text);
          if (isFinal && text.trim()) {
            setFullHistory(prev => [...prev, text.trim()]);
            addTurn({
              sender: 'speaker',
              text: text.trim(),
            });
            setLiveTranscript('');
          }
        },
        onError: (err) => {
          setMicError(err);
          setIsListening(false);
        },
        onEnd: () => {
          setIsListening(false);
        }
      });
      setIsListening(started);
    }
  };

  const handleSendManual = () => {
    if (!manualInput.trim()) return;
    setFullHistory(prev => [...prev, manualInput.trim()]);
    addTurn({
      sender: 'speaker',
      text: manualInput.trim(),
    });
    setManualInput('');
  };

  const handleQuickReply = (reply: string) => {
    defaultSpeechEngine.speak(reply);
    addTurn({
      sender: 'signer',
      text: reply,
    });
    showToast(`Responded: "${reply}"`, 'info');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
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
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                <Mic className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Speech → Text Captions</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              High-contrast, large-print speech captioning for deaf and hard-of-hearing users.
            </p>
          </div>
        </div>

        {fullHistory.length > 0 && (
          <button
            onClick={() => setFullHistory([])}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-300"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Captions</span>
          </button>
        )}
      </div>

      {/* Primary Microphone Trigger Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
              isListening ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse' : 'bg-slate-800 text-slate-400'
            }`}>
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isListening ? 'Listening to voice...' : 'Microphone Ready'}
              </h3>
              <p className="text-xs text-slate-400">
                {isListening ? 'Spoken language will appear below in real time' : 'Tap to start live speech captioning'}
              </p>
            </div>
          </div>

          <button
            onClick={toggleListening}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95 ${
              isListening 
                ? 'bg-rose-600 hover:bg-rose-500 text-white' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
            }`}
          >
            {isListening ? 'Stop Listening' : 'Start Speech Captioning'}
          </button>
        </div>

        {micError && (
          <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{micError}</span>
          </div>
        )}
      </div>

      {/* Live Big Caption Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl min-h-[220px] flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
            <span>Live Captions</span>
            {isListening && (
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Live Audio Stream</span>
              </span>
            )}
          </div>

          {liveTranscript || fullHistory.length > 0 ? (
            <div className="space-y-3">
              {fullHistory.map((line, idx) => (
                <p key={idx} className="text-lg sm:text-2xl font-semibold text-slate-300 leading-relaxed">
                  {line}
                </p>
              ))}

              {liveTranscript && (
                <p className="text-xl sm:text-3xl font-extrabold text-cyan-300 leading-relaxed animate-pulse">
                  {liveTranscript}
                </p>
              )}
            </div>
          ) : (
            <div className="h-28 flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
              <Sparkles className="w-6 h-6 text-slate-600" />
              <p className="text-sm">Speak into the microphone to display live captions here.</p>
            </div>
          )}
        </div>

        {/* Manual Keyboard Fallback Input */}
        <div className="pt-4 border-t border-slate-800 mt-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendManual()}
              placeholder="Or type spoken text manually here..."
              className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
            />
            <button
              onClick={handleSendManual}
              disabled={!manualInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white font-bold text-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Response Chips for Deaf/Hard-of-Hearing Users */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          One-Tap Quick Voice Responses
        </h4>
        <div className="flex flex-wrap gap-2">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              onClick={() => handleQuickReply(reply)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{reply}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
