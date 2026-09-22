import React, { useState } from 'react';
import { SUPPORTED_SIGNS } from '../ai/vocabulary';
import { SignDefinition, SignCategory } from '../ai/types';
import { VisualCuePlayer } from '../components/VisualCuePlayer';
import { 
  BookOpen, 
  Search, 
  Eye, 
  Filter, 
  Sparkles, 
  ShieldAlert, 
  HeartPulse, 
  Smile, 
  HelpCircle 
} from 'lucide-react';

export const SupportedSigns: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSign, setActiveSign] = useState<SignDefinition>(SUPPORTED_SIGNS[0]);

  const categories: { id: string; label: string; icon: any }[] = [
    { id: 'all', label: 'All Signs', icon: BookOpen },
    { id: 'emergency', label: 'Emergency', icon: ShieldAlert },
    { id: 'healthcare', label: 'Healthcare', icon: HeartPulse },
    { id: 'greetings', label: 'Greetings', icon: Smile },
    { id: 'daily', label: 'Daily Life', icon: Sparkles },
    { id: 'questions', label: 'Questions', icon: HelpCircle },
  ];

  const filteredSigns = SUPPORTED_SIGNS.filter(sign => {
    const matchesCategory = selectedCategory === 'all' || sign.category === selectedCategory;
    const matchesSearch = sign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sign.gloss.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sign.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300">
            <BookOpen className="w-5 h-5" />
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Supported Signs Dictionary</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Explore the curated {SUPPORTED_SIGNS.length}-sign vocabulary currently supported by SignEdge's on-device temporal models.
        </p>
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sign by name, gloss, or action..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                    isSelected
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content: Dictionary List (Left) & Sign Detail / Visual Player (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sign Selection List (5 cols) */}
        <div className="lg:col-span-5 space-y-2 max-h-[580px] overflow-y-auto pr-1">
          {filteredSigns.map((sign) => {
            const isSelected = activeSign.id === sign.id;
            return (
              <button
                key={sign.id}
                onClick={() => setActiveSign(sign)}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between group ${
                  isSelected
                    ? 'bg-rose-500/15 border-rose-500/40 text-white shadow-md'
                    : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white group-hover:text-rose-300">
                      {sign.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-slate-950 text-slate-400">
                      {sign.gloss}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{sign.description}</p>
                </div>

                <div className="text-right flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${
                    sign.category === 'emergency' ? 'bg-rose-500/20 text-rose-300' :
                    sign.category === 'healthcare' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {sign.category}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {sign.twoHanded ? '2 Hands' : '1 Hand'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Sign Detailed Breakdown & Interactive Player (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <VisualCuePlayer singleSign={activeSign} />

          {/* Deep Details Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{activeSign.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  GLOSS: {activeSign.gloss}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{activeSign.description}</p>
            </div>

            {/* Step-by-step Motion Breakdown */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Execution Instructions:
              </h4>
              <ol className="space-y-2">
                {activeSign.motionSteps.map((step, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Metadata Badges */}
            <div className="pt-3 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Difficulty</span>
                <span className="font-bold text-white capitalize mt-0.5 block">{activeSign.difficulty}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Hand Configuration</span>
                <span className="font-bold text-white mt-0.5 block">{activeSign.twoHanded ? 'Two-Handed' : 'Single Hand'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Confidence Threshold</span>
                <span className="font-bold text-cyan-400 mt-0.5 block">{Math.round(activeSign.confidenceThreshold * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
