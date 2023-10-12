import Router from 'koa-router'
export interface ZsfInterface {
  start(port?: number, callBack?: Function): void
}
export interface ZsfConstructorOptions {
  beforeInit?: Function
  afterInit?: Function
  app?: any
  baseUrl?: string
}
export interface LoaderConstructorOptions {
  folder: string
  rootFolder: string
  options: ZsfConstructorOptions
  ignoreDir?: Array<string>
  ignoreFile?: Array<string>
  app?: any
}
export interface ControllerOptions {
  middlewares: Array<Router>
}