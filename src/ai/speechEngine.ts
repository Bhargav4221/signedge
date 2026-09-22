/**
 * Speech Engine: Local Device TTS and STT interfaces
 * Operates using device audio APIs with zero external telemetry.
 */

export interface SpeechSettings {
  rate: number; // 0.5 to 2.0
  pitch: number; // 0.5 to 1.5
  volume: number; // 0.0 to 1.0
  voiceURI?: string;
  lang: string;
}

export class SpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  private isListening: boolean = false;
  private settings: SpeechSettings = {
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    lang: 'en-US'
  };

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
    this.initSpeechRecognition();
  }

  private initSpeechRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = this.settings.lang;
      } catch (e) {
        console.warn('[SpeechEngine] SpeechRecognition initialization error:', e);
      }
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  public updateSettings(newSettings: Partial<SpeechSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    if (this.recognition && newSettings.lang) {
      this.recognition.lang = newSettings.lang;
    }
  }

  public getSettings(): SpeechSettings {
    return { ...this.settings };
  }

  /**
   * Speak a text string using local Text-to-Speech
   */
  public speak(
    text: string, 
    callbacks?: { onStart?: () => void; onEnd?: () => void; onError?: (err: any) => void }
  ): boolean {
    if (!this.synth) {
      callbacks?.onError?.(new Error('Speech synthesis not available in this environment'));
      return false;
    }

    // Cancel any previous pending utterances
    this.synth.cancel();

    if (!text.trim()) return false;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.settings.rate;
    utterance.pitch = this.settings.pitch;
    utterance.volume = this.settings.volume;
    utterance.lang = this.settings.lang;

    if (this.settings.voiceURI) {
      const voices = this.synth.getVoices();
      const selected = voices.find(v => v.voiceURI === this.settings.voiceURI);
      if (selected) utterance.voice = selected;
    }

    if (callbacks?.onStart) utterance.onstart = callbacks.onStart;
    if (callbacks?.onEnd) utterance.onend = callbacks.onEnd;
    if (callbacks?.onError) utterance.onerror = callbacks.onError;

    this.synth.speak(utterance);
    return true;
  }

  public stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  /**
   * Start local speech recognition with live callback
   */
  public startListening(callbacks: {
    onResult: (transcript: string, isFinal: boolean) => void;
    onError?: (error: string) => void;
    onEnd?: () => void;
  }): boolean {
    if (!this.recognition) {
      callbacks.onError?.('Speech recognition is not supported natively by this browser. Manual input is available.');
      return false;
    }

    if (this.isListening) return true;

    try {
      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        callbacks.onResult(text.trim(), Boolean(finalTranscript));
      };

      this.recognition.onerror = (event: any) => {
        console.warn('[SpeechEngine] Recognition error:', event.error);
        callbacks.onError?.(event.error || 'Speech recognition error');
      };

      this.recognition.onend = () => {
        this.isListening = false;
        callbacks.onEnd?.();
      };

      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (err: any) {
      this.isListening = false;
      callbacks.onError?.(err?.message || 'Could not start microphone speech recognition');
      return false;
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore stop error
      }
      this.isListening = false;
    }
  }

  public isSpeechRecognitionAvailable(): boolean {
    return Boolean(this.recognition);
  }

  public isTTSSupported(): boolean {
    return Boolean(this.synth);
  }
}

export const defaultSpeechEngine = new SpeechEngine();
