import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Suspense, use } from 'react';

import { UsersView } from '@/features/users/components/users-view';
import { Spinner } from '@/shared/shadcn/components/ui/spinner';

function UsersLoading() {
  const t = useTranslations('UsersView');

  return (
    <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
      <Spinner className="size-5" />
      <span>{t('loading')}</span>
    </div>
  );
}

export default function UsersPage({
  params,
  searchParams,
}: PageProps<'/[locale]/users'>) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations('UsersPage');

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </header>

      <Suspense fallback={<UsersLoading />}>
        <UsersView searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
