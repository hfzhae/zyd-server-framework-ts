/**
 * @copyright Powered by zydsoft®. All rights reserved.
 * @since 2023-10-7
 * @author ZhangZheng
 */
import { ZsfConstructorOptions, ZsfInterface } from "./interface"
import Init from "./init"
import Loader from "./loader"
import { Service, Model, Config, DataBase, Plugin, Middleware, Schedule, Controller, Head, Opitons, Get, Put, Patch, Post, Delete, GeneralClass } from "./loader"
import Koa from "koa2"
import koaBodyparser from "koa-bodyparser"
import { resolve } from "path"
export default class Zsf implements ZsfInterface {
  private koa: Koa
  private dir: string
  constructor(options?: ZsfConstructorOptions) {
    this.dir = process.cwd()
    new Init(this.dir)
    this.koa = new Koa()
    this.koa.use(koaBodyparser())
    /**
     * @description
     * 前置初始化函数调用点
     */
    if (options && options.beforeInit) options.beforeInit(this.koa)
    /**
     * loader对象处理当前目录文件的装饰器
     */
    const loader = new Loader({
      folder: resolve(this.dir, "."),
      rootFolder: resolve(this.dir, "."),
      options: { ...options, app: this }
    })
    /**
     * loader后，载入所有中间件
     */
    loader.middlewares.forEach(mid => {
      this.koa.use(mid)
    })
    /**
     * loader后，载入router
     */
    this.koa.use(loader.router.routes())
    /**
     * @description
     * 后置初始化数据调用点（异步）
     */
    process.nextTick(() => {
      process.nextTick(() => {
        process.nextTick(() => {
          if (options && options.afterInit) options.afterInit(this.koa)
        })
      })
    })
  }
  public start(port: number = 3000, callBack: Function = () => {
    console.log(`\n\x1B[33m\x1B[1mstart on port: ${port}\x1B[0m`)
  }): void {
    this.koa.listen(port, () => {
      callBack && callBack()
      console.log(`\x1B[32m
┌───────────────┐
│ start success │
└───────────────┘
\x1B[0m`)
    })
  }
}
export {
  Service, Model, Config, DataBase, Plugin, Middleware, Schedule, Controller, Head, Opitons, Get, Put, Patch, Post, Delete, GeneralClass
}