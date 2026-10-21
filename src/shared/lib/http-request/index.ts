import { HttpRequest } from './request';
import type { IHttpRequest } from './request.type';

export const request: IHttpRequest = HttpRequest.getInstance();
