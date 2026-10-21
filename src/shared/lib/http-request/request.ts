import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { storageKeys } from '@/shared/constants';
import { env } from '@/shared/lib/env';
import type { HttpResponseFailed, HttpResponseSuccess } from '@/shared/types/http.type';
import type { IHttpRequest, QueueItem, TokenPair } from './request.type';
import { getCookie, isMockDevEnabled, removeCookie, setCookie, toHttpError } from './request.util';

const { accessToken: ACCESS_TOKEN_COOKIE, refreshToken: REFRESH_TOKEN_COOKIE } = storageKeys.cookie;

export class HttpRequest implements IHttpRequest {
  private static instance: HttpRequest | null = null;

  public readonly http;

  private onLogout: (() => void) | null = null;

  private isRefreshing = false;

  private failedQueue: QueueItem[] = [];

  private constructor() {
    this.http = axios.create({
      baseURL: env.SERVER_ADDRESS,
    });

    this.http.interceptors.request.use((config) => this.attachRequestDefaults(config));
    this.http.interceptors.response.use(
      (response) => response,
      (error: AxiosError<HttpResponseFailed>) => this.handleResponseError(error),
    );
  }

  public static getInstance(): HttpRequest {
    if (!HttpRequest.instance) {
      HttpRequest.instance = new HttpRequest();
    }
    return HttpRequest.instance;
  }

  public setBaseURL(url: string): void {
    this.http.defaults.baseURL = url;
  }

  public setAccessToken(token: string | null, expires?: Date | number): void {
    if (token === null) removeCookie(ACCESS_TOKEN_COOKIE);
    else setCookie(ACCESS_TOKEN_COOKIE, token, expires);
  }

  public setRefreshToken(token: string | null, expires?: Date | number): void {
    if (token === null) removeCookie(REFRESH_TOKEN_COOKIE);
    else setCookie(REFRESH_TOKEN_COOKIE, token, expires);
  }

  public getAccessToken(): string | undefined {
    return getCookie(ACCESS_TOKEN_COOKIE);
  }

  public getRefreshToken(): string | undefined {
    return getCookie(REFRESH_TOKEN_COOKIE);
  }

  public clearTokens(): void {
    removeCookie(ACCESS_TOKEN_COOKIE);
    removeCookie(REFRESH_TOKEN_COOKIE);
  }

  public setOnLogout(handler: (() => void) | null): void {
    this.onLogout = handler;
  }

  public get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<HttpResponseSuccess<T>> {
    return this.unwrap(this.http.get<HttpResponseSuccess<T>>(url, config));
  }

  public post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<HttpResponseSuccess<T>> {
    return this.unwrap(this.http.post<HttpResponseSuccess<T>>(url, data, config));
  }

  public put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<HttpResponseSuccess<T>> {
    return this.unwrap(this.http.put<HttpResponseSuccess<T>>(url, data, config));
  }

  public patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<HttpResponseSuccess<T>> {
    return this.unwrap(this.http.patch<HttpResponseSuccess<T>>(url, data, config));
  }

  public delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<HttpResponseSuccess<T>> {
    return this.unwrap(this.http.delete<HttpResponseSuccess<T>>(url, config));
  }

  private async unwrap<T>(
    promise: Promise<AxiosResponse<HttpResponseSuccess<T>>>,
  ): Promise<HttpResponseSuccess<T>> {
    try {
      const res = await promise;
      return res.data;
    } catch (error) {
      throw toHttpError(error);
    }
  }

  private attachRequestDefaults(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    if (isMockDevEnabled()) {
      if (config.mockFail) {
        config.headers.set('x-mock-fail', '1');
      }
      if (config.mockParams) {
        config.params = { ...config.params, ...config.mockParams };
      }
    }

    if (!config.skipAuth) {
      const token = getCookie(ACCESS_TOKEN_COOKIE);
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return config;
  }

  private processQueue(error: unknown, token: string | null = null): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (token) resolve(token);
      else reject(error);
    });
    this.failedQueue = [];
  }

  private forceLogout(error: unknown): Promise<never> {
    this.clearTokens();
    this.onLogout?.();
    return Promise.reject(toHttpError(error));
  }

  private async handleResponseError(error: AxiosError<HttpResponseFailed>): Promise<unknown> {
    const originalRequest = error.config as InternalAxiosRequestConfig | undefined;

    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.skipRefresh
    ) {
      return Promise.reject(toHttpError(error));
    }

    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.set('Authorization', `Bearer ${token}`);
            originalRequest._retry = true;
            resolve(this.http(originalRequest));
          },
          reject,
        });
      });
    }

    const refreshToken = getCookie(REFRESH_TOKEN_COOKIE);
    if (!refreshToken) {
      return this.forceLogout(error);
    }

    originalRequest._retry = true;
    this.isRefreshing = true;

    try {
      const res = await this.http.post<HttpResponseSuccess<TokenPair>>(
        `${env.SERVER_PREFIX}/v1/auth/refresh`,
        { refreshToken },
        { skipAuth: true, skipRefresh: true },
      );

      const data = res.data.data;
      this.setAccessToken(data.accessToken, new Date(data.accessTokenExpirationAt));
      this.setRefreshToken(data.refreshToken, new Date(data.refreshTokenExpirationAt));
      this.processQueue(null, data.accessToken);

      originalRequest.headers.set('Authorization', `Bearer ${data.accessToken}`);
      return this.http(originalRequest);
    } catch (refreshError) {
      this.processQueue(refreshError, null);
      return this.forceLogout(refreshError);
    } finally {
      this.isRefreshing = false;
    }
  }
}
