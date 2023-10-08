export interface ZsfInterface {
  start(port?: number, callBack?: Function): void
}

export interface ZsfConstructorOptions {
  beforeInit?: Function
  afterInit?: Function
}