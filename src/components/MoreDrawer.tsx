import React from 'react';
import { useApp, ScreenId } from '../context/AppContext';
import { 
  X, 
  History, 
  Wifi, 
  ShieldCheck, 
  Sliders, 
  Globe, 
  HelpCircle, 
  Info, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface MoreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MoreDrawer: React.FC<MoreDrawerProps> = ({ isOpen, onClose }) => {
  const { navigateTo, accessibility } = useApp();

  if (!isOpen) return null;

  const menuItems: { id: ScreenId; label: string; desc: string; icon: any }[] = [
    { id: 'history', label: 'History & Logs', desc: 'Locally stored transcripts', icon: History },
    { id: 'offline-mode', label: 'Offline Mode & Cache', desc: 'Manage offline models and data', icon: Wifi },
    { id: 'privacy-center', label: 'Privacy Center', desc: 'Permissions and data minimization', icon: ShieldCheck },
    { id: 'accessibility-settings', label: 'Accessibility Settings', desc: 'Contrast, text scaling, motion', icon: Sliders },
    { id: 'language-settings', label: 'Language & Speech', desc: 'Sign dialects and voice options', icon: Globe },
    { id: 'help-center', label: 'Help Center & Framing', desc: 'Camera tips and FAQ', icon: HelpCircle },
    { id: 'about', label: 'About SignEdge', desc: 'Product principles and architecture', icon: Info },
  ];

  const handleSelect = (id: ScreenId) => {
    navigateTo(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`w-full max-h-[85vh] overflow-y-auto rounded-t-3xl border-t p-6 shadow-2xl transition-colors ${
          accessibility.highContrast 
            ? 'bg-black border-contrast-border text-white' 
            : 'bg-slate-950 border-slate-800 text-slate-100'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-400" />
            <h2 className="text-lg font-bold">SignEdge Settings & Tools</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="divide-y divide-slate-800/60 py-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className="w-full py-3.5 px-2 flex items-center justify-between hover:bg-slate-900/50 rounded-xl transition-colors text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 group-hover:text-cyan-400 group-hover:border-cyan-500/40 transition-colors">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{item.label}</div>
                  <div className="text-xs text-slate-400">{item.desc}</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
