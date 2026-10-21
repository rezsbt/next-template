import { UsersView } from '@/features/users/components/users-view';

export default function UsersPage({ searchParams }: PageProps<'/users'>) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">کاربران</h1>
        <p className="text-sm text-muted-foreground">لیست کاربران با صفحه‌بندی</p>
      </header>

      <UsersView searchParams={searchParams} />
    </main>
  );
}
