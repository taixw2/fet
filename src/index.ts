import { ServiceConfiguration, RequestData, Server, TApi, CreateApiProp, CreateApiResponse } from './types'
import request from './request'
import { noop, isString, parseURL } from './util'

function requestConfigMerge(config: ServiceConfiguration, server: Server) {
  return (data: RequestData, innerConfig: ServiceConfiguration) => request({ ...config, ...innerConfig }, data, server)
}

function reduceApis<T>(apis: TApi<T>, server: Server) {
  return Reflect.ownKeys(apis).reduce((servers, methodName) => {
    const config = apis[methodName]
    return (servers[methodName] = requestConfigMerge(isString(config) ? parseURL(config) : config, server)), servers
  }, {})
}

/**
 * base fetch
 *
 * @param url request url
 * @param data  request data
 * @param config server config
 */
export function fetch(url: string, data: RequestData, config?: ServiceConfiguration) {
  return request({ url, ...config }, data, noop as Server)
}

/**
 * create server factory
 * @param config factory config
 */
export function createServer<T>(config: CreateApiProp<T>) {
  return reduceApis(config.modules, {
    onRequest: config.onRequest,
    onResponse: config.onResponse,
  }) as CreateApiResponse<T>
}

export { mockResponse } from './util'
export { AxiosRequestConfig, AxiosResponse, AxiosPromise } from 'axios'
export { ServiceConfiguration, RequestData, CreateApiProp }
