# zyd-server-framework-ts

## install

```bash
bun init -y
```
>tsconfig.json
```json
{
  "compilerOptions": {
    ...
    "experimentalDecorators": true,
    ...
  }
}
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
```bash
2023-10-13 08:42:23 [middleware] Middlewares.error
2023-10-13 08:42:23 [schedule] Index.handler
2023-10-13 08:42:23 [plugin] Utils
2023-10-13 08:42:23 [dataBase] Mongo
2023-10-13 08:42:23 [controller] User
2023-10-13 08:42:23 [service] User
2023-10-13 08:42:23 [router] GET /User/getUser
2023-10-13 08:42:23 [router] PUT /User/updateUser
2023-10-13 08:42:23 [model] Users

start on port: 3000
```
```
http://127.0.0.1:3000/user/getuser
```
```json
{
  "name": "UserName"
}
```
This project was created using `bun init` in bun v1.x. [Bun](https://bun.sh)
is a fast all-in-one JavaScript runtime.
