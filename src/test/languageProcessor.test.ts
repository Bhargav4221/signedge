import { describe, it, expect } from 'vitest';
import { LanguageProcessor } from '../ai/languageProcessor';

describe('LanguageProcessor', () => {
  it('maps single gloss to natural language phrase', () => {
    const processor = new LanguageProcessor();
    const result = processor.processGloss('HELLO');
    expect(result.naturalText).toContain('Hello');
    expect(result.isComposite).toBe(false);
  });

  it('smooths multi-gloss sequence into a composite sentence', () => {
    const processor = new LanguageProcessor();
    const now = 1000;
    processor.processGloss('ME', now);
    const result = processor.processGloss('HELP', now + 200);

    expect(result.isComposite).toBe(true);
    expect(result.naturalText).toBe('I need help, please.');
  });

  it('smooths WHERE RESTROOM sequence correctly', () => {
    const processor = new LanguageProcessor();
    const now = 1000;
    processor.processGloss('WHERE', now);
    const result = processor.processGloss('RESTROOM', now + 250);

    expect(result.isComposite).toBe(true);
    expect(result.naturalText).toBe('Where is the nearest restroom?');
  });

  it('handles unknown glosses gracefully by returning raw token', () => {
    const processor = new LanguageProcessor();
    const result = processor.processGloss('CUSTOM_TOKEN');
    expect(result.naturalText).toBe('CUSTOM_TOKEN');
  });
});
