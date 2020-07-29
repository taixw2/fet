import { RequestData, Server, ServiceConfiguration, TApi } from './types'
import request from './request'
import { noop, isString, parseURL } from './util'
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios'

export function fetch(url: string, data: RequestData, config?: ServiceConfiguration) {
  let _url = url
  if (/^\w+:\/\//.test(url)) {
    _url = url
  } else if (Reflect.has(window, 'LO_BASE_API')) {
    _url = Reflect.get(window, 'LO_BASE_API') + url
  }

  return request({ url: _url, ...config }, data, noop as Server).catch(console.error)
}

function requestWrap(config: ServiceConfiguration, server) {
  return (data: RequestData, _config: ServiceConfiguration) => {
    return request({ ...config, ..._config }, data, server)
  }
}

function eachBuildApi<T>(apis: TApi<T>, server) {
  return Reflect.ownKeys(apis).reduce((p, c) => {
    const currentAPI = apis[c]
    if (isString(currentAPI)) {
      p[c] = requestWrap(parseURL(currentAPI), server)
    } else {
      p[c] = requestWrap(currentAPI, server)
    }
    return p
  }, {}) as { [k in keyof T]: (data: RequestData) => Promise<unknown> }
}

export function apiFactory<T>(apis: TApi<T>) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (Target: { new (): Server }) => {
    const server = new (Target as { new (): Server })()
    return eachBuildApi(apis, server)
  }
}

interface CreateApiProp<T> {
  onRequest(): void
  onResponse(): void
  modules: TApi<T>
}

export function createApi<T>(props: CreateApiProp<T>) {
  const server = { onRequest: props.onRequest, onResponse: props.onResponse }
  return eachBuildApi(props.modules, server)
}

export function mockResponse<T>(input: AxiosRequestConfig, data?: T, output?: AxiosResponse): AxiosPromise {
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
