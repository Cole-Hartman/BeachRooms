import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

interface Settings {
  hideMap: boolean;
  autoCenter: boolean;
  darkMode: boolean;
  sortByDistance: boolean;
}

const STORAGE_KEY = '@beach_rooms_settings';

const defaults: Settings = {
  hideMap: false,
  autoCenter: false,
  darkMode: false,
  sortByDistance: false,
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaults);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setSettings({ ...defaults, ...JSON.parse(raw) });
        } catch {}
      }
      setLoaded(true);
    });
  }, []);

  const update = useCallback(
    <K extends keyof Settings>(key: K, value: Settings[K]) => {
      setSettings((prev) => {
        const next = { ...prev, [key]: value };
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  return { settings, update, loaded };
}
