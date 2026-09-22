import { DeviceTier, PerformanceProfile } from './types';

/**
 * Device Capability Detection and Adaptive Performance Engine
 * Automatically optimizes video capture resolution, frame rate, and model
 * buffer sizing to match hardware capabilities (memory, CPU cores, battery level).
 */
export class DeviceOptimizer {
  private currentTier: DeviceTier = 'medium';
  private customOverride: DeviceTier | null = null;
  private isLowBattery: boolean = false;

  constructor() {
    this.detectCapabilities();
    this.initBatteryMonitoring();
  }

  public detectCapabilities(): DeviceTier {
    if (this.customOverride) return this.customOverride;

    if (typeof navigator === 'undefined') {
      this.currentTier = 'medium';
      return 'medium';
    }

    const cores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as any).deviceMemory || 4; // GB

    // Detection logic
    if (cores <= 2 || memory <= 2 || this.isLowBattery) {
      this.currentTier = 'low';
    } else if (cores >= 8 && memory >= 8) {
      this.currentTier = 'high';
    } else {
      this.currentTier = 'medium';
    }

    return this.currentTier;
  }

  private initBatteryMonitoring() {
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any).getBattery?.().then((battery: any) => {
        const updateBattery = () => {
          this.isLowBattery = battery.level < 0.20 && !battery.charging;
          this.detectCapabilities();
        };
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      }).catch(() => {
        // Battery API not permitted/available
      });
    }
  }

  public setTierOverride(tier: DeviceTier | null) {
    this.customOverride = tier;
    this.detectCapabilities();
  }

  public getProfile(): PerformanceProfile {
    const tier = this.customOverride || this.currentTier;

    switch (tier) {
      case 'low':
        return {
          tier: 'low',
          recommendedFps: 15,
          resolution: { width: 320, height: 240 },
          temporalWindowSize: 16,
          skipFrames: 1, // evaluate every other frame
          hardwareAcceleration: false
        };
      case 'high':
        return {
          tier: 'high',
          recommendedFps: 30,
          resolution: { width: 640, height: 480 },
          temporalWindowSize: 30,
          skipFrames: 0,
          hardwareAcceleration: true
        };
      case 'medium':
      default:
        return {
          tier: 'medium',
          recommendedFps: 24,
          resolution: { width: 480, height: 360 },
          temporalWindowSize: 22,
          skipFrames: 0,
          hardwareAcceleration: true
        };
    }
  }

  public getHardwareSpecs() {
    return {
      cores: typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 'Unknown' : 'N/A',
      memory: typeof navigator !== 'undefined' ? `${(navigator as any).deviceMemory || 4} GB` : 'N/A',
      currentTier: this.customOverride || this.currentTier,
      isBatteryLow: this.isLowBattery
    };
  }
}

export const defaultDeviceOptimizer = new DeviceOptimizer();
