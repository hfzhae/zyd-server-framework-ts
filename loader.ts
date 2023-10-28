import { LoaderConstructorOptions, ControllerOptions, ZsfConstructorOptions } from './interface'
import fs from 'fs'
import path from 'path'
import Router from 'koa-router'
import schedule from "node-schedule"
const router = new Router()
const middlewares: Array<Router> = []
export class GeneralClass {
  service: any
  model: any
  config: any
  plugin: any
}
let opt: ZsfConstructorOptions
/**
 * 日期格式化方法
 * @param {*} fmt 
 * @returns 
 * @example new Date().format("yyyy-MM-dd")
 */
Date.prototype.format = function (fmt = "yyyy-MM-dd hh:mm:ss"): string {
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  }
  // 先替换年份
  if (/(y+)/.test(fmt)) fmt = fmt?.replace(RegExp.$1, (this.getFullYear() + "").substring(4 - RegExp.$1.length))
  // 再依次替换其他时间日期内容
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt?.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substring(("" + o[k]).length)))
  return fmt
}
/**
 * 注入app
 * @param target 
 */
const injectApp = (target: any) => {
  Object.keys(opt.app).forEach((key: any) => {
    if (target.prototype) {
      target.prototype[key] = opt.app[key]
    } else {
      target[key] = opt.app[key]
    }
  })
}
/**
 * 注入类
 * @param moduleName 
 * @returns {Function} 
 */
const injectClass = (moduleName) => () => classDecorate(moduleName)
/**
 * 类装饰器工厂
 * @param moduleName 
 * @returns {Function}
 */
const classDecorate = (moduleName: string) => (target: any) => {
  injectApp(target)
  if (!opt.app[moduleName]) {
    opt.app[moduleName] = []
  }
  opt.app[moduleName][target.name] = new target()
  console.log(`\x1B[30m${new Date().format("yyyy-MM-dd hh:mm:ss")}\x1B[0m \x1B[33m[${moduleName}]\x1B[0m \x1B[32m${target.name}\x1B[0m`)
  process.nextTick(() => {
    process.nextTick(() => {
      injectApp(target)
    })
  })
}
/**
 * 方法装饰器柯里化方法
 * @param method 请求方法
 * @returns {Function}
 */
const injectFunction = (method: string) => (url?: string, options?: any) => functionDecorate(method, url, router, options)
/**
 * 方法装饰器工厂
 * @param param0 
 * @returns 
 */
const functionDecorate = (method: string, url: string = "", router: Router, options: any = {}) => (target: any, property: string, descriptor) => {
  process.nextTick(() => {
    const mids: Array<Router> = []
    target.middlewares && mids.push(...target.middlewares)
    options.middlewares && options.middlewares.forEach(async (mid: any, index: number) => {// 是否配置了中间件
      if (mid.prototype) {
        mid.prototype[mid.name] = mid
      } else {
        mid[mid.name] = mid
      }
      mids.push(async (ctx, next) => await mid[mid.name](ctx, next))
      console.log(`\x1B[30m${new Date().format("yyyy-MM-dd hh:mm:ss")}\x1B[0m \x1B[33m[function.middleware]\x1B[0m \x1B[0m\x1B[32m${target.constructor.name}.${property}.${mid.name || index}\x1B[0m`)
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
    console.log(`\x1B[30m${new Date().format("yyyy-MM-dd hh:mm:ss")}\x1B[0m \x1B[33m[router]\x1B[0m \x1B[32m${method.toLocaleUpperCase()} ${url}\x1B[0m`)
  })
}

/**
 * Controller装饰器工厂
 * @param prefix 路由后缀
 * @param {ControllerOptions} options 选项
 * @returns {Function}
 */
export const Controller = (prefix?: string, options?: ControllerOptions) => (target: any) => {
  injectApp(target)
  new target()
  prefix && (target.prototype.prefix = prefix)
  console.log(`\x1B[30m${new Date().format("yyyy-MM-dd hh:mm:ss")}\x1B[0m \x1B[33m[controller]\x1B[0m \x1B[0m\x1B[32m${target.name}\x1B[0m`)
  if (options?.middlewares) { // 是否配置了中间件
    if (!target.prototype.middlewares) {
      target.prototype.middlewares = []
    }
    options.middlewares && options.middlewares.forEach((mid, index) => { // 处理中间件
      if (mid.prototype) {
        mid.prototype[mid.name] = mid
      } else {
        mid[mid.name] = mid
      }
      target.prototype.middlewares.push(async (ctx, next) => await mid[mid.name](ctx, next))
      console.log(`\x1B[30m${new Date().format("yyyy-MM-dd hh:mm:ss")}\x1B[0m \x1B[33m[controller.middleware]\x1B[0m \x1B[0m\x1B[32m${target.name}.${mid.name || index}\x1B[0m`)
      process.nextTick(() => {
        process.nextTick(() => {
          injectApp(mid)
        })
      })
    })
  }
  process.nextTick(() => {
    process.nextTick(() => {
      injectApp(target)
    })
  })
}
/**
 * 类装饰器函数
 * @returns {Function}
 */
export const Service: Function = injectClass("service") // 服务
export const Model: Function = () => (target: any) => { // 模型，为了确保在dataBase加载后在构建，采用多层异步处理
  injectApp(target)
  if (!opt.app["model"]) {
    opt.app["model"] = []
  }
  process.nextTick(() => {
    process.nextTick(() => {
      process.nextTick(() => {
        // process.nextTick(() => {
        //   process.nextTick(() => {
        //     process.nextTick(() => {
        opt.app["model"][target.name] = new target()
        console.log(`\x1B[30m${new Date().format("yyyy-MM-dd hh:mm:ss")}\x1B[0m \x1B[33m[${"model"}]\x1B[0m \x1B[32m${target.name}\x1B[0m`)
        //     })
        //   })
        // })
      })
    })
  })
  process.nextTick(() => {
    process.nextTick(() => {
      injectApp(target)
    })
  })
}
export const Config: Function = injectClass("config") // 配置
export const DataBase: Function = injectClass("dataBase") // 数据库
export const Plugin: Function = injectClass("plugin") // 插件
export const Middleware: Function = (mids: Array<Router> = []) => (target: any) => {
  injectApp(target)
  const midObj = new target()
  mids.forEach(mid => {
    if (midObj[mid]) {
      middlewares.push(async (ctx, next) => midObj[mid](ctx, next))
      console.log(`\x1B[30m${new Date().format("yyyy-MM-dd hh:mm:ss")}\x1B[0m \x1B[33m[middleware]\x1B[0m \x1B[0m\x1B[32m${target.name}.${mid}\x1B[0m`)
    }
  })
  process.nextTick(() => {
    process.nextTick(() => {
      injectApp(target)
    })
  })
}
/**
 * 定时装饰器
 * @param {String} interval crontab格式
 */
export const Schedule: Function = (interval: string) => (target: any, property: string) => {
  if (interval) {
    schedule.scheduleJob(interval, () => target[property]())
    console.log(`\x1B[30m${new Date().format("yyyy-MM-dd hh:mm:ss")}\x1B[0m \x1B[33m[schedule]\x1B[0m \x1B[0m\x1B[32m${target.constructor.name}.${property}\x1B[0m`)
    process.nextTick(() => {
      process.nextTick(() => {
        injectApp(target.constructor)
      })
    })
  }
}
/**
 * 方法装饰器函数
 * @returns {Function}
 */
export const Head: Function = injectFunction("head")
export const Opitons: Function = injectFunction("options")
export const Get: Function = injectFunction("get")
export const Put: Function = injectFunction("put")
export const Patch: Function = injectFunction("patch")
export const Post: Function = injectFunction("post")
export const Delete: Function = injectFunction("delete")

/**
 * loader类，
 */
export default class Loader {
  public middlewares: Array<Router>
  public router: Router
  constructor(options: LoaderConstructorOptions) {
    this.Injectable(options)
    this.middlewares = middlewares
    this.router = router
  }
  /**
   * 注入方法
   * @param options 
   */
  private Injectable(options: LoaderConstructorOptions): void {
    if (!options.options.ignoreDir) {
      options.options.ignoreDir = ["./node_modules", "./.git"]
    } else {
      options.options.ignoreDir.push("./node_modules")
      options.options.ignoreDir.push("./.git")
    }
    options.options.ignoreDir = [...new Set(options.options.ignoreDir)]
    !options.options.ignoreFile && (options.options.ignoreFile = [])
    options.options.ignoreFile = [...new Set(options.options.ignoreFile)]
    opt = options.options
    fs.readdirSync(options.folder).forEach(filename => {
      const dirFilePath = path.resolve(options.folder, filename)
      if (fs.statSync(path.join(options.folder, filename)).isDirectory()) {
        if (options.options.ignoreDir && options.options.ignoreDir.filter(item => path.resolve(options.rootFolder, item) === dirFilePath).length > 0) return
        this.Injectable({ folder: `${options.folder}/${filename}`, rootFolder: options.rootFolder, options: options.options })
      } else {
        if (filename.split(".").pop() === "ts") {
          if (options.options.ignoreFile && options.options.ignoreFile.filter(item => path.resolve(options.rootFolder, item) === dirFilePath).length > 0) return
          require("./" + path.relative(__dirname, options.folder) + "/" + filename)
        }
      }
    })
  }
}