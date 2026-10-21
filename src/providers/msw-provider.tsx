'use client';

import { type ReactNode, useLayoutEffect, useState } from 'react';

import { env } from '@/shared/lib/env';
import { cn } from '@/shared/shadcn/lib/utils';

export function MSWProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(!env.MOCK_ENABLED);

  useLayoutEffect(() => {
    if (!env.MOCK_ENABLED || typeof window === 'undefined') {
      setIsReady(true);
      return;
    }

    let cancelled = false;

    void import('@/mock/browser')
      .then(async ({ worker }) => {
        await worker.start({
          onUnhandledFrame: 'bypass',
        });
        if (!cancelled) setIsReady(true);
      })
      .catch(() => {
        if (!cancelled) setIsReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Always render children so SSR / instant navigation can validate the segment.
  // Hide until the worker is ready so client requests don't race the mock.
  return (
    <div
      className={cn('contents', !isReady && 'invisible pointer-events-none')}
      aria-busy={!isReady}
      aria-hidden={!isReady}
    >
      {children}
    </div>
  );
}
