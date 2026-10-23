'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { use } from 'react';

import { getUsers } from '@/features/users/api/get-users';
import { getPathname, Link } from '@/i18n/navigation';
import { Button } from '@/shared/shadcn/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/shadcn/components/ui/pagination';
import { Spinner } from '@/shared/shadcn/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/shadcn/components/ui/table';

const PAGE_SIZE = 10;

type UsersViewProps = {
  searchParams: Promise<{ page?: string }>;
};

function parsePage(value: string | undefined): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.floor(parsed);
}

function getVisiblePages(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [1];

  if (current > 3) pages.push('ellipsis');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (current < total - 2) pages.push('ellipsis');

  pages.push(total);
  return pages;
}

export function UsersView({ searchParams }: UsersViewProps) {
  const params = use(searchParams);
  const page = parsePage(params.page);
  const locale = useLocale();
  const t = useTranslations('UsersView');

  const buildPageHref = (targetPage: number): string => {
    const pathname = getPathname({ locale, href: '/users' });
    return targetPage <= 1 ? pathname : `${pathname}?page=${targetPage}`;
  };

  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['users', page, PAGE_SIZE],
    queryFn: () => getUsers({ page, pageSize: PAGE_SIZE }),
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
        <Spinner className="size-5" />
        <span>{t('loading')}</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-destructive">
          {error instanceof Error ? error.message : t('error')}
        </p>
        <Button type="button" variant="outline" onClick={() => void refetch()}>
          {t('retry')}
        </Button>
      </div>
    );
  }

  const { items, total, totalPages, page: currentPage } = data;
  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {t('summary', { total, currentPage, totalPages })}
          {isFetching ? t('updating') : null}
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('name')}</TableHead>
            <TableHead>{t('email')}</TableHead>
            <TableHead className="w-[120px]">{t('id')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
                {t('empty')}
              </TableCell>
            </TableRow>
          ) : (
            items.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {user.id.slice(0, 8)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 ? (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={buildPageHref(Math.max(1, currentPage - 1))}
                text={t('previous')}
                aria-disabled={currentPage <= 1}
                className={currentPage <= 1 ? 'pointer-events-none opacity-50' : undefined}
              />
            </PaginationItem>

            {visiblePages.map((item, index) =>
              item === 'ellipsis' ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <PaginationLink href={buildPageHref(item)} isActive={item === currentPage}>
                    {item}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                href={buildPageHref(Math.min(totalPages, currentPage + 1))}
                text={t('next')}
                aria-disabled={currentPage >= totalPages}
                className={
                  currentPage >= totalPages ? 'pointer-events-none opacity-50' : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/" className="underline-offset-4 hover:underline">
          {t('backHome')}
        </Link>
      </p>
    </div>
  );
}
