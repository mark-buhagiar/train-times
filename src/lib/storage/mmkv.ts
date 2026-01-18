import { Platform } from "react-native";

// Storage interface that works across platforms
interface StorageAdapter {
  set: (key: string, value: string) => void;
  getString: (key: string) => string | undefined;
  remove: (key: string) => boolean;
  contains: (key: string) => boolean;
  getAllKeys: () => string[];
}

// Create a localStorage-based adapter for web
function createWebStorage(id: string): StorageAdapter {
  const prefix = `${id}:`;

  return {
    set: (key: string, value: string) => {
      try {
        localStorage.setItem(`${prefix}${key}`, value);
      } catch {
        // localStorage might be unavailable (SSR, private mode, etc.)
      }
    },
    getString: (key: string) => {
      try {
        return localStorage.getItem(`${prefix}${key}`) ?? undefined;
      } catch {
        return undefined;
      }
    },
    remove: (key: string) => {
      try {
        localStorage.removeItem(`${prefix}${key}`);
        return true;
      } catch {
        return false;
      }
    },
    contains: (key: string) => {
      try {
        return localStorage.getItem(`${prefix}${key}`) !== null;
      } catch {
        return false;
      }
    },
    getAllKeys: () => {
      try {
        const keys: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith(prefix)) {
            keys.push(key.slice(prefix.length));
          }
        }
        return keys;
      } catch {
        return [];
      }
    },
  };
}

// Create a no-op storage for environments where storage isn't available
function createNoopStorage(): StorageAdapter {
  return {
    set: () => {},
    getString: () => undefined,
    remove: () => false,
    contains: () => false,
    getAllKeys: () => [],
  };
}

// Create the appropriate storage based on platform
let storage: StorageAdapter;

if (Platform.OS === "web") {
  storage = createWebStorage("train-times-storage");
} else {
  // Native platforms - use MMKV
  try {
    const { createMMKV } = require("react-native-mmkv");
    storage = createMMKV({
      id: "train-times-storage",
    });
  } catch {
    // Fallback for environments where MMKV isn't available (tests)
    storage = createNoopStorage();
  }
}

export { storage };
export type { StorageAdapter };

/**
 * Helper functions for typed storage access
 */
export const mmkvStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  getItem: (key: string): string | null => {
    const value = storage.getString(key);
    return value ?? null;
  },
  removeItem: (key: string) => {
    storage.remove(key);
  },
};

/**
 * Zustand persist storage adapter for MMKV
 */
export const zustandMMKVStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  removeItem: (name: string) => {
    storage.remove(name);
  },
};
