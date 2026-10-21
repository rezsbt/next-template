import type { PaginatedUsers } from '@/features/users/types';
import { request } from '@/shared/lib/http-request';

export type GetUsersParams = {
  page?: number;
  pageSize?: number;
};

export async function getUsers({
  page = 1,
  pageSize = 10,
}: GetUsersParams = {}): Promise<PaginatedUsers> {
  const res = await request.get<PaginatedUsers>('/v1/users', {
    params: { page, pageSize },
  });
  return res.data;
}
