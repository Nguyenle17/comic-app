import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'vi' | 'en';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface UiState {
  isDarkMode: boolean;
  language: Language;
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  toasts: Toast[];
  toggleDarkMode: () => void;
  setLanguage: (language: Language) => void;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      isDarkMode: false,
      language: 'vi',
      isSidebarOpen: false,
      isMobileMenuOpen: false,
      toasts: [],
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setLanguage: (language) => set({ language }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      addToast: (toastData) => {
        const id = Math.random().toString(36).substring(2, 9);
        const toast = { ...toastData, id, duration: toastData.duration || 4000 };
        set((state) => ({ toasts: [...state.toasts, toast] }));
        setTimeout(() => {
          get().removeToast(id);
        }, toast.duration);
      },
      removeToast: (id) =>
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        language: state.language,
      }),
    }
  )
);
