import fs from "fs"
export default class Examples {
  /**
   * 示例生成方法
   * @param {String} dir 默认路径 
   */
  public createExamplesFile(dir: string): void {
    fs.writeFileSync(dir + "/tsconfig.json", `{
  "compilerOptions": {
    "lib": ["ESNext"],
    "module": "esnext",
    "target": "esnext",
    "moduleResolution": "bundler",
    "moduleDetection": "force",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "composite": true,
    "strict": true,
    "downlevelIteration": true,
    "skipLibCheck": true,
    "jsx": "react-jsx",
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "experimentalDecorators": true,
    "allowJs": true,
    "types": [
      "bun-types" // add Bun global
    ]
  }
}`)
    dir += "/examples"
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
    if (!fs.existsSync(dir + "/controller.ts")) {
      fs.writeFileSync(dir + "/controller.ts", `import { Controller, Get, GeneralClass } from "zyd-server-framework-ts"
import assert from "http-assert"
@Controller("", {
  middlewares: [
    async function validationToken(ctx: any, next: any) { // 此处不能使用尖头函数，否则无法通过this获取全局模块数组
      assert(ctx.header.token, 408, "invalid token")
      ctx.state.token = ctx.header.token
      await next()
    }
  ]
})
class User extends GeneralClass {
  @Get("", {
    middlewares: [
      async function validationName (ctx: any, next: any) { // 此处不能使用尖头函数，否则无法通过this获取全局模块数组
        const name = ctx.request.query.name
        assert(name, 400, "Missing name")
        await next()
      },
    ]
  })
  getUser(ctx: any) {
    return this.service.User.getUser()
  }
}`)
    }
    if (!fs.existsSync(dir + "/service.ts")) {
      fs.writeFileSync(dir + "/service.ts", `import { Service } from "zyd-server-framework-ts"
@Service()
class User {
  getUser() {
    return { name: "UserName" }
  }
}`)
    }
    //     if (!fs.existsSync(dir + "/dataBase.ts")) {
    //       fs.writeFileSync(dir + "/dataBase.ts", `import { DataBase } from "zyd-server-framework-ts"
    // import mongoose from "mongoose"
    // @DataBase()
    // class Mongo {
    //   prod: any
    //   test: any
    //   constructor() {
    //     this.prod = mongoose.createConnection("mongodb://127.0.0.1:27017?replicaSet=rs0", {
    //       // useCreateIndex: true,
    //       // useFindAndModify: false,
    //       useNewUrlParser: true,
    //       useUnifiedTopology: true,
    //       dbName: "prodDb"
    //     })
    //     this.prod.on("connected", () => {
    //       console.log('mongodb connect prod success')
    //     })
    //     this.prod.on("error", () => {
    //       console.log('mongodb connect prod error')
    //     })
    //     this.prod.on("disconnected", () => {
    //       console.log('mongodb connect prod disconnected')
    //     })
    //     this.test = mongoose.createConnection("mongodb://127.0.0.1:27017?replicaSet=rs0", {
    //       // useCreateIndex: true,
    //       // useFindAndModify: false,
    //       useNewUrlParser: true,
    //       useUnifiedTopology: true,
    //       dbName: "testDb"
    //     })
    //     this.test.on("connected", () => {
    //       console.log('mongodb connect test success')
    //     })
    //     this.test.on("error", () => {
    //       console.log('mongodb connect test error')
    //     })
    //     this.test.on("disconnected", () => {
    //       console.log('mongodb connect test disconnected')
    //     })
    //   }
    //   async mongoSession (dataBase) {
    //     const session = await dataBase.startSession({
    //       readPreference: { mode: 'primary' }, //只从主节点读取，默认值。
    //     })
    //     await session.startTransaction({
    //       readConcern: { level: 'majority' }, //读取在大多数节点上提交完成的数据。level:"snapshot"读取最近快照中的数据。
    //       writeConcern: { w: 'majority' }, //大多数节点成功原则，例如一个复制集 3 个节点，2 个节点成功就认为本次写入成功。 w:"all"所以节点都成功，才认为写入成功，效率较低。
    //     })
    //     return session
    //   }
    // }`)
    //     }
    if (!fs.existsSync(dir + "/middleware.ts")) {
      fs.writeFileSync(dir + "/middleware.ts", `import { Middleware } from "zyd-server-framework-ts"
@Middleware([
  "error",
])
class Middlewares {
  async error (ctx: any, next: any) {
    try {
      await next()
    } catch (err: any) {
      console.log(err)
      const code = err.status || 500
      const message = err.response && err.response.data || err.message
      ctx.body = {
        code,
        message
      }
      ctx.status = code // 200
    }
  }
}`)
    }
    //     if (!fs.existsSync(dir + "/model.ts")) {
    //       fs.writeFileSync(dir + "/model.ts", `import mongoose from "mongoose"
    // import { Model } from "zyd-server-framework-ts"
    // @Model()
    // class Users {
    //   prod: any
    //   test: any
    //   constructor() {
    //     const schema = new mongoose.Schema({
    //       name: { type: String },
    //       age: { type: Number }
    //     }, {
    //       versionKey: false,
    //       timestamps: {
    //         createdAt: "createdAt",
    //         updatedAt: "updatedAt"
    //       }
    //     })
    //     this.prod = this.dataBase.Mongo.prod.model("users", schema, "users")
    //     this.test = this.dataBase.Mongo.test.model("users", schema, "users")
    //   }
    // }`)
    //     }
    if (!fs.existsSync(dir + "/plugin.ts")) {
      fs.writeFileSync(dir + "/plugin.ts", `import { Plugin } from "zyd-server-framework-ts"
@Plugin()
class Utils {
  constructor() {
    /**
     * 日期格式化方法
     * @param {*} fmt 
     * @returns 
     * @example new Date().format("yyyy-MM-dd")
     */
    Date.prototype["format"] = function (fmt: string = "yyyy-MM-dd"): string {
      // 将当前
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
  }
  /**
   * 阻塞函数
   * @param {Number} milliSeconds 毫秒数 
   */
  sleep(milliSeconds: number): void {
    const startTime = new Date().getTime()
    while (new Date().getTime() < startTime + milliSeconds) { }
  }
  getClientIp(req: any): string {//获取客户端ip地址
    let ip = req.headers['x-forwarded-for'] ||
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress || '';
    if (ip.split(',').length > 0) {
      ip = ip.split(',')[0];
    }
    if (ip === "::1") ip = "127.0.0.1"
    return ip.match(/\d+\.\d+\.\d+\.\d+/)[0];
  }
}`)
    }
    if (!fs.existsSync(dir + "/schedule.ts")) {
      fs.writeFileSync(dir + "/schedule.ts", `import { Schedule } from "zyd-server-framework-ts"
class Index {
  @Schedule("0 0 1 * * *") //crontab格式
  handler() {
    console.log("这是一个定时任务 " + new Date().toLocaleString())
  }
}`)
    }
  }
}