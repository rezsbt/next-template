'use client';

import { type ReactNode } from 'react';

import { DirectionProvider } from '@/shared/shadcn/components/ui/direction';

import { CounterStoreProvider } from './counter-store-provider';
import { QueryProvider } from './query-provider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <DirectionProvider direction="rtl">
      <QueryProvider>
        <CounterStoreProvider>{children}</CounterStoreProvider>
      </QueryProvider>
    </DirectionProvider>
  );
}
