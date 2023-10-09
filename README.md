# 初始化nest-apollo服务端

- ORM: Prisma
- Cache: Redis
- Authentication: JWT
- Graphql
- RestApi

## env配置示例

```
DATABASE_URL = "mysql://root:root1234@localhost:3306/init_apollo"
PORT = 14500
JWT_SECRET = "sbppk"

TITLE = "document"
DESCRIPTION = "documentAPI"
VERSION = "1.0"
REDIS_HOST = "localhost"
REDIS_PORT = 6379
REDIS_PASSWORD = "root1234"
CACHE_TTL = 21600
```
