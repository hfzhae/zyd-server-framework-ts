import { version } from "./package.json"
export default class Init {
  constructor(dir: string) {
    console.log(`\x1B[33m
┌─────────────────────────┐
│ Powered by zydsoft®     │
│ zyd-server-framework-ts │
└─────────────────────────┘
\x1B[0m\x1B[37mversion：\x1B[0m\x1B[31m${version}\x1B[0m
`)
    this.createExamplesConfigFile(dir)
  }
  createExamplesConfigFile(dir: string): void { }
}