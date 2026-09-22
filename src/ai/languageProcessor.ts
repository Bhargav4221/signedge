import { VOCABULARY_BY_GLOSS } from './vocabulary';

/**
 * Language Processing Layer
 * 
 * Separates vision/temporal classification from natural language generation.
 * In sign languages (like ASL), grammatical structure and glosses differ from spoken English.
 * For example:
 *   [ME, NEED, HELP] -> "I need help, please."
 *   [WHERE, RESTROOM] -> "Where is the restroom?"
 *   [THANK-YOU] -> "Thank you very much."
 * 
 * This layer smooths isolated sign semantic tokens into fluent, polite, contextually appropriate
 * natural language sentences for screen display and speech synthesis.
 */
export class LanguageProcessor {
  private recentGlosses: { gloss: string; timestamp: number }[] = [];
  private readonly sequenceTimeoutMs: number = 3500; // Combine signs within 3.5 seconds

  /**
   * Phrase templates mapping multi-gloss sequences to natural spoken English
   */
  private phraseRules: { pattern: string[]; naturalPhrase: string }[] = [
    {
      pattern: ['ME', 'HELP'],
      naturalPhrase: 'I need help, please.'
    },
    {
      pattern: ['ME', 'NEED', 'HELP'],
      naturalPhrase: 'I urgently need help, please.'
    },
    {
      pattern: ['WHERE', 'RESTROOM'],
      naturalPhrase: 'Where is the nearest restroom?'
    },
    {
      pattern: ['WHERE', 'DOCTOR'],
      naturalPhrase: 'Where can I find a doctor?'
    },
    {
      pattern: ['WHERE', 'HOSPITAL'],
      naturalPhrase: 'Where is the hospital?'
    },
    {
      pattern: ['ME', 'PAIN'],
      naturalPhrase: 'I am experiencing severe pain.'
    },
    {
      pattern: ['ME', 'HUNGRY'],
      naturalPhrase: 'I am hungry, I need something to eat.'
    },
    {
      pattern: ['ME', 'WATER'],
      naturalPhrase: 'Could I please have some water?'
    },
    {
      pattern: ['HELLO', 'NICE-MEET-YOU'],
      naturalPhrase: 'Hello! It is very nice to meet you.'
    },
    {
      pattern: ['THANK-YOU', 'GOODBYE'],
      naturalPhrase: 'Thank you very much, goodbye!'
    },
    {
      pattern: ['PLEASE', 'AGAIN'],
      naturalPhrase: 'Could you please repeat that again?'
    },
    {
      pattern: ['YOU', 'NAME', 'WHERE'],
      naturalPhrase: 'What is your name?'
    },
    {
      pattern: ['EMERGENCY', 'HELP'],
      naturalPhrase: 'This is an emergency, please help!'
    }
  ];

  /**
   * Registers a newly recognized sign gloss and returns the smoothed natural sentence
   */
  public processGloss(gloss: string, timestamp = performance.now()): { naturalText: string; isComposite: boolean } {
    // Purge outdated glosses outside temporal window
    this.recentGlosses = this.recentGlosses.filter(
      item => timestamp - item.timestamp < this.sequenceTimeoutMs
    );

    // Prevent immediate consecutive duplicate spam
    const lastItem = this.recentGlosses[this.recentGlosses.length - 1];
    if (!lastItem || lastItem.gloss !== gloss) {
      this.recentGlosses.push({ gloss, timestamp });
    }

    // Check for multi-sign composite matches
    const currentGlosses = this.recentGlosses.map(item => item.gloss);
    const matchedRule = this.findMatchingPhrase(currentGlosses);

    if (matchedRule) {
      // Clear buffer after composite match
      this.recentGlosses = [];
      return { naturalText: matchedRule, isComposite: true };
    }

    // Single sign default natural phrase
    const signDef = VOCABULARY_BY_GLOSS.get(gloss);
    const naturalText = signDef ? signDef.naturalPhrase : gloss;

    return { naturalText, isComposite: false };
  }

  /**
   * Reset the current temporal sequence buffer
   */
  public clearSequence() {
    this.recentGlosses = [];
  }

  public getPendingGlosses(): string[] {
    return this.recentGlosses.map(g => g.gloss);
  }

  /**
   * Evaluates if any defined multi-sign sequence pattern matches the end of recent glosses
   */
  private findMatchingPhrase(glosses: string[]): string | null {
    if (glosses.length < 2) return null;

    for (const rule of this.phraseRules) {
      const pLen = rule.pattern.length;
      if (glosses.length >= pLen) {
        const slice = glosses.slice(-pLen);
        const matches = rule.pattern.every((expected, idx) => expected === slice[idx]);
        if (matches) {
          return rule.naturalPhrase;
        }
      }
    }

    return null;
  }
}

export const defaultLanguageProcessor = new LanguageProcessor();
