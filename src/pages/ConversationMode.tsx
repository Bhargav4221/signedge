import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CameraPreview } from '../components/CameraPreview';
import { ConversationStream } from '../components/ConversationStream';
import { defaultSpeechEngine } from '../ai/speechEngine';
import { defaultLanguageProcessor } from '../ai/languageProcessor';
import { RecognitionResult } from '../ai/types';
import { 
  Users, 
  RotateCw, 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  Trash2, 
  Sparkles,
  HandMetal,
  UserCheck,
  ChevronLeft
} from 'lucide-react';

export const ConversationMode: React.FC = () => {
  const { conversations, addTurn, clearConversations, showToast, goBack } = useApp();
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'both' | 'signer' | 'speaker'>('both');

  // Signer state
  const [signerResult, setSignerResult] = useState<RecognitionResult | null>(null);
  const [signerText, setSignerText] = useState<string>('');

  // Speaker state
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);
  const [speakerTranscript, setSpeakerTranscript] = useState<string>('');

  const handleSignerRecognized = (result: RecognitionResult) => {
    setSignerResult(result);
    if (result.isStable) {
      const processed = defaultLanguageProcessor.processGloss(result.gloss);
      setSignerText(processed.naturalText);
    }
  };

  const handleCommitSigner = async () => {
    if (!signerText.trim()) return;
    await addTurn({
      sender: 'signer',
      text: signerText.trim(),
      gloss: signerResult?.gloss,
      confidence: signerResult?.confidence,
    });
    defaultSpeechEngine.speak(signerText);
    setSignerText('');
  };

  const toggleSpeakerMic = () => {
    if (isListeningMic) {
      defaultSpeechEngine.stopListening();
      setIsListeningMic(false);
    } else {
      const started = defaultSpeechEngine.startListening({
        onResult: (text, isFinal) => {
          setSpeakerTranscript(text);
          if (isFinal && text.trim()) {
            addTurn({
              sender: 'speaker',
              text: text.trim(),
            });
            setSpeakerTranscript('');
          }
        },
        onError: (err) => {
          showToast(err, 'error');
          setIsListeningMic(false);
        },
        onEnd: () => {
          setIsListeningMic(false);
        }
      });
      setIsListeningMic(started);
    }
  };

  const handleCommitSpeakerManual = async () => {
    if (!speakerTranscript.trim()) return;
    await addTurn({
      sender: 'speaker',
      text: speakerTranscript.trim(),
    });
    setSpeakerTranscript('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 space-y-6">
      {/* Header with Table-Top Rotation Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
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
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                <Users className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Conversation Mode</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Face-to-face interaction mode between a sign-language user and a spoken-language user.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 180° Flip for Table Placement */}
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isFlipped 
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
            title="Rotate speaker side 180 degrees for table-top dialogue"
          >
            <RotateCw className="w-4 h-4" />
            <span>Table Flip (180°)</span>
          </button>

          {conversations.length > 0 && (
            <button
              onClick={clearConversations}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800"
              title="Clear dialogue"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Two-Way Split View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* SIDE A: Speaking Participant (Top or Left, flippable 180° for table mode) */}
        <div 
          className={`p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 transition-transform duration-300 ${
            isFlipped ? 'rotate-180' : ''
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-full bg-brand-500/20 text-brand-300">
                <UserCheck className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-white">Speaking Partner</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">SPEECH / AUDIO</span>
          </div>

          <p className="text-xs text-slate-400">
            Tap the button and speak aloud. Your speech will be transcribed for the signer.
          </p>

          <button
            onClick={toggleSpeakerMic}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
              isListeningMic
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-brand-600/30'
            }`}
          >
            {isListeningMic ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span>{isListeningMic ? 'Listening to voice...' : 'Speak to Signer'}</span>
          </button>

          {/* Transcript input/display */}
          <div className="space-y-2">
            <input
              type="text"
              value={speakerTranscript}
              onChange={(e) => setSpeakerTranscript(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCommitSpeakerManual()}
              placeholder="Spoken words appear here, or type response..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500"
            />
            {speakerTranscript && (
              <div className="flex justify-end">
                <button
                  onClick={handleCommitSpeakerManual}
                  className="px-3 py-1 rounded-lg bg-brand-600 text-white text-xs font-semibold"
                >
                  Post Message
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SIDE B: Signing Participant (Camera & Visual Recognition) */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-full bg-cyan-500/20 text-cyan-300">
                <HandMetal className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-white">Signing Partner</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">CAMERA / SIGNS</span>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-800">
            <CameraPreview onRecognized={handleSignerRecognized} />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
              <span>Recognized Sign Translation</span>
              {signerResult && (
                <span className="text-cyan-400">{Math.round(signerResult.confidence * 100)}% Match</span>
              )}
            </div>

            <p className="text-base font-bold text-white min-h-[28px] flex items-center">
              {signerText ? `"${signerText}"` : <span className="text-slate-500 font-normal italic">Sign to camera...</span>}
            </p>

            <button
              onClick={handleCommitSigner}
              disabled={!signerText}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white text-xs font-bold shadow transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send & Speak Aloud</span>
            </button>
          </div>
        </div>
      </div>

      {/* Shared Active Thread */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Shared Dialogue Stream</span>
        </h3>
        <ConversationStream turns={conversations} />
      </div>
    </div>
  );
};
