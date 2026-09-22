import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConversationTurn, DeviceTier, RecognitionResult } from '../ai/types';
import { localDB } from '../storage/db';
import { defaultDeviceOptimizer } from '../ai/deviceOptimizer';
import { defaultSpeechEngine } from '../ai/speechEngine';

export type ScreenId = 
  | 'home'
  | 'communication'
  | 'sign-to-text'
  | 'sign-to-speech'
  | 'speech-to-text'
  | 'speech-to-visual-cues'
  | 'conversation-mode'
  | 'history'
  | 'supported-signs'
  | 'offline-mode'
  | 'privacy-center'
  | 'accessibility-settings'
  | 'language-settings'
  | 'help-center'
  | 'about';

export interface AccessibilityConfig {
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  reducedMotion: boolean;
  audioFeedback: boolean;
  hapticFeedback: boolean;
}

export interface LanguageConfig {
  signDialect: 'ASL' | 'ISL' | 'BSL';
  spokenLang: string;
  speechRate: number;
  speechPitch: number;
}

interface AppContextType {
  currentScreen: ScreenId;
  navigateTo: (screen: ScreenId) => void;
  isOnline: boolean;
  isSimulatedOffline: boolean;
  setSimulatedOffline: (sim: boolean) => void;
  isSimulatedAiMode: boolean;
  setSimulatedAiMode: (enabled: boolean) => void;
  deviceTier: DeviceTier;
  setDeviceTier: (tier: DeviceTier) => void;
  accessibility: AccessibilityConfig;
  updateAccessibility: (config: Partial<AccessibilityConfig>) => void;
  language: LanguageConfig;
  updateLanguage: (config: Partial<LanguageConfig>) => void;
  conversations: ConversationTurn[];
  addTurn: (turn: Omit<ConversationTurn, 'id' | 'timestamp'>) => Promise<void>;
  deleteTurn: (id: string) => Promise<void>;
  clearConversations: () => Promise<void>;
  activeRecognition: RecognitionResult | null;
  setActiveRecognition: (result: RecognitionResult | null) => void;
  toast: { message: string; type: 'info' | 'success' | 'warn' | 'error' } | null;
  showToast: (message: string, type?: 'info' | 'success' | 'warn' | 'error') => void;
  triggerAudioCue: (type?: 'detect' | 'turn' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [isSimulatedAiMode, setIsSimulatedAiMode] = useState<boolean>(false);
  const [deviceTier, setDeviceTierState] = useState<DeviceTier>('medium');
  const [conversations, setConversations] = useState<ConversationTurn[]>([]);
  const [activeRecognition, setActiveRecognition] = useState<RecognitionResult | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'warn' | 'error' } | null>(null);

  const [accessibility, setAccessibility] = useState<AccessibilityConfig>({
    highContrast: false,
    fontSize: 'normal',
    reducedMotion: false,
    audioFeedback: true,
    hapticFeedback: true,
  });

  const [language, setLanguage] = useState<LanguageConfig>({
    signDialect: 'ASL',
    spokenLang: 'en-US',
    speechRate: 1.0,
    speechPitch: 1.0,
  });

  // Load initial settings and history from local IndexedDB
  useEffect(() => {
    async function loadData() {
      try {
        const history = await localDB.getHistory();
        setConversations(history);

        const savedA11y = await localDB.getSetting('accessibility', null);
        if (savedA11y) setAccessibility(savedA11y);

        const savedLang = await localDB.getSetting('language', null);
        if (savedLang) setLanguage(savedLang);

        const tier = defaultDeviceOptimizer.detectCapabilities();
        setDeviceTierState(tier);
      } catch (err) {
        console.warn('Error loading initial IndexedDB data', err);
      }
    }
    loadData();
  }, []);

  // Monitor network connectivity
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const navigateTo = (screen: ScreenId) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: accessibility.reducedMotion ? 'auto' : 'smooth' });
  };

  const showToast = (message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => prev?.message === message ? null : prev);
    }, 4000);
  };

  const triggerAudioCue = (type: 'detect' | 'turn' | 'error' = 'detect') => {
    if (!accessibility.audioFeedback || typeof window === 'undefined') return;

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'detect') {
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12); // A5
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.13);
      } else if (type === 'turn') {
        osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.16);
      } else {
        osc.frequency.setValueAtTime(220, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.21);
      }
    } catch {
      // Audio context policy or unavailable
    }
  };

  const updateAccessibility = (newConfig: Partial<AccessibilityConfig>) => {
    setAccessibility(prev => {
      const updated = { ...prev, ...newConfig };
      localDB.saveSetting('accessibility', updated);
      return updated;
    });
  };

  const updateLanguage = (newConfig: Partial<LanguageConfig>) => {
    setLanguage(prev => {
      const updated = { ...prev, ...newConfig };
      localDB.saveSetting('language', updated);
      defaultSpeechEngine.updateSettings({
        rate: updated.speechRate,
        pitch: updated.speechPitch,
        lang: updated.spokenLang,
      });
      return updated;
    });
  };

  const setDeviceTier = (tier: DeviceTier) => {
    setDeviceTierState(tier);
    defaultDeviceOptimizer.setTierOverride(tier);
  };

  const addTurn = async (turnData: Omit<ConversationTurn, 'id' | 'timestamp'>) => {
    const newTurn: ConversationTurn = {
      ...turnData,
      id: 'turn_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      timestamp: Date.now(),
    };

    setConversations(prev => [...prev, newTurn]);
    await localDB.saveTurn(newTurn);
    triggerAudioCue('turn');
  };

  const deleteTurn = async (id: string) => {
    setConversations(prev => prev.filter(t => t.id !== id));
    await localDB.deleteTurn(id);
    showToast('Message deleted from local device', 'info');
  };

  const clearConversations = async () => {
    setConversations([]);
    await localDB.clearHistory();
    showToast('Conversation cleared from local storage', 'info');
  };

  const effectiveOnline = isOnline && !isSimulatedOffline;

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        navigateTo,
        isOnline: effectiveOnline,
        isSimulatedOffline,
        setSimulatedOffline: setIsSimulatedOffline,
        isSimulatedAiMode,
        setSimulatedAiMode: setIsSimulatedAiMode,
        deviceTier,
        setDeviceTier,
        accessibility,
        updateAccessibility,
        language,
        updateLanguage,
        conversations,
        addTurn,
        deleteTurn,
        clearConversations,
        activeRecognition,
        setActiveRecognition,
        toast,
        showToast,
        triggerAudioCue,
      }}
    >
      <div 
        className={`min-h-screen ${accessibility.highContrast ? 'bg-black text-white' : 'bg-slate-950 text-slate-100'} ${
          accessibility.fontSize === 'large' ? 'text-lg' : accessibility.fontSize === 'xlarge' ? 'text-xl' : 'text-base'
        }`}
      >
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
