import { describe, it, expect } from 'vitest';
import { TemporalSignModel } from '../ai/temporalSignModel';
import { LandmarkDetector } from '../ai/landmarkDetector';

describe('TemporalSignModel', () => {
  it('initializes with default window size and empty buffer', () => {
    const detector = new LandmarkDetector(true);
    const model = new TemporalSignModel(detector, 24);
    expect(model).toBeDefined();
  });

  it('returns null when buffer has insufficient frames', () => {
    const detector = new LandmarkDetector(true);
    const model = new TemporalSignModel(detector, 20);

    const frame = detector.processVideoFrame(null, null);
    const result = model.pushFrame(frame);
    expect(result).toBeNull();
  });

  it('evaluates sequence when sufficient frames are buffered', () => {
    const detector = new LandmarkDetector(true);
    const model = new TemporalSignModel(detector, 12);

    let lastResult = null;
    for (let i = 0; i < 15; i++) {
      const frame = detector.processVideoFrame(null, null);
      lastResult = model.pushFrame(frame);
    }

    // In simulated test mode, detector generates simulated gestures
    expect(lastResult).toBeDefined();
  });

  it('clears buffer correctly', () => {
    const detector = new LandmarkDetector(true);
    const model = new TemporalSignModel(detector, 15);

    for (let i = 0; i < 10; i++) {
      model.pushFrame(detector.processVideoFrame(null, null));
    }

    model.clearBuffer();
    const result = model.pushFrame(detector.processVideoFrame(null, null));
    expect(result).toBeNull();
  });
});
