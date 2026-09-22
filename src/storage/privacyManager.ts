import { localDB } from './db';

export interface StorageAudit {
  usageBytes: number;
  quotaBytes: number;
  usageFormatted: string;
  totalConversations: number;
  storageType: string;
}

export interface PermissionStatusSummary {
  camera: 'granted' | 'denied' | 'prompt' | 'unknown';
  microphone: 'granted' | 'denied' | 'prompt' | 'unknown';
}

/**
 * Privacy Manager: Audits data minimization and ensures local-first privacy
 */
export class PrivacyManager {
  /**
   * Checks current browser permission state for camera and microphone
   */
  public async checkPermissions(): Promise<PermissionStatusSummary> {
    const summary: PermissionStatusSummary = {
      camera: 'unknown',
      microphone: 'unknown'
    };

    if (typeof navigator === 'undefined' || !navigator.permissions) {
      return summary;
    }

    try {
      const camStatus = await navigator.permissions.query({ name: 'camera' as any });
      summary.camera = camStatus.state;
    } catch {
      // Some browsers (like Safari/Firefox) don't support camera query via permissions API
      summary.camera = 'prompt';
    }

    try {
      const micStatus = await navigator.permissions.query({ name: 'microphone' as any });
      summary.microphone = micStatus.state;
    } catch {
      summary.microphone = 'prompt';
    }

    return summary;
  }

  /**
   * Calculates local storage usage footprint
   */
  public async getStorageAudit(): Promise<StorageAudit> {
    let usageBytes = 0;
    let quotaBytes = 0;

    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        usageBytes = estimate.usage || 0;
        quotaBytes = estimate.quota || 0;
      } catch (err) {
        console.warn('[PrivacyManager] Storage estimate unavailable', err);
      }
    }

    const history = await localDB.getHistory().catch(() => []);

    return {
      usageBytes,
      quotaBytes,
      usageFormatted: this.formatBytes(usageBytes),
      totalConversations: history.length,
      storageType: 'Client-side IndexedDB & Cache'
    };
  }

  /**
   * Complete 1-tap data purge:
   * Clears IndexedDB, LocalStorage, and CacheStorage
   */
  public async purgeAllLocalData(): Promise<void> {
    // 1. Clear IndexedDB
    await localDB.clearHistory().catch(() => {});

    // 2. Clear localStorage & sessionStorage
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
      window.sessionStorage.clear();
    }

    // 3. Clear CacheStorage
    if (typeof window !== 'undefined' && 'caches' in window) {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map(key => caches.delete(key)));
      } catch (e) {
        console.warn('[PrivacyManager] Failed clearing caches:', e);
      }
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export const defaultPrivacyManager = new PrivacyManager();
