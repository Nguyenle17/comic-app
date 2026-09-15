'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/lib/stores/ui-store';

export default function Providers({ children }: { children: React.ReactNode }) {
  const isDarkMode = useUIStore((s) => s.isDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return <>{children}</>;
}
