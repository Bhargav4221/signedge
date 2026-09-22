import React from 'react';
import { useApp, ScreenId } from '../context/AppContext';
import { Home, MessageSquare, Users, BookOpen, MoreHorizontal } from 'lucide-react';

export const BottomNav: React.FC<{ onOpenMore: () => void }> = ({ onOpenMore }) => {
  const { currentScreen, navigateTo, accessibility } = useApp();

  const isMoreActive = [
    'history', 'offline-mode', 'privacy-center', 
    'accessibility-settings', 'language-settings', 'help-center', 'about'
  ].includes(currentScreen);

  return (
    <nav 
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t pb-safe transition-colors ${
        accessibility.highContrast
          ? 'bg-black border-contrast-border text-white'
          : 'bg-slate-950/95 border-slate-800/90 text-slate-400 backdrop-blur-lg'
      }`}
      aria-label="Mobile Navigation Bar"
    >
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {/* 1. Home */}
        <button
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center justify-center h-full min-h-touch py-1 transition-colors ${
            currentScreen === 'home'
              ? accessibility.highContrast ? 'text-contrast-accent font-bold' : 'text-brand-400 font-semibold'
              : 'hover:text-slate-200'
          }`}
          aria-label="Home"
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">Home</span>
        </button>

        {/* 2. Conversation Mode */}
        <button
          onClick={() => navigateTo('conversation-mode')}
          className={`flex flex-col items-center justify-center h-full min-h-touch py-1 transition-colors ${
            currentScreen === 'conversation-mode'
              ? accessibility.highContrast ? 'text-contrast-accent font-bold' : 'text-brand-400 font-semibold'
              : 'hover:text-slate-200'
          }`}
          aria-label="2-Person Conversation Mode"
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">2-Way</span>
        </button>

        {/* 3. Primary Hero "Communicate" Button */}
        <div className="flex justify-center -mt-5">
          <button
            onClick={() => navigateTo('communication')}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
              accessibility.highContrast
                ? 'bg-contrast-accent text-black ring-4 ring-black'
                : 'bg-gradient-to-tr from-brand-600 to-cyan-500 text-white shadow-brand-500/40 ring-4 ring-slate-950'
            }`}
            aria-label="Start Communication Mode"
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        </div>

        {/* 4. Supported Signs Dictionary */}
        <button
          onClick={() => navigateTo('supported-signs')}
          className={`flex flex-col items-center justify-center h-full min-h-touch py-1 transition-colors ${
            currentScreen === 'supported-signs'
              ? accessibility.highContrast ? 'text-contrast-accent font-bold' : 'text-brand-400 font-semibold'
              : 'hover:text-slate-200'
          }`}
          aria-label="Supported Signs Dictionary"
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">Signs</span>
        </button>

        {/* 5. More Actions Drawer */}
        <button
          onClick={onOpenMore}
          className={`flex flex-col items-center justify-center h-full min-h-touch py-1 transition-colors ${
            isMoreActive
              ? accessibility.highContrast ? 'text-contrast-accent font-bold' : 'text-brand-400 font-semibold'
              : 'hover:text-slate-200'
          }`}
          aria-label="More Options and Settings"
        >
          <MoreHorizontal className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">More</span>
        </button>
      </div>
    </nav>
  );
};
