import { AxiosRequestConfig, AxiosResponse, Method, AxiosPromise } from 'axios';
export declare type RequestData = {
    [key: string]: unknown;
} | FormData | void;
export interface ServiceConfiguration {
    url?: string;
    method?: Method;
    mem?: boolean;
    useMock?: boolean;
    addition?: {
        [key: string]: string;
    };
    headers?: {
        [key: string]: string;
    };
    onResponse?<T>(data: unknown): T;
    onRequest?(input: AxiosRequestConfig): void | AxiosRequestConfig;
    mock?(input: AxiosRequestConfig): AxiosPromise;
}
export interface Server {
    onRequest?(input: AxiosRequestConfig): void | AxiosRequestConfig;
    onResponse?<T>(res: AxiosResponse): T;
}
export declare type TApi<T> = {
    [key in keyof T]: string | ServiceConfiguration;
};
