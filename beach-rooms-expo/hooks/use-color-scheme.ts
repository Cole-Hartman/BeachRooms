import { createContext, useContext } from 'react';

export type ColorScheme = 'light' | 'dark';

export const ColorSchemeContext = createContext<{
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
}>({
  colorScheme: 'light',
  setColorScheme: () => {},
});

export function useColorScheme(): ColorScheme {
  return useContext(ColorSchemeContext).colorScheme;
}

export function useColorSchemeToggle() {
  return useContext(ColorSchemeContext);
}
