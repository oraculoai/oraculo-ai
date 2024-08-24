import { AxiosError, AxiosResponse } from 'axios';
import {
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

// Http Methods

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export type HttpMutationMethod = 'POST' | 'PATCH' | 'PUT' | 'DELETE';

// Error Types

export type HttpError =
  | 'Bad Request'
  | 'Unauthorized'
  | 'Internal Server Error'
  | 'Forbidden'
  | 'Not Found';

// Api Result Types

export type ApiResult<TResultData> = Promise<
  AxiosResponse<TResultData, ApiErrorResult>
>;

export type ApiErrorResult = {
  error: HttpError;
  message: string[];
  statusCode: number;
};

// Endpoint Types

type ApiEndpoints = Record<string, (args?: any) => string>;

type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

type HttpMethodRecord<T> = PartialRecord<Lowercase<HttpMethod>, T>;

/**
 * `ApiEndpointsType` is an `object` with any `string` as `key` and an `object` with any
 * property of the endpoint group that is being used.
 */
export const ApiEndpointsType =
  <T extends ApiEndpoints>() =>
  <D extends Record<string, HttpMethodRecord<T>>>(d: D) =>
    d;
