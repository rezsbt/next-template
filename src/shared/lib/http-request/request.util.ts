import { AxiosError } from 'axios';
import type { HttpResponseError, HttpResponseFailed } from '@/shared/types/http.type';

export function isHttpResponseFailed(value: unknown): value is HttpResponseFailed {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    (value as HttpResponseFailed).success === false &&
    'error' in value
  );
}

export function isHttpResponseError(value: unknown): value is HttpResponseError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof (value as { message: unknown }).message === 'string'
  );
}

function createHttpResponseError(
  message: string,
  details: any = null,
  code = '',
): HttpResponseError {
  return { message, details, code };
}

function withDefaultCode(error: HttpResponseError): HttpResponseError {
  return {
    ...error,
    code: typeof error.code === 'string' ? error.code : '',
  };
}

/** Normalize any thrown value into the API error object (not the full envelope). */
export function toHttpError(error: unknown): HttpResponseError {
  if (error instanceof AxiosError && isHttpResponseFailed(error.response?.data)) {
    return withDefaultCode(error.response.data.error);
  }
  if (isHttpResponseFailed(error)) {
    return withDefaultCode(error.error);
  }
  if (isHttpResponseError(error)) {
    return withDefaultCode(error);
  }
  if (error instanceof Error) {
    return createHttpResponseError(error.message);
  }
  if (typeof error === 'string' && error.length > 0) {
    return createHttpResponseError(error);
  }
  return createHttpResponseError('Unexpected error');
}

export function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export function setCookie(name: string, value: string, expires?: Date | number): void {
  let cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax`;

  if (expires instanceof Date) {
    cookie += `; expires=${expires.toUTCString()}`;
  } else if (typeof expires === 'number') {
    cookie += `; max-age=${expires}`;
  }

  document.cookie = cookie;
}

export function removeCookie(name: string): void {
  document.cookie = `${name}=; path=/; Max-Age=0; SameSite=Lax`;
}

export function isMockDevEnabled(): boolean {
  return process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_MOCK_ENABLED === '1';
}
