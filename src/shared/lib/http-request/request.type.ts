import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { HttpResponseSuccess } from '@/shared/types/http.type';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
    /** When true, 401 is rejected without attempting token refresh. */
    skipRefresh?: boolean;
    /**
     * Dev + MSW only (`import.meta.env.DEV` and `VITE_MOCK_ENABLED=1`).
     * When true, sends `x-mock-fail: 1` so mock handlers return a failed envelope.
     */
    mockFail?: boolean;
    /**
     * Dev + MSW only (`import.meta.env.DEV` and `VITE_MOCK_ENABLED=1`).
     * Merged into request query params for mock handlers (e.g. `{ nextStep: 'register' }`).
     */
    mockParams?: Record<string, string | number | boolean | null | undefined>;
    /** Set after a successful refresh so the same request is not refreshed twice. */
    _retry?: boolean;
  }
}

export interface IHttpRequest {
  readonly http: AxiosInstance;
  setBaseURL(url: string): void;
  setAccessToken(token: string | null, expires?: Date | number): void;
  setRefreshToken(token: string | null, expires?: Date | number): void;
  clearTokens(): void;
  setOnLogout(handler: (() => void) | null): void;
  getAccessToken(): string | undefined;
  getRefreshToken(): string | undefined;
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<HttpResponseSuccess<T>>;
  post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<HttpResponseSuccess<T>>;
  put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<HttpResponseSuccess<T>>;
  patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<HttpResponseSuccess<T>>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<HttpResponseSuccess<T>>;
}

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpirationAt: string;
  refreshTokenExpirationAt: string;
};

export type QueueItem = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};
