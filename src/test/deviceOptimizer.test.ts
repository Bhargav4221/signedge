import { describe, it, expect } from 'vitest';
import { DeviceOptimizer } from '../ai/deviceOptimizer';

describe('DeviceOptimizer', () => {
  it('returns low tier profile with appropriate frame and resolution settings', () => {
    const optimizer = new DeviceOptimizer();
    optimizer.setTierOverride('low');
    const profile = optimizer.getProfile();

    expect(profile.tier).toBe('low');
    expect(profile.recommendedFps).toBe(15);
    expect(profile.resolution.width).toBe(320);
    expect(profile.skipFrames).toBe(1);
  });

  it('returns high tier profile with 30fps and full resolution', () => {
    const optimizer = new DeviceOptimizer();
    optimizer.setTierOverride('high');
    const profile = optimizer.getProfile();

    expect(profile.tier).toBe('high');
    expect(profile.recommendedFps).toBe(30);
    expect(profile.resolution.width).toBe(640);
    expect(profile.hardwareAcceleration).toBe(true);
  });
});
