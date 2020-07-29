import { ServiceConfiguration } from './types'
import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from 'axios'

const SUPPORT_METHODS = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options', 'link', 'unlink']

export const noop = () => null

/**
 * support
 * api/xx
 * api/xx mem
 * post api/xxx
 * post api/xx mem
 */
export const parseURL = (withUrl: string): ServiceConfiguration => {
  let [method, url, mem] = withUrl.split(' ')
  if (mem) {
    return { method, url, mem: true } as ServiceConfiguration
  }
  if (SUPPORT_METHODS.includes(method.toLowerCase())) {
    return { method, url, mem: false } as ServiceConfiguration
  }
  // eslint-disable-next-line @typescript-eslint/no-extra-semi
  ;[method, url, mem] = ['get', method, url]
  return { method, url, mem: !!mem } as ServiceConfiguration
}

export const isString = (type: unknown): type is string => typeof type === 'string'

export const isEmpty = (type: unknown) => typeof type === 'object' && !!Reflect.ownKeys(type).length

export function mockResponse<T>(input: AxiosRequestConfig, data?: T, output?: AxiosResponse): AxiosPromise<T> {
  return Promise.resolve({
    status: 200,
    statusText: 'ok',
    request: input,
    config: input,
    headers: {},
    data,
    ...output,
  })
}
