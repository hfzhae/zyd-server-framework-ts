import { version } from "./package.json"
import fs from "fs"
import Examples from "./examples"
export default class Init extends Examples {
  constructor(dir: string) {
    super()
    console.log(`\x1B[33m
┌─────────────────────────┐
│ Powered by zydsoft®     │
│ zyd-server-framework-ts │
└─────────────────────────┘
\x1B[0m\x1B[37mversion：\x1B[0m\x1B[31m${version}\x1B[0m
`)
    if (!fs.existsSync(dir + "/examples")) {
      this.createExamplesFile(dir)
    }
  }
}