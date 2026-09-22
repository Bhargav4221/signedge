import { describe, it, expect } from 'vitest';
import { VisualCueGenerator } from '../ai/visualCueGenerator';

describe('VisualCueGenerator', () => {
  it('maps spoken sentence with recognized keywords into a sign sequence', () => {
    const generator = new VisualCueGenerator();
    const result = generator.generateCueSequence('Please help me find the doctor');

    expect(result.mappedSigns.length).toBeGreaterThanOrEqual(2);
    const glosses = result.mappedSigns.map(s => s.gloss);
    expect(glosses).toContain('PLEASE');
    expect(glosses).toContain('HELP');
    expect(glosses).toContain('DOCTOR');
  });

  it('handles empty input gracefully', () => {
    const generator = new VisualCueGenerator();
    const result = generator.generateCueSequence('');
    expect(result.mappedSigns).toHaveLength(0);
  });

  it('maps synonyms accurately', () => {
    const generator = new VisualCueGenerator();
    const result1 = generator.generateCueSequence('thanks');
    expect(result1.mappedSigns[0].gloss).toBe('THANK-YOU');

    const result2 = generator.generateCueSequence('bathroom');
    expect(result2.mappedSigns[0].gloss).toBe('RESTROOM');
  });
});
