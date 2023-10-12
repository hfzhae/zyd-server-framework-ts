# zyd-server-framework-ts

## install

```bash
bun init -y
```
```bash
bun add zyd-server-framework-ts
```

## Quickstart

> index.ts

```ts
import zsf from "zyd-server-framework-ts"
const app = new zsf()
app.start()
```
```bash
bun run index.ts
```
```
┌─────────────────────────┐
│ Powered by zydsoft®     │
│ zyd-server-framework-ts │
└─────────────────────────┘
version：0.0.5

2023-10-12 15:04:20 [controller]  User
2023-10-12 15:04:20 [service] User
2023-10-12 15:04:20 [router]  GET /User/getUser

start on port: 3000

┌───────────────┐
│ start success │
└───────────────┘
```
This project was created using `bun init` in bun v1.x. [Bun](https://bun.sh)
is a fast all-in-one JavaScript runtime.
