import { http, HttpResponse } from 'msw/http';

import {
  createFailedEnvelope,
  createSuccessEnvelope,
  paginateUsers,
} from '../fixtures/users.fixture';

function parsePositiveInt(value: string | null, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.floor(parsed);
}

export const usersHandlers = [
  http.get('*/v1/users', ({ request }) => {
    if (request.headers.get('x-mock-fail') === '1') {
      return HttpResponse.json(createFailedEnvelope(), { status: 400 });
    }

    const url = new URL(request.url);
    const page = parsePositiveInt(url.searchParams.get('page'), 1);
    const pageSize = parsePositiveInt(url.searchParams.get('pageSize'), 10);

    return HttpResponse.json(createSuccessEnvelope(paginateUsers(page, pageSize)));
  }),
];
