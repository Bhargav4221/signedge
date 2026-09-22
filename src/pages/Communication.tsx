import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CameraPreview } from '../components/CameraPreview';
import { ConfidenceBar } from '../components/ConfidenceBar';
import { ConversationStream } from '../components/ConversationStream';
import { defaultSpeechEngine } from '../ai/speechEngine';
import { defaultLanguageProcessor } from '../ai/languageProcessor';
import { RecognitionResult } from '../ai/types';
import { 
  Volume2, 
  Mic, 
  MicOff, 
  Send, 
  RotateCcw, 
  Edit3, 
  Check, 
  Trash2, 
  Sparkles,
  Wifi,
  WifiOff,
  AlertCircle
} from 'lucide-react';

export const Communication: React.FC = () => {
  const { 
    isOnline, 
    conversations, 
    addTurn, 
    clearConversations, 
    showToast,
    accessibility 
  } = useApp();

  // Active visual sign recognition state
  const [currentRecognition, setCurrentRecognition] = useState<RecognitionResult | null>(null);
  const [bufferedPhrase, setBufferedPhrase] = useState<string>('');
  const [activeGloss, setActiveGloss] = useState<string>('');
  const [isEditingRecognized, setIsEditingRecognized] = useState<boolean>(false);
  const [editedText, setEditedText] = useState<string>('');

  // Speech recognition (microphone) state
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);
  const [micTranscript, setMicTranscript] = useState<string>('');
  const [micError, setMicError] = useState<string | null>(null);

  // Handle incoming recognized signs from the CameraPreview temporal model
  const handleSignRecognized = (result: RecognitionResult) => {
    setCurrentRecognition(result);
    setActiveGloss(result.gloss);

    // Run gloss through contextual language processor
    const processed = defaultLanguageProcessor.processGloss(result.gloss);
    setBufferedPhrase(processed.naturalText);
    setEditedText(processed.naturalText);
  };

  // Add the recognized sign to the dialogue thread
  const handleCommitSign = async () => {
    const textToCommit = isEditingRecognized ? editedText : bufferedPhrase;
    if (!textToCommit.trim()) return;

    await addTurn({
      sender: 'signer',
      text: textToCommit.trim(),
      gloss: activeGloss || undefined,
      confidence: currentRecognition?.confidence,
      category: currentRecognition?.category
    });

    // Optionally auto-speak upon commit if desired
    defaultSpeechEngine.speak(textToCommit);

    // Reset buffer
    setBufferedPhrase('');
    setActiveGloss('');
    setIsEditingRecognized(false);
    setCurrentRecognition(null);
  };

  // Speak the currently recognized text immediately
  const handleSpeakCurrent = () => {
    const textToSpeak = isEditingRecognized ? editedText : bufferedPhrase;
    if (textToSpeak) {
      defaultSpeechEngine.speak(textToSpeak);
      showToast('Speaking recognized text', 'info');
    }
  };

  // Toggle speech recognition for speaking partner
  const handleToggleMic = () => {
    setMicError(null);
    if (isListeningMic) {
      defaultSpeechEngine.stopListening();
      setIsListeningMic(false);
    } else {
      const started = defaultSpeechEngine.startListening({
        onResult: (text, isFinal) => {
          setMicTranscript(text);
          if (isFinal && text.trim()) {
            addTurn({
              sender: 'speaker',
              text: text.trim(),
            });
            setMicTranscript('');
          }
        },
        onError: (err) => {
          setMicError(err);
          setIsListeningMic(false);
        },
        onEnd: () => {
          setIsListeningMic(false);
        }
      });
      setIsListeningMic(started);
    }
  };

  // Commit manual microphone transcript if user typed or confirmed
  const handleCommitSpeechTranscript = async () => {
    if (!micTranscript.trim()) return;
    await addTurn({
      sender: 'speaker',
      text: micTranscript.trim(),
    });
    setMicTranscript('');
  };

  // Quick preset chips for rapid accessibility input
  const quickPhrases = [
    'I need help, please.',
    'Where is the restroom?',
    'I need water.',
    'Thank you very much.',
    'Yes',
    'No'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Live Communication</h1>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
              isOnline ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
            }`}>
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              <span>{isOnline ? 'Edge AI' : 'Offline'}</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time sign recognition (camera) and speech transcription (mic) on device.
          </p>
        </div>

        {/* Header Clear Button */}
        {conversations.length > 0 && (
          <button
            onClick={clearConversations}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 transition-colors"
            title="Clear all messages in active session"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Session</span>
          </button>
        )}
      </div>

      {/* Main Split Layout: Visual Sign Input (Left) & Spoken / Conversation Thread (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Visual Camera & Sign Recognition (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Camera View */}
          <CameraPreview
            onRecognized={handleSignRecognized}
            showSkeleton={true}
          />

          {/* Real-time Recognition Status & Action Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3.5">
            {/* Gloss & Confidence */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                  {activeGloss ? `GLOSS: ${activeGloss}` : 'READY FOR SIGNS'}
                </span>
                {currentRecognition?.category && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 capitalize">
                    {currentRecognition.category}
                  </span>
                )}
              </div>

              {currentRecognition && (
                <span className="text-xs font-semibold text-slate-300">
                  {Math.round(currentRecognition.confidence * 100)}% Match
                </span>
              )}
            </div>

            {/* Confidence Bar */}
            <ConfidenceBar
              confidence={currentRecognition?.confidence || 0}
              isStable={currentRecognition?.isStable || false}
              label="Temporal Sequence Stability"
            />

            {/* Recognized Phrase Display or Editor */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] text-slate-400 font-semibold mb-1 flex items-center justify-between">
                <span>Recognized Natural Phrase</span>
                <button
                  onClick={() => setIsEditingRecognized(!isEditingRecognized)}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{isEditingRecognized ? 'Cancel Edit' : 'Edit'}</span>
                </button>
              </div>

              {isEditingRecognized ? (
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full bg-slate-900 text-white text-base font-semibold px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-brand-500"
                  placeholder="Edit recognized phrase..."
                />
              ) : (
                <div className="text-base sm:text-lg font-bold text-white min-h-[28px] flex items-center">
                  {bufferedPhrase ? (
                    <span>"{bufferedPhrase}"</span>
                  ) : (
                    <span className="text-slate-500 text-sm font-normal italic">
                      Perform supported sign in front of camera...
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Sign Action Controls */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {/* Speak Button (TTS) */}
              <button
                onClick={handleSpeakCurrent}
                disabled={!bufferedPhrase && !editedText}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-100 text-xs font-semibold border border-slate-700 transition-colors"
                title="Speak phrase using local TTS"
                aria-label="Speak recognized text aloud"
              >
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span>Speak (TTS)</span>
              </button>

              {/* Add to Conversation Button */}
              <button
                onClick={handleCommitSign}
                disabled={!bufferedPhrase && !editedText}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Add to Conversation</span>
              </button>
            </div>

            {/* Quick Emergency/Frequent Phrases Chips */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium block mb-1.5">
                Quick Phrase Shortcuts:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickPhrases.map((phrase) => (
                  <button
                    key={phrase}
                    onClick={() => {
                      setBufferedPhrase(phrase);
                      setEditedText(phrase);
                      setActiveGloss('MANUAL');
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition-colors"
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Spoken Input & Live Conversation Stream (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Spoken Microphone Section */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-brand-500/20 text-brand-300">
                  <Mic className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-white">Spoken Voice Input</h3>
              </div>

              <span className="text-xs text-slate-400">
                {isListeningMic ? 'Listening...' : 'Mic idle'}
              </span>
            </div>

            {/* Mic Push-to-Talk or Continuous Button */}
            <div className="flex gap-2">
              <button
                onClick={handleToggleMic}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs transition-all shadow-md ${
                  isListeningMic
                    ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
                }`}
                aria-label={isListeningMic ? 'Stop microphone' : 'Start microphone speech input'}
              >
                {isListeningMic ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-400" />}
                <span>{isListeningMic ? 'Stop Listening' : 'Start Listening (Spoken Voice)'}</span>
              </button>
            </div>

            {/* Mic Error Note if unsupported */}
            {micError && (
              <div className="p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{micError}</span>
              </div>
            )}

            {/* Spoken Text Interim Field / Manual Speech Input */}
            <div className="space-y-2">
              <input
                type="text"
                value={micTranscript}
                onChange={(e) => setMicTranscript(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCommitSpeechTranscript()}
                placeholder="Spoken words transcribe here, or type spoken response..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500 placeholder:text-slate-500"
              />

              {micTranscript && (
                <div className="flex justify-end">
                  <button
                    onClick={handleCommitSpeechTranscript}
                    className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow flex items-center gap-1"
                  >
                    <span>Add Spoken Turn</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Conversation Transcript Stream */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>Conversation Thread</span>
            </h3>

            <ConversationStream
              turns={conversations}
              onClear={conversations.length > 0 ? clearConversations : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
