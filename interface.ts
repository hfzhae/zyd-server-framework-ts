import Router from 'koa-router'
export interface ZsfInterface {
  start(port?: number, callBack?: Function): void
}
export interface ZsfConstructorOptions {
  ignoreDir?: Array<string>
  ignoreFile?: Array<string>
  beforeInit?: Function
  afterInit?: Function
  app?: any
  baseUrl?: string
}
export interface LoaderConstructorOptions {
  folder: string
  rootFolder: string
  options: ZsfConstructorOptions
}
export interface ControllerOptions {
  middlewares: Array<Router>
}