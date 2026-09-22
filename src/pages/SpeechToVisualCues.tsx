import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { defaultVisualCueGenerator } from '../ai/visualCueGenerator';
import { defaultSpeechEngine } from '../ai/speechEngine';
import { VisualCuePlayer } from '../components/VisualCuePlayer';
import { VisualSignSequence } from '../ai/types';
import { 
  Eye, 
  Mic, 
  MicOff, 
  Search, 
  Sparkles, 
  BookOpen, 
  AlertCircle,
  ChevronLeft
} from 'lucide-react';

export const SpeechToVisualCues: React.FC = () => {
  const { showToast, goBack } = useApp();
  const [inputText, setInputText] = useState<string>('Could you please help me find the restroom?');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [sequence, setSequence] = useState<VisualSignSequence | null>(() => 
    defaultVisualCueGenerator.generateCueSequence('Could you please help me find the restroom?')
  );

  const handleTranslate = (text: string) => {
    setInputText(text);
    const seq = defaultVisualCueGenerator.generateCueSequence(text);
    setSequence(seq);
  };

  const toggleMic = () => {
    if (isListening) {
      defaultSpeechEngine.stopListening();
      setIsListening(false);
    } else {
      const started = defaultSpeechEngine.startListening({
        onResult: (text, isFinal) => {
          setInputText(text);
          if (isFinal && text.trim()) {
            handleTranslate(text.trim());
          }
        },
        onError: (err) => {
          showToast(err, 'error');
          setIsListening(false);
        },
        onEnd: () => {
          setIsListening(false);
        }
      });
      setIsListening(started);
    }
  };

  const samplePhrases = [
    'Hello, what is your name?',
    'I need help, please.',
    'Where is the restroom?',
    'I need a doctor and medicine.',
    'Thank you very much, goodbye!',
    'Are you hungry? I need water.'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header with Back Button */}
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
                <Eye className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Speech → Visual Cues</h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Reverse communication: converts spoken or typed words into structured visual sign cue sequences.
            </p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300">
            Spoken or Typed Sentence to Translate into Visual Cues
          </label>
          <span className="text-xs text-slate-500">
            Keyword-mapped to canonical sign gestures
          </span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              handleTranslate(e.target.value);
            }}
            placeholder="Type or speak a phrase (e.g., 'Hello, where is the doctor?')..."
            className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white focus:outline-none focus:border-purple-500"
          />

          <button
            onClick={toggleMic}
            className={`px-4 py-3 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-colors ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
            title="Speak into microphone"
            aria-label="Speak into microphone"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-purple-400" />}
            <span className="hidden sm:inline">{isListening ? 'Stop' : 'Voice'}</span>
          </button>
        </div>

        {/* Sample Phrase Chips */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] text-slate-400 font-medium">Try preset phrase:</span>
          <div className="flex flex-wrap gap-1.5">
            {samplePhrases.map((phrase) => (
              <button
                key={phrase}
                onClick={() => handleTranslate(phrase)}
                className="px-2.5 py-1 rounded-lg text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition-colors"
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Cue Sequence Player */}
      <div className="space-y-4">
        {sequence && sequence.mappedSigns.length > 0 ? (
          <div className="space-y-3">
            <VisualCuePlayer sequence={sequence} />

            {/* In-sequence Mapped Signs Chips */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Mapped Sign Sequence:</span>
              {sequence.mappedSigns.map((sign, idx) => (
                <span
                  key={sign.id}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1"
                >
                  <span className="w-4 h-4 rounded-full bg-purple-500/30 flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <span>{sign.name} ({sign.gloss})</span>
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-10 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-2 text-slate-400">
            <BookOpen className="w-8 h-8 mx-auto text-slate-600" />
            <p className="text-sm font-medium">No supported signs matched in input phrase.</p>
            <p className="text-xs text-slate-500">
              Try words like "help", "hello", "restroom", "water", "doctor", "please", "yes", "no".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
