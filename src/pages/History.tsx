import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { localDB } from '../storage/db';
import { ConversationStream } from '../components/ConversationStream';
import { 
  History as HistoryIcon, 
  Search, 
  Download, 
  FileText, 
  Trash2, 
  Sparkles, 
  Calendar,
  Filter,
  ChevronLeft
} from 'lucide-react';

export const History: React.FC = () => {
  const { conversations, clearConversations, showToast, goBack } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [senderFilter, setSenderFilter] = useState<'all' | 'signer' | 'speaker'>('all');

  const filteredTurns = conversations.filter(turn => {
    const matchesSearch = turn.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (turn.gloss && turn.gloss.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSender = senderFilter === 'all' || turn.sender === senderFilter;
    return matchesSearch && matchesSender;
  });

  const handleExportJSON = async () => {
    const json = await localDB.exportAsJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signedge-transcript-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported history as JSON file', 'success');
  };

  const handleExportText = async () => {
    const text = await localDB.exportAsText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signedge-transcript-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported history as Text file', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-obsidian-800">
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
                <HistoryIcon className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Conversation History</h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Transcripts saved strictly on this local device in IndexedDB. Zero cloud retention.
            </p>
          </div>
        </div>

        {/* Export & Clear Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportText}
            disabled={conversations.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 border border-slate-700 transition-colors"
            title="Download formatted text transcript"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Text</span>
          </button>

          <button
            onClick={handleExportJSON}
            disabled={conversations.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 border border-slate-700 transition-colors"
            title="Download raw JSON data"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>

          {conversations.length > 0 && (
            <button
              onClick={clearConversations}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
              title="Permanently wipe all session logs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Wipe All</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversation transcripts by keyword or sign gloss..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setSenderFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                senderFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({conversations.length})
            </button>
            <button
              onClick={() => setSenderFilter('signer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                senderFilter === 'signer' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Signer
            </button>
            <button
              onClick={() => setSenderFilter('speaker')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                senderFilter === 'speaker' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Speaker
            </button>
          </div>
        </div>
      </div>

      {/* Stream Display */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <ConversationStream turns={filteredTurns} />
      </div>
    </div>
  );
};
