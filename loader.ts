import { LoaderConstructorOptions } from './interface'
import Router from 'koa-router'
import fs from 'fs'
import path from 'path'
export default class Loader {
  public router: Router
  public middlewares: Array<Router>
  private opt: LoaderConstructorOptions
  constructor(options: LoaderConstructorOptions) {
    this.router = new Router()
    this.middlewares = new Array<Router>()
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
    this.opt = options
    fs.readdirSync(options.folder).forEach(filename => {
      const dirFilePath = path.resolve(options.folder, filename)
      if (fs.statSync(path.join(options.folder, filename)).isDirectory()) {
        if (options.ignoreDir && options.ignoreDir.filter(item => path.resolve(options.rootFolder, item) === dirFilePath).length > 0) return
        this.Injectable({ folder: `${options.folder}/${filename}`, rootFolder: options.rootFolder, options: options.options })
      } else {
        if (filename.split(".").pop() === "js") {
          if (options.ignoreFile && options.ignoreFile.filter(item => path.resolve(options.rootFolder, item) === dirFilePath).length > 0) return
          require("./" + path.relative(__dirname, options.folder) + "/" + filename)
        }
      }
    })
  }
}