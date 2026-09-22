import { SignDefinition, VisualSignSequence } from './types';
import { SUPPORTED_SIGNS, VOCABULARY_BY_ID } from './vocabulary';

/**
 * Reverse Communication: Speech/Text to Visual Sign Cues
 * 
 * Maps spoken speech transcripts or typed input to structured visual sign cue sequences.
 * SignEdge explicitly restricts generation to verifiable, canonical sign sequences
 * rather than fabricating ungrounded 3D animations for arbitrary out-of-vocabulary phrases.
 */
export class VisualCueGenerator {
  /**
   * Keyword and synonym mapping to canonical sign IDs
   */
  private keywordMap: Record<string, string> = {
    // Greetings
    'hello': 'hello',
    'hi': 'hello',
    'hey': 'hello',
    'greetings': 'hello',
    'goodbye': 'goodbye',
    'bye': 'goodbye',
    'meet': 'nice_to_meet_you',

    // Courtesies
    'thanks': 'thank_you',
    'thank': 'thank_you',
    'please': 'please',
    'repeat': 'repeat',
    'again': 'repeat',

    // Emergency / Medical
    'help': 'help',
    'assist': 'help',
    'assistance': 'help',
    'emergency': 'emergency',
    'urgent': 'emergency',
    'pain': 'pain',
    'hurt': 'pain',
    'ache': 'pain',
    'doctor': 'doctor',
    'physician': 'doctor',
    'nurse': 'doctor',
    'hospital': 'hospital',
    'clinic': 'hospital',
    'medicine': 'medicine',
    'pills': 'medicine',
    'medication': 'medicine',

    // Daily Essentials
    'yes': 'yes',
    'yeah': 'yes',
    'correct': 'yes',
    'no': 'no',
    'nope': 'no',
    'water': 'need_water',
    'drink': 'need_water',
    'hungry': 'hungry',
    'food': 'hungry',
    'eat': 'hungry',
    'restroom': 'restroom',
    'bathroom': 'restroom',
    'toilet': 'restroom',
    'washroom': 'restroom',

    // Questions / Pronouns
    'where': 'where',
    'location': 'where',
    'name': 'name',
    'me': 'me',
    'i': 'me',
    'my': 'me',
    'you': 'you',
    'your': 'you',
  };

  /**
   * Translates spoken or typed natural language into an ordered sequence of supported visual signs
   */
  public generateCueSequence(phrase: string): VisualSignSequence {
    if (!phrase || !phrase.trim()) {
      return {
        spokenPhrase: '',
        mappedSigns: [],
        unmappedWords: [],
        timingIntervalMs: 2500
      };
    }

    const clean = phrase.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
    const words = clean.split(/\s+/).filter(Boolean);

    const mappedSigns: SignDefinition[] = [];
    const unmappedWords: string[] = [];
    const addedSignIds = new Set<string>();

    for (const word of words) {
      const signId = this.keywordMap[word];
      if (signId && !addedSignIds.has(signId)) {
        const signDef = VOCABULARY_BY_ID.get(signId);
        if (signDef) {
          mappedSigns.push(signDef);
          addedSignIds.add(signId);
        }
      } else if (!signId && word.length > 2) {
        unmappedWords.push(word);
      }
    }

    return {
      spokenPhrase: phrase,
      mappedSigns,
      unmappedWords,
      timingIntervalMs: 2400
    };
  }

  public getSupportedKeywords(): string[] {
    return Object.keys(this.keywordMap);
  }
}

export const defaultVisualCueGenerator = new VisualCueGenerator();
