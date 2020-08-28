import { ServiceConfiguration } from './types';
import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from 'axios';
export declare const noop: () => any;
export declare const parseURL: (withUrl: string) => ServiceConfiguration;
export declare const isString: (type: unknown) => type is string;
export declare const isEmpty: (type: unknown) => boolean;
export declare function mockResponse<T>(input: AxiosRequestConfig, data?: T, output?: AxiosResponse): AxiosPromise<T>;
