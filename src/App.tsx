import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { MoreDrawer } from './components/MoreDrawer';

// 15 Screens
import { Home } from './pages/Home';
import { Communication } from './pages/Communication';
import { SignToText } from './pages/SignToText';
import { SignToSpeech } from './pages/SignToSpeech';
import { SpeechToText } from './pages/SpeechToText';
import { SpeechToVisualCues } from './pages/SpeechToVisualCues';
import { ConversationMode } from './pages/ConversationMode';
import { History } from './pages/History';
import { SupportedSigns } from './pages/SupportedSigns';
import { OfflineMode } from './pages/OfflineMode';
import { PrivacyCenter } from './pages/PrivacyCenter';
import { AccessibilitySettings } from './pages/AccessibilitySettings';
import { LanguageSettings } from './pages/LanguageSettings';
import { HelpCenter } from './pages/HelpCenter';
import { AboutSignEdge } from './pages/AboutSignEdge';

export const App: React.FC = () => {
  const { currentScreen, toast, accessibility } = useApp();
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Home />;
      case 'communication':
        return <Communication />;
      case 'sign-to-text':
        return <SignToText />;
      case 'sign-to-speech':
        return <SignToSpeech />;
      case 'speech-to-text':
        return <SpeechToText />;
      case 'speech-to-visual-cues':
        return <SpeechToVisualCues />;
      case 'conversation-mode':
        return <ConversationMode />;
      case 'history':
        return <History />;
      case 'supported-signs':
        return <SupportedSigns />;
      case 'offline-mode':
        return <OfflineMode />;
      case 'privacy-center':
        return <PrivacyCenter />;
      case 'accessibility-settings':
        return <AccessibilitySettings />;
      case 'language-settings':
        return <LanguageSettings />;
      case 'help-center':
        return <HelpCenter />;
      case 'about':
        return <AboutSignEdge />;
      default:
        return <Home />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${accessibility.highContrast ? 'bg-black text-white' : 'bg-slate-950 text-slate-100'}`}>
      {/* Top Desktop/Tablet Navigation */}
      <Navbar />

      {/* Main Screen Content Area */}
      <main className="flex-1 pb-24 md:pb-12" id="main-content">
        {renderActiveScreen()}
      </main>

      {/* Mobile-first Thumb Navigation Bar */}
      <BottomNav onOpenMore={() => setMoreDrawerOpen(true)} />

      {/* Mobile "More" Drawer */}
      <MoreDrawer
        isOpen={moreDrawerOpen}
        onClose={() => setMoreDrawerOpen(false)}
      />

      {/* Toast Notification Alert */}
      {toast && (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed bottom-20 md:bottom-6 right-4 z-50 max-w-sm p-4 rounded-2xl shadow-2xl border backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200 flex items-center gap-3 bg-slate-900/95 border-slate-700 text-slate-100"
        >
          <div className={`w-2 h-2 rounded-full ${
            toast.type === 'success' ? 'bg-emerald-400' :
            toast.type === 'warn' ? 'bg-amber-400' :
            toast.type === 'error' ? 'bg-rose-400' : 'bg-cyan-400'
          }`} />
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}
    </div>
  );
};
export default App;
