import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { READER_DEFAULTS } from '@/lib/constants';

interface ReaderState {
  fontSize: number;
  theme: 'light' | 'dark' | 'sepia';
  fontFamily: string;
  lineHeight: number;
  setFontSize: (size: number) => void;
  setTheme: (theme: 'light' | 'dark' | 'sepia') => void;
  setFontFamily: (family: string) => void;
  setLineHeight: (height: number) => void;
  resetDefaults: () => void;
}

export const useReaderStore = create<ReaderState>()(
  persist(
    (set) => ({
      fontSize: READER_DEFAULTS?.fontSize || 18,
      theme: (READER_DEFAULTS?.theme as 'light' | 'dark' | 'sepia') || 'light',
      fontFamily: READER_DEFAULTS?.fontFamily || 'Arial',
      lineHeight: READER_DEFAULTS?.lineHeight || 1.5,
      setFontSize: (fontSize) => set({ fontSize }),
      setTheme: (theme) => set({ theme }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setLineHeight: (lineHeight) => set({ lineHeight }),
      resetDefaults: () =>
        set({
          fontSize: READER_DEFAULTS?.fontSize || 18,
          theme: (READER_DEFAULTS?.theme as 'light' | 'dark' | 'sepia') || 'light',
          fontFamily: READER_DEFAULTS?.fontFamily || 'Arial',
          lineHeight: READER_DEFAULTS?.lineHeight || 1.5,
        }),
    }),
    {
      name: 'reader-storage',
    }
  )
);
