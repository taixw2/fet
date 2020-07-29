import { RequestData, Server, ServiceConfiguration, TApi } from './types';
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';
export declare function fetch(url: string, data: RequestData, config?: ServiceConfiguration): Promise<unknown>;
export declare function apiFactory<T>(apis: TApi<T>): (Target: {
    new (): Server;
}) => { [k in keyof T]: (data: RequestData) => Promise<unknown>; };
export declare function mockResponse<T>(input: AxiosRequestConfig, data?: T, output?: AxiosResponse): AxiosPromise;
