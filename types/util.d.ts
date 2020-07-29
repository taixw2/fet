import { ServiceConfiguration } from './types';
export declare const noop: () => any;
export declare const parseURL: (withUrl: string) => ServiceConfiguration;
export declare const isString: (type: unknown) => type is string;
export declare const isEmpty: (type: unknown) => boolean;
