import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';

import '@/assets/styles/globals.css';
import { routing } from '@/i18n/routing';
import { AppProviders } from '@/providers/app-providers';
import { cn } from '@/shared/shadcn/lib/utils';

const vazirmatn = localFont({
  src: '../../assets/fonts/Vazirmatn[wght].woff2',
  variable: '--font-sans',
  weight: '100 900',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Next Playground',
  description: 'Next.js playground',
};

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<'/[locale]'>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const direction = locale === 'fa' ? 'rtl' : 'ltr';

  return (
    <html
      lang={locale}
      dir={direction}
      className={cn('h-full', 'antialiased', 'font-sans', vazirmatn.variable)}
    >
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
          <AppProviders direction={direction}>{children}</AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
