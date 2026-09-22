import React, { useState } from 'react';
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
  Trash2, 
  Sparkles,
  Wifi,
  WifiOff,
  AlertCircle,
  ChevronLeft,
  Hand
} from 'lucide-react';

export const Communication: React.FC = () => {
  const { 
    goBack,
    isOnline, 
    conversations, 
    addTurn, 
    clearConversations, 
    showToast 
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

    defaultSpeechEngine.speak(textToCommit);

    // Reset buffer
    setBufferedPhrase('');
    setActiveGloss('');
    setIsEditingRecognized(false);
    setCurrentRecognition(null);
  };

  const handleSpeakCurrent = () => {
    const textToSpeak = isEditingRecognized ? editedText : bufferedPhrase;
    if (textToSpeak) {
      defaultSpeechEngine.speak(textToSpeak);
      showToast('Speaking recognized text', 'info');
    }
  };

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

  const handleCommitSpeechTranscript = async () => {
    if (!micTranscript.trim()) return;
    await addTurn({
      sender: 'speaker',
      text: micTranscript.trim(),
    });
    setMicTranscript('');
  };

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
      {/* Top Header Bar with Navigation Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
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
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Live Communication
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
                isOnline ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              }`}>
                {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                <span>{isOnline ? 'Edge AI' : 'Offline'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live sign language vision recognition and microphone speech transcription on device.
            </p>
          </div>
        </div>

        {conversations.length > 0 && (
          <button
            onClick={clearConversations}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 transition-colors"
            title="Clear all messages in active session"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Session</span>
          </button>
        )}
      </div>

      {/* Main Split Layout: Sign Input (Left) & Spoken Transcript (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Visual Camera & Sign Recognition (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <CameraPreview
            onRecognized={handleSignRecognized}
            showSkeleton={true}
          />

          {/* Real-time Recognition Status & Action Card */}
          <div className="p-5 rounded-3xl bg-obsidian-900 border border-slate-800/90 shadow-xl space-y-4">
            {/* Gloss & Confidence */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg font-mono border ${
                  activeGloss 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                    : 'bg-obsidian-800 text-slate-400 border-slate-700/60'
                }`}>
                  {activeGloss ? `GLOSS: ${activeGloss}` : 'WAITING FOR SIGN MOTION'}
                </span>
                {currentRecognition?.category && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-obsidian-800 text-slate-400 capitalize border border-slate-700/50">
                    {currentRecognition.category}
                  </span>
                )}
              </div>

              {currentRecognition && (
                <span className="text-xs font-bold text-emerald-400">
                  {Math.round(currentRecognition.confidence * 100)}% Match
                </span>
              )}
            </div>

            {/* Confidence Bar */}
            <ConfidenceBar
              confidence={currentRecognition?.confidence || 0}
              isStable={currentRecognition?.isStable || false}
              label="Gesture Trajectory Match"
            />

            {/* Recognized Phrase Display or Editor */}
            <div className="p-4 rounded-2xl bg-obsidian-950 border border-slate-800/80">
              <div className="text-[11px] text-slate-400 font-semibold mb-1 flex items-center justify-between">
                <span>Recognized Natural English</span>
                {bufferedPhrase && (
                  <button
                    onClick={() => setIsEditingRecognized(!isEditingRecognized)}
                    className="text-brand-400 hover:text-brand-300 flex items-center gap-1 text-[11px]"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{isEditingRecognized ? 'Cancel' : 'Edit'}</span>
                  </button>
                )}
              </div>

              {isEditingRecognized ? (
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full bg-obsidian-850 text-white text-base font-semibold px-3 py-2 rounded-xl border border-brand-500/50 focus:outline-none"
                  placeholder="Edit recognized phrase..."
                />
              ) : (
                <div className="text-base sm:text-lg font-bold text-white min-h-[30px] flex items-center">
                  {bufferedPhrase ? (
                    <span className="text-white font-semibold tracking-wide">"{bufferedPhrase}"</span>
                  ) : (
                    <span className="text-slate-500 text-xs sm:text-sm font-normal italic flex items-center gap-1.5">
                      <Hand className="w-4 h-4 text-slate-600" />
                      <span>Hold hand in camera view and perform a supported sign...</span>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Sign Action Controls */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={handleSpeakCurrent}
                disabled={!bufferedPhrase && !editedText}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 text-xs font-semibold border border-slate-700 transition-colors shadow-sm"
                title="Speak phrase using local TTS"
                aria-label="Speak recognized text aloud"
              >
                <Volume2 className="w-4 h-4 text-brand-400" />
                <span>Speak (TTS)</span>
              </button>

              <button
                onClick={handleCommitSign}
                disabled={!bufferedPhrase && !editedText}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Send to Dialogue</span>
              </button>
            </div>

            {/* Quick Emergency/Frequent Phrases Chips */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-400 font-medium block mb-1.5">
                Quick Shortcuts:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickPhrases.map((phrase) => (
                  <button
                    key={phrase}
                    onClick={() => {
                      setBufferedPhrase(phrase);
                      setEditedText(phrase);
                      setActiveGloss('QUICK');
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs bg-obsidian-850 hover:bg-obsidian-800 text-slate-300 border border-slate-700/60 transition-colors"
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
          <div className="p-5 rounded-3xl bg-obsidian-900 border border-slate-800/90 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-brand-500/20 text-brand-300">
                  <Mic className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-white">Voice Speech Input</h3>
              </div>

              <span className="text-xs text-slate-400">
                {isListeningMic ? 'Listening...' : 'Mic idle'}
              </span>
            </div>

            {/* Push to Talk Button */}
            <button
              onClick={handleToggleMic}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs transition-all shadow-md ${
                isListeningMic
                  ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                  : 'bg-obsidian-800 hover:bg-obsidian-750 text-slate-100 border border-slate-700'
              }`}
              aria-label={isListeningMic ? 'Stop microphone' : 'Start microphone speech input'}
            >
              {isListeningMic ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-400" />}
              <span>{isListeningMic ? 'Stop Listening' : 'Start Microphone (Spoken Partner)'}</span>
            </button>

            {micError && (
              <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{micError}</span>
              </div>
            )}

            {/* Spoken Text Interim Field */}
            <div className="space-y-2">
              <input
                type="text"
                value={micTranscript}
                onChange={(e) => setMicTranscript(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCommitSpeechTranscript()}
                placeholder="Spoken words transcribe here, or type spoken response..."
                className="w-full px-3.5 py-2.5 bg-obsidian-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500 placeholder:text-slate-500"
              />

              {micTranscript && (
                <div className="flex justify-end">
                  <button
                    onClick={handleCommitSpeechTranscript}
                    className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow flex items-center gap-1.5"
                  >
                    <span>Post Spoken Words</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Conversation Transcript Stream */}
          <div className="p-5 rounded-3xl bg-obsidian-900 border border-slate-800/90 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>Conversation Stream</span>
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
