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
import Zsf from "zyd-server-framework-ts"
const app = new Zsf()
app.start()
```
```bash
bun --watch index.ts
```
```bash
2023-10-13 14:37:03 [middleware] Middlewares.error
2023-10-13 14:37:03 [schedule] Index.handler
2023-10-13 14:37:03 [plugin] Utils
2023-10-13 14:37:03 [controller] User
2023-10-13 14:37:03 [controller.middleware] User.validationToken
2023-10-13 14:37:03 [service] User
2023-10-13 14:37:03 [function.middleware] User.getUser.validationName
2023-10-13 14:37:03 [router] GET /partner/api/User/getUser

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
