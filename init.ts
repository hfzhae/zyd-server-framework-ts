import { version } from "./package.json"
import fs from "fs"
export default class Init {
  constructor(dir: string) {
    console.log(`\x1B[33m
┌─────────────────────────┐
│ Powered by zydsoft®     │
│ zyd-server-framework-ts │
└─────────────────────────┘
\x1B[0m\x1B[37mversion：\x1B[0m\x1B[31m${version}\x1B[0m
`)
    this.createExamplesFile(dir)
  }
  private createExamplesFile(dir: string): void {
    dir += "/examples"
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
    if (!fs.existsSync(dir + "/controller.ts")) { // controller
      fs.writeFileSync(dir + "/controller.ts", `import { Controller, Get, GeneralClass } from "../index"
@Controller()
export class User extends GeneralClass {
  @Get()
  getUser(ctx) {
    return this.service.User.getUser()
  }
}`)
    }
    if (!fs.existsSync(dir + "/service.ts")) { // service
      fs.writeFileSync(dir + "/service.ts", `import { Service } from "../index"
@Service()
export class User {
  getUser() {
    return { name: "UserName" }
  }
}`)
    }
  }
}