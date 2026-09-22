import React, { useState } from 'react';
import { 
  HelpCircle, 
  Sun, 
  Camera, 
  HandMetal, 
  Mic, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const HelpCenter: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const tips = [
    {
      title: 'Optimal Camera Framing',
      desc: 'Keep upper body, shoulders, and both hands fully visible in the camera frame (roughly 2 to 3 feet from camera).',
      icon: Camera
    },
    {
      title: 'Good Front Lighting',
      desc: 'Ensure your room has front or ambient lighting. Avoid bright backlights (like windows directly behind you) that create dark silhouettes.',
      icon: Sun
    },
    {
      title: 'Distinct Finger Shapes',
      desc: 'Form clear finger extensions and crisp gesture transitions. Complete full motion paths before resting hands.',
      icon: HandMetal
    },
    {
      title: 'Clear Speech Audio',
      desc: 'Position microphone within 1 foot when speaking. Speak in natural conversational cadences without shouting.',
      icon: Mic
    }
  ];

  const faqs = [
    {
      q: 'Does SignEdge work without any internet connection?',
      a: 'Yes. Once loaded, SignEdge’s visual landmark processing, temporal sign classification, visual cues player, and IndexedDB history run 100% on your device with no continuous cloud connectivity required.'
    },
    {
      q: 'Does SignEdge send my camera video or audio recordings to the cloud?',
      a: 'No. SignEdge processes video frames in transient device memory for immediate landmark extraction, and audio is transcribed locally. Core conversation data remains private on your device.'
    },
    {
      q: 'Can SignEdge translate any arbitrary sign language sentence?',
      a: 'No. SignEdge is engineered around a verified, high-impact vocabulary (Emergency, Healthcare, Greetings, Daily Essentials, Directions) rather than pretending to perform unrestricted universal sign-language translation.'
    },
    {
      q: 'What should I do if the camera does not recognize my hand signs?',
      a: 'Check that your hands and upper chest are clearly visible in the preview box with good front lighting. Ensure the landmark skeleton mesh appears over your hands. You can also review the motion steps in the Supported Signs dictionary.'
    },
    {
      q: 'How does Conversation Mode work when sitting across a table?',
      a: 'In Conversation Mode, tap the "Table Flip (180°)" button. Place the smartphone or tablet flat on the table between you and your partner. The speaking partner’s side will be inverted so they can read and speak directly from their seat.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
            <HelpCircle className="w-5 h-5" />
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Help & Framing Guide</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Practical advice for optimal camera recognition, microphone setup, and frequent questions.
        </p>
      </div>

      {/* Practical Tips Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tips.map((tip, idx) => {
          const Icon = tip.icon;
          return (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">{tip.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{tip.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Frequently Asked Questions */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span>Frequently Asked Questions</span>
        </h3>

        <div className="divide-y divide-slate-800/80">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-3.5">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <span className="text-sm font-semibold text-slate-200 group-hover:text-white">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-300 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed animate-in fade-in duration-150">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
