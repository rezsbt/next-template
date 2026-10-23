import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';

import { Link } from '@/i18n/navigation';
import { LocaleSwitcher } from '@/shared/components/locale-switcher';

export default function Home({ params }: PageProps<'/[locale]'>) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations('HomePage');

  return (
    <main className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex items-center justify-between gap-4">
        <p>{t('greeting')}</p>
        <LocaleSwitcher />
      </div>
      <Link href="/users" className="w-fit text-sm underline-offset-4 hover:underline">
        {t('usersLink')}
      </Link>
    </main>
  );
}
