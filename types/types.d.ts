import { AxiosRequestConfig, AxiosResponse, Method, AxiosPromise } from 'axios';
export interface AxiosRequestConfigExt extends AxiosRequestConfig {
    abort?: boolean;
}
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
    onResponse?<T>(data: unknown): Promise<T>;
    onRequest?(input: AxiosRequestConfigExt): void | AxiosRequestConfigExt;
    mock?(input: AxiosRequestConfigExt): AxiosPromise;
}
export interface Server {
    onRequest?(input: AxiosRequestConfigExt): void | AxiosRequestConfigExt;
    onResponse?<T>(res: AxiosResponse): T;
}
export declare type TApi<T> = {
    [key in keyof T]: string | ServiceConfiguration;
};
export interface CreateApiProp<T> extends Server {
    modules: TApi<T>;
}
export declare type CreateApiResponse<T> = {
    [k in keyof T]: <Y = unknown>(data: RequestData) => Promise<Y>;
};
