import { ConversationTurn } from '../ai/types';

const DB_NAME = 'signedge_local_db';
const DB_VERSION = 1;
const STORE_CONVERSATIONS = 'conversations';
const STORE_SETTINGS = 'settings';

/**
 * Local IndexedDB Database Adapter
 * Ensures all conversation transcripts and settings remain strictly on the user's device.
 */
export class LocalDatabase {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB not supported in this environment'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_CONVERSATIONS)) {
          const store = db.createObjectStore(STORE_CONVERSATIONS, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
          db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
        }
      };

      request.onsuccess = (event: any) => {
        resolve(event.target.result);
      };

      request.onerror = (event: any) => {
        reject(event.target.error);
      };
    });

    return this.dbPromise;
  }

  /**
   * Save a single conversation turn locally
   */
  public async saveTurn(turn: ConversationTurn): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_CONVERSATIONS, 'readwrite');
      const store = tx.objectStore(STORE_CONVERSATIONS);
      const req = store.put(turn);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Retrieve all conversation history sorted chronologically
   */
  public async getHistory(): Promise<ConversationTurn[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_CONVERSATIONS, 'readonly');
      const store = tx.objectStore(STORE_CONVERSATIONS);
      const req = store.getAll();
      req.onsuccess = () => {
        const records: ConversationTurn[] = req.result || [];
        records.sort((a, b) => a.timestamp - b.timestamp);
        resolve(records);
      };
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Delete a single conversation turn
   */
  public async deleteTurn(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_CONVERSATIONS, 'readwrite');
      const store = tx.objectStore(STORE_CONVERSATIONS);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Complete purge of all local conversation records
   */
  public async clearHistory(): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_CONVERSATIONS, 'readwrite');
      const store = tx.objectStore(STORE_CONVERSATIONS);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Save custom user settings
   */
  public async saveSetting<T>(key: string, value: T): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_SETTINGS, 'readwrite');
      const store = tx.objectStore(STORE_SETTINGS);
      const req = store.put({ key, value });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Load custom user settings
   */
  public async getSetting<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_SETTINGS, 'readonly');
        const store = tx.objectStore(STORE_SETTINGS);
        const req = store.get(key);
        req.onsuccess = () => {
          if (req.result && req.result.value !== undefined) {
            resolve(req.result.value);
          } else {
            resolve(defaultValue);
          }
        };
        req.onerror = () => resolve(defaultValue);
      });
    } catch {
      return defaultValue;
    }
  }

  /**
   * Export conversation logs as formatted JSON string
   */
  public async exportAsJSON(): Promise<string> {
    const history = await this.getHistory();
    return JSON.stringify(
      {
        product: 'SignEdge',
        exportedAt: new Date().toISOString(),
        totalTurns: history.length,
        data: history
      },
      null,
      2
    );
  }

  /**
   * Export conversation logs as human-readable plain text
   */
  public async exportAsText(): Promise<string> {
    const history = await this.getHistory();
    const lines = [
      '========================================',
      'SignEdge — Local Conversation Transcript',
      `Exported: ${new Date().toLocaleString()}`,
      '========================================',
      ''
    ];

    for (const turn of history) {
      const timeStr = new Date(turn.timestamp).toLocaleTimeString();
      const speaker = turn.sender === 'signer' ? 'SIGNER (Visual)' : 'SPEAKER (Voice)';
      const glossInfo = turn.gloss ? ` [Gloss: ${turn.gloss}]` : '';
      lines.push(`[${timeStr}] ${speaker}${glossInfo}:`);
      lines.push(`  "${turn.text}"`);
      lines.push('');
    }

    return lines.join('\n');
  }
}

export const localDB = new LocalDatabase();
