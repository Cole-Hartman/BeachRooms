import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY in .env"
  );
}

// SecureStore adapter for native platforms
const secureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

// localStorage adapter for web
const localStorageAdapter = {
  getItem: (key: string) => {
    if (typeof window !== "undefined") {
      return Promise.resolve(window.localStorage.getItem(key));
    }
    return Promise.resolve(null);
  },
  setItem: (key: string, value: string) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, value);
    }
    return Promise.resolve();
  },
  removeItem: (key: string) => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
    return Promise.resolve();
  },
};

// Use SecureStore for native (secure storage), localStorage for web
const storageAdapter =
  Platform.OS === "web" ? localStorageAdapter : secureStoreAdapter;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    // Enable URL session detection on web for OAuth callback
    detectSessionInUrl: Platform.OS === "web",
  },
});
