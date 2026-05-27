'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { PopupProvider } from '@/components/popup/PopupProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <PopupProvider />
    </SessionProvider>
  );
}
