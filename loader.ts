import { LoaderConstructorOptions, ControllerOptions, ZsfConstructorOptions } from './interface'
import fs from 'fs'
import path from 'path'
import Router from 'koa-router'
export const router = new Router()
export const middlewares = []
export class GeneralClass {
  service: any
}
let opt: ZsfConstructorOptions
/**
 * 日期格式化方法
 * @param {*} fmt 
 * @returns 
 * @example new Date().format("yyyy-MM-dd")
 */
Date.prototype.format = function (fmt = "yyyy-MM-dd hh:mm:ss") {
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  // 先替换年份
  if (/(y+)/.test(fmt)) fmt = fmt?.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  // 再依次替换其他时间日期内容
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt?.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
/**
 * 注入app
 * @param target 
 */
function injectApp(target) {
  Object.keys(opt.app).forEach((key: String) => { 
    target.prototype[key] = opt.app[key] 
  })
}
/**
 * 注入类
 * @param moduleName 
 * @returns {Function} 
 */
function injectClass(moduleName) {
  return classDecorate(moduleName)
}
/**
 * 类装饰器工厂
 * @param moduleName 
 * @returns {Function}
 */
function classDecorate(moduleName: string) { // 类
  return (target: any) => {
    injectApp(target)
    if (!opt.app[moduleName]) {
      opt.app[moduleName] = []
    }
    opt.app[moduleName][target.name] = new target()
    console.log(`\x1B[30m${new Date().format()}\x1B[0m \x1B[33m[${moduleName}]\x1B[0m \x1B[32m${target.name}\x1B[0m`)
    process.nextTick(() => {
      process.nextTick(() => {
        injectApp(target)
      })
    })
  }
}
/**
 * 方法装饰器柯里化方法
 * @param method 请求方法
 * @returns {Function}
 */
function injectFunction(method: string) {
  return function (url?: string, options?: any) {
    return functionDecorate(method, url, router, options)
  }
}
/**
 * 方法装饰器工厂
 * @param param0 
 * @returns 
 */
function functionDecorate(method: string, url: string = "", router: Router, options: any = {}) { // 方法
  return function (target: any, property: string, descriptor) {
    process.nextTick(() => {
      const mids: Array<Router> = []
      target.middlewares && mids.push(...target.middlewares)
      options.middlewares && options.middlewares.forEach((mid: any) => {// 是否配置了中间件
        mid.prototype[mid.name] = mid
        mids.push(async (ctx, next) => await mid.prototype[[mid.name]](ctx, next))
        process.nextTick(() => {
          process.nextTick(() => {
            injectApp(mid)
          })
        })
      })
      mids.push(async (ctx, next) => { ctx.body = await target[property](ctx, next) })
      if (!url) {
        url = `/${target.constructor.name}/${property}` // 路由后缀
      } else if (url === "/") {
        url = `/${target.constructor.name}`
      } else {
        url = `/${target.constructor.name}/${url.split("/").filter(item => item).join("/")}`
      }
      target.prefix && (url = `/${target.prefix}${url}`) // 路由前缀
      url = (opt.baseUrl || "") + url // 添加基础路径
      router[method](url, ...mids)
      target[property].method = method
      target[property].url = url
      console.log(`\x1B[30m${new Date().format()}\x1B[0m \x1B[33m[router]\x1B[0m  \x1B[32m${method.toLocaleUpperCase()} ${url}\x1B[0m`)
    })
  }
}
/**
 * Controller装饰器工厂
 * @param prefix 路由后缀
 * @param {ControllerOptions} options 选项
 * @returns {Function}
 */
export function Controller(prefix?: string, options?: ControllerOptions) {
  return function (target: any) {
    injectApp(target)
    new target()
    prefix && (target.prototype.prefix = prefix)
    console.log(`\x1B[30m${new Date().format()}\x1B[0m \x1B[33m[controller]\x1B[0m  \x1B[0m\x1B[32m${target.name}\x1B[0m`)
    if (options?.middlewares) { // 是否配置了中间件
      if (!target.prototype.middlewares) {
        target.prototype.middlewares = []
      }
      options.middlewares.forEach(mid => {
        mid.prototype[mid.name] = mid
        target.prototype.middlewares.push(async (ctx, next) => await mid.prototype[[mid.name]](ctx, next))
        process.nextTick(() => {
          process.nextTick(() => {
            injectApp(mid)
          })
        })
      })
      console.log(`\x1B[30mmiddlewares: \x1B[0m\x1B[36m${target.name}\x1B[0m`)
    }
    process.nextTick(() => {
      process.nextTick(() => {
        injectApp(target)
      })
    })
  }
}
/**
 * 类装饰器函数
 * @returns {Function}
 */
export function Service() {
  return injectClass("service")
}
/**
 * 方法装饰器函数
 * @returns {Function}
 */
export const Get = injectFunction("get")
/**
 * loader类，
 */
export default class Loader {
  constructor(options: LoaderConstructorOptions) {
    this.Injectable(options)
  }
  /**
   * 注入方法
   * @param options 
   */
  private Injectable(options: LoaderConstructorOptions): void {
    if (!options.ignoreDir) {
      options.ignoreDir = ["./node_modules", "./.git"]
    } else {
      options.ignoreDir.push("./node_modules")
      options.ignoreDir.push("./.git")
    }
    options.ignoreDir = [...new Set(options.ignoreDir)]
    !options.ignoreFile && (options.ignoreFile = [])
    options.ignoreFile = [...new Set(options.ignoreFile)]
    opt = options.options
    fs.readdirSync(options.folder).forEach(filename => {
      const dirFilePath = path.resolve(options.folder, filename)
      if (fs.statSync(path.join(options.folder, filename)).isDirectory()) {
        if (options.ignoreDir && options.ignoreDir.filter(item => path.resolve(options.rootFolder, item) === dirFilePath).length > 0) return
        this.Injectable({ folder: `${options.folder}/${filename}`, rootFolder: options.rootFolder, options: options.options })
      } else {
        if (filename.split(".").pop() === "ts") {
          if (options.ignoreFile && options.ignoreFile.filter(item => path.resolve(options.rootFolder, item) === dirFilePath).length > 0) return
          require("./" + path.relative(__dirname, options.folder) + "/" + filename)
        }
      }
    })
  }
}