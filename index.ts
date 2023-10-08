/**
 * @copyright Powered by zydsoft®. All rights reserved.
 * @since 2023-10-7
 * @author zhangzheng
 */
import { ZsfConstructorOptions, ZsfInterface } from "./interface"
import Init from "./init"
import { Injectable } from "./loader"
import Koa from "koa2"

export default class Zsf implements ZsfInterface {
  koa: Koa
  constructor(options?: ZsfConstructorOptions) {
    new Init(process.cwd())
    this.koa = new Koa()
  }
  start(port: number = 3000, callBack?: Function): void {
    this.koa.listen(port, () => {
      callBack ? callBack() : console.log(`Start on port ${port}`)
      console.log(`\x1B[32m
┌───────────────┐
│ start success │
└───────────────┘
\x1B[0m`)
    })
  }
}