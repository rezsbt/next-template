import type { Metadata } from 'next';
import localFont from 'next/font/local';

import '@/assets/styles/globals.css';
import { AppProviders } from '@/providers/app-providers';
import { cn } from '@/shared/shadcn/lib/utils';

const vazirmatn = localFont({
  src: '../assets/fonts/Vazirmatn[wght].woff2',
  variable: '--font-sans',
  weight: '100 900',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Next Playground',
  description: 'Next.js playground',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={cn('h-full', 'antialiased', 'font-sans', vazirmatn.variable)}
    >
      <body className="flex min-h-full flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
