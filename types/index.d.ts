import { ServiceConfiguration, RequestData, CreateApiProp, CreateApiResponse } from './types';
export declare function fetch(url: string, data: RequestData, config?: ServiceConfiguration): Promise<unknown>;
export declare function createServer<T>(config: CreateApiProp<T>): CreateApiResponse<T>;
export { mockResponse } from './util';
export { AxiosRequestConfig, AxiosResponse, AxiosPromise } from 'axios';
export { ServiceConfiguration, RequestData, CreateApiProp };
