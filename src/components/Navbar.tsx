import React, { useState } from 'react';
import { useApp, ScreenId } from '../context/AppContext';
import { 
  Wifi, 
  WifiOff, 
  Eye, 
  MessageSquare, 
  Menu, 
  X, 
  ShieldCheck, 
  Settings, 
  BookOpen, 
  HelpCircle, 
  History as HistoryIcon,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentScreen, navigateTo, isOnline, accessibility, updateAccessibility } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: ScreenId; label: string; icon: any }[] = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'communication', label: 'Communicate', icon: MessageSquare },
    { id: 'conversation-mode', label: 'Conversation', icon: MessageSquare },
    { id: 'supported-signs', label: 'Supported Signs', icon: BookOpen },
    { id: 'history', label: 'History', icon: HistoryIcon },
    { id: 'offline-mode', label: 'Offline', icon: isOnline ? Wifi : WifiOff },
    { id: 'privacy-center', label: 'Privacy', icon: ShieldCheck },
  ];

  const handleNav = (screen: ScreenId) => {
    navigateTo(screen);
    setMobileMenuOpen(false);
  };

  return (
    <header 
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
        accessibility.highContrast 
          ? 'bg-black border-contrast-border text-white' 
          : 'bg-slate-950/90 border-slate-800/80 text-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Tagline */}
        <button 
          onClick={() => handleNav('home')}
          className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 rounded-lg p-1"
          aria-label="SignEdge Home - Communication without barriers"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 via-brand-500 to-blue-700 flex items-center justify-center p-1.5 shadow-md shadow-brand-500/20">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-white">
              <path d="M28 66 C28 58, 32 50, 42 46 C40 38, 45 32, 50 32 C55 32, 57 37, 57 42 C60 40, 65 41, 67 45 C70 47, 72 52, 72 58 C72 70, 62 76, 50 76 C36 76, 28 72, 28 66 Z" fill="currentColor" />
              <circle cx="50" cy="32" r="6" fill="#00e5ff" />
              <circle cx="42" cy="46" r="5" fill="#00e5ff" />
              <circle cx="57" cy="42" r="5" fill="#00e5ff" />
            </svg>
          </div>
          <div className="text-left">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-300 bg-clip-text text-transparent">
              SignEdge
            </span>
            <span className="hidden sm:block text-[11px] text-slate-400 font-medium tracking-wide">
              Communication without barriers
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = currentScreen === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? accessibility.highContrast
                      ? 'bg-white text-black font-bold'
                      : 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls & Offline Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Offline/Online Status Badge */}
          <button
            onClick={() => handleNav('offline-mode')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
              isOnline
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25'
            }`}
            title={isOnline ? 'Online (Edge AI active on-device)' : 'Offline mode active (Local AI running)'}
            aria-label={`Network status: ${isOnline ? 'Online' : 'Offline'}`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span className="hidden xs:inline">{isOnline ? 'Edge Active' : 'Offline Mode'}</span>
          </button>

          {/* Quick High Contrast Toggle */}
          <button
            onClick={() => updateAccessibility({ highContrast: !accessibility.highContrast })}
            className={`p-2 rounded-lg border transition-colors ${
              accessibility.highContrast
                ? 'bg-contrast-accent text-black border-contrast-accent'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
            aria-label="Toggle High Contrast Mode"
            title="Toggle High Contrast Mode"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Hero "Communicate Now" Button */}
          <button
            onClick={() => handleNav('communication')}
            className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold shadow-sm transition-all ${
              accessibility.highContrast
                ? 'bg-white text-black hover:bg-slate-200'
                : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/30'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Communicate</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            aria-label="Open Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-1 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 py-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  currentScreen === link.id
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-3 flex flex-wrap gap-2">
            <button
              onClick={() => handleNav('accessibility-settings')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Accessibility</span>
            </button>
            <button
              onClick={() => handleNav('language-settings')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Languages</span>
            </button>
            <button
              onClick={() => handleNav('help-center')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Help Center</span>
            </button>
            <button
              onClick={() => handleNav('about')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>About SignEdge</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
