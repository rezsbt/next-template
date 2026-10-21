import { fakerFA as faker } from '@faker-js/faker';

import type { PaginatedUsers, User } from '@/features/users/types';
import type { HttpResponseFailed, HttpResponseSuccess } from '@/shared/types/http.type';

export type { PaginatedUsers, User };

export function createUser(overrides?: Partial<User>): User {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    ...overrides,
  };
}

export function createUsers(count = 5): User[] {
  return Array.from({ length: count }, () => createUser());
}

/** Stable dataset for pagination across MSW requests. */
faker.seed(42);
export const ALL_USERS = createUsers(47);

export function paginateUsers(
  page = 1,
  pageSize = 10,
  users: User[] = ALL_USERS,
): PaginatedUsers {
  const safePageSize = Math.max(1, pageSize);
  const total = users.length;
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * safePageSize;

  return {
    items: users.slice(start, start + safePageSize),
    page: safePage,
    pageSize: safePageSize,
    total,
    totalPages,
  };
}

export function createSuccessEnvelope<T>(data: T): HttpResponseSuccess<T> {
  return {
    data,
    targetUrl: null,
    success: true,
    error: null,
    unauthorizedRequest: false,
    __wrapped: true,
    __traceId: faker.string.uuid(),
  };
}

export function createFailedEnvelope(
  message = 'Mock failure',
  code = 'MOCK_FAIL',
): HttpResponseFailed {
  return {
    data: null,
    targetUrl: null,
    success: false,
    error: { message, details: null, code },
    unauthorizedRequest: false,
    __wrapped: true,
    __traceId: faker.string.uuid(),
  };
}
