import * as coreHttp from 'http'
import * as coreHttps from 'https'

interface Scheme<Options, Callback, Request> {
  request(options: Options, callback: Callback): Request
}

type WrappedScheme<T extends Scheme<any, any, any>> = T & {
  request(
    options: RequestOptions<T> & {
      maxRedirects?: number
      maxBodyLength?: number
    },
    callback: T extends Scheme<any, infer Callback, any> ? Callback : never
  ): T extends Scheme<any, any, infer Response> ? Response : never
}

type RequestOptions<T extends Scheme<any, any, any>> =
  T extends Scheme<infer Options, any, any> ? Options : never

export const http: WrappedScheme<typeof coreHttp>
export const https: WrappedScheme<typeof coreHttps>

export function wrap<T extends {[key: string]: Scheme<any, any, any>}>(protocols: T): {
  [K in keyof T]: WrappedScheme<T[K]>
}
