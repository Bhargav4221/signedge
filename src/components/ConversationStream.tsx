import React, { useState } from 'react';
import { ConversationTurn } from '../ai/types';
import { useApp } from '../context/AppContext';
import { defaultSpeechEngine } from '../ai/speechEngine';
import { 
  Volume2, 
  Copy, 
  Trash2, 
  Edit3, 
  Check, 
  User, 
  HandMetal, 
  Sparkles,
  MessageSquare
} from 'lucide-react';

interface ConversationStreamProps {
  turns: ConversationTurn[];
  onClear?: () => void;
}

export const ConversationStream: React.FC<ConversationStreamProps> = ({ turns, onClear }) => {
  const { deleteTurn, showToast, accessibility } = useApp();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');

  const handleCopy = (turn: ConversationTurn) => {
    navigator.clipboard.writeText(turn.text);
    setCopiedId(turn.id);
    showToast('Copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string) => {
    defaultSpeechEngine.speak(text);
  };

  if (turns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-300">No active messages</h4>
        <p className="text-xs text-slate-500 max-w-xs">
          Sign to the camera or speak into the microphone to begin two-way communication.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3" role="log" aria-label="Conversation Transcript">
      <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-xs text-slate-400">
        <span>Session Messages ({turns.length})</span>
        {onClear && (
          <button
            onClick={onClear}
            className="text-xs text-rose-400 hover:text-rose-300 font-medium transition-colors"
          >
            Clear Thread
          </button>
        )}
      </div>

      <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
        {turns.map((turn) => {
          const isSigner = turn.sender === 'signer';
          const isEditing = editingId === turn.id;

          return (
            <div
              key={turn.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                isSigner
                  ? accessibility.highContrast
                    ? 'bg-black border-cyan-400 text-white ml-2'
                    : 'bg-gradient-to-r from-slate-900 to-cyan-950/40 border-cyan-900/50 text-slate-100 ml-3'
                  : accessibility.highContrast
                    ? 'bg-black border-brand-400 text-white mr-2'
                    : 'bg-gradient-to-r from-slate-900 to-brand-950/40 border-brand-900/50 text-slate-100 mr-3'
              }`}
            >
              {/* Header: Sender & Meta */}
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isSigner ? 'bg-cyan-500/20 text-cyan-300' : 'bg-brand-500/20 text-brand-300'
                    }`}
                  >
                    {isSigner ? <HandMetal className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </span>
                  <span className="font-semibold text-slate-200">
                    {isSigner ? 'Signer (Visual)' : 'Speaker (Voice)'}
                  </span>
                  {turn.gloss && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {turn.gloss}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  {turn.confidence !== undefined && (
                    <span>{Math.round(turn.confidence * 100)}%</span>
                  )}
                  <span>{new Date(turn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {/* Message Content */}
              {isEditing ? (
                <div className="space-y-2 mt-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-brand-500"
                    autoFocus
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-2.5 py-1 rounded text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        turn.text = editText;
                        setEditingId(null);
                        showToast('Message updated', 'success');
                      }}
                      className="px-3 py-1 rounded text-xs font-semibold bg-brand-600 text-white"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm sm:text-base font-medium text-white leading-relaxed">
                  "{turn.text}"
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-1 mt-2 pt-1 border-t border-slate-800/60">
                {/* TTS Speak button */}
                <button
                  onClick={() => handleSpeak(turn.text)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Speak message aloud (TTS)"
                  aria-label="Speak message aloud"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>

                {/* Edit button */}
                <button
                  onClick={() => {
                    setEditingId(turn.id);
                    setEditText(turn.text);
                  }}
                  className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Edit message"
                  aria-label="Edit message"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                {/* Copy button */}
                <button
                  onClick={() => handleCopy(turn)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Copy text"
                  aria-label="Copy text"
                >
                  {copiedId === turn.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Delete button */}
                <button
                  onClick={() => deleteTurn(turn.id)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Delete message"
                  aria-label="Delete message"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
