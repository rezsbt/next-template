'use client';

import { type ReactNode } from 'react';

import { DirectionProvider } from '@/shared/shadcn/components/ui/direction';

import { CounterStoreProvider } from './counter-store-provider';
import { MSWProvider } from './msw-provider';
import { QueryProvider } from './query-provider';

export function AppProviders({
  children,
  direction,
}: {
  children: ReactNode;
  direction: 'ltr' | 'rtl';
}) {
  return (
    <MSWProvider>
      <DirectionProvider direction={direction}>
        <QueryProvider>
          <CounterStoreProvider>{children}</CounterStoreProvider>
        </QueryProvider>
      </DirectionProvider>
    </MSWProvider>
  );
}
