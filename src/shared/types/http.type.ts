export type HttpResponseError = {
  message: string;
  details: any;
  code: string;
  [key: string]: any;
};

export type HttpResponseSuccess<T = unknown> = {
  data: T;
  targetUrl: string | null;
  success: true;
  error: null;
  unauthorizedRequest: boolean;
  __wrapped: true;
  __traceId: string | null;
};

export type HttpResponseFailed<T = HttpResponseError> = {
  data: null;
  targetUrl: string | null;
  success: false;
  error: T;
  unauthorizedRequest: boolean;
  __wrapped: true;
  __traceId: string | null;
};

export type HttpResponse<T = unknown, E = HttpResponseError> =
  HttpResponseSuccess<T> | HttpResponseFailed<E>;
