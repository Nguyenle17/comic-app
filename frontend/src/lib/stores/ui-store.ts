import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface UiState {
  isDarkMode: boolean;
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  toasts: Toast[];
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      isDarkMode: false,
      isSidebarOpen: false,
      isMobileMenuOpen: false,
      toasts: [],
      toggleDarkMode: () => {
        const newDarkMode = !get().isDarkMode;
        set({ isDarkMode: newDarkMode });
        if (typeof document !== 'undefined') {
          if (newDarkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      addToast: (toastData) => {
        const id = Math.random().toString(36).substring(2, 9);
        const toast = { ...toastData, id, duration: toastData.duration || 3000 };
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
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== 'undefined') {
          if (state.isDarkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },
    }
  )
);

export const useUIStore = useUiStore;

