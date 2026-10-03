import type { PersistStorage, StorageValue } from "zustand/middleware";

const DB_NAME = "quickfiss";
const STORE_NAME = "persisted-state";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function run<T>(mode: IDBTransactionMode, op: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  try {
    return await new Promise<T>((resolve, reject) => {
      const request = op(db.transaction(STORE_NAME, mode).objectStore(STORE_NAME));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}

/**
 * zustand persist storage backed by IndexedDB. Unlike localStorage it keeps real
 * File/Blob values, so uploaded documents survive a refresh. Every operation is
 * best-effort: if IndexedDB is unavailable (some private modes) the app keeps
 * working from memory.
 */
export function createIdbStorage<S>(): PersistStorage<S> {
  return {
    getItem: async (name) => {
      try {
        const value = await run<StorageValue<S> | undefined>("readonly", (s) => s.get(name));
        return value ?? null;
      } catch {
        return null;
      }
    },
    setItem: async (name, value) => {
      try {
        await run("readwrite", (s) => s.put(value, name));
      } catch {
        // storage unavailable or quota exceeded; keep going from memory
      }
    },
    removeItem: async (name) => {
      try {
        await run("readwrite", (s) => s.delete(name));
      } catch {
        // nothing to remove
      }
    },
  };
}
