import { ServiceConfiguration, RequestData, Server, AxiosRequestConfigExt } from './types'
import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { parse, compile } from 'path-to-regexp'
import { isString, isEmpty } from './util'
import { stringify } from 'qs'

function recombinConfig(config: ServiceConfiguration, data: RequestData): AxiosRequestConfig {
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData
  const requestInput: AxiosRequestConfigExt = {
    url: '',
    method: config.method || 'get',
    headers: {},
    abort: false,
  }
  if (!isFormData) {
    requestInput.headers['content-type'] = 'application/json'
  }
  Object.assign(requestInput, config.addition)

  //
  const copyData = { ...data }
  let input = config.url
  const urlMatch = input.match(/[a-zA-z]+:\/\/[^/]*/)

  let domain = ''
  if (urlMatch) {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;[domain] = urlMatch
    input = input.slice(domain.length)
  }

  // compile params
  const match = parse(input)
  // eslint-disable-next-line no-cond-assign
  if (match) {
    input = compile(input)(copyData)
    // delete match params
    Array.from(match).forEach((item) => !isString(item) && Reflect.deleteProperty(copyData, item.name))
  }

  let url: string = domain + input

  // compile querystring
  if (requestInput.method.toLowerCase() === 'get' && isEmpty(copyData)) {
    url += url.indexOf('?') === -1 ? '?' : '&'
    url += stringify(copyData)
    Reflect.ownKeys(copyData).forEach((key) => Reflect.deleteProperty(copyData, key))
  }

  requestInput.url = url
  requestInput.data = isFormData ? data : copyData
  return requestInput
}

export default async function request(config: ServiceConfiguration, data: RequestData, server: Server) {
  let requestInput: AxiosRequestConfigExt = recombinConfig(config, data)
  {
    const input = server?.onRequest?.(requestInput)
    if (input) {
      requestInput = input
    }
  }
  {
    const input = config.onRequest?.(requestInput)
    if (input) {
      requestInput = input
    }
  }

  if (requestInput.abort) {
    return
  }

  let response: AxiosResponse

  if (config.useMock && typeof config.mock === 'function') {
    if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'production') {
      response = await Axios(requestInput)
    } else {
      response = await config.mock(requestInput)
    }
  } else {
    response = await Axios(requestInput)
  }

  const rep = (await server.onResponse?.(response)) ?? response
  return config.onResponse?.(rep) ?? rep
}
