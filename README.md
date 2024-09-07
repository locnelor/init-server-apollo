# nestjs example

快速搭建 nestjs 项目

## packages

- 配置文件
  - @nestjs/config
  - .env
- 数据验证
  - class-transformer
  - class-validator
- 身份验证
  - @nestjs/jwt
  - passport-jwt
  - @nestjs/passport
- orm
  - prisma
  - @prisma/client
  - mysql
- redis
  - @nestjs-modules/ioredis
  - ioredis
- graphql
  - @nestjs/graphql
  - @nestjs/apollo
  - @apollo/server
  - graphql
- 请求
  - superagent
- 其他
  - body-parser 支持解析 json
  - body-parser-xml 支持解析 xml
  - @nestjs/swagger 生成 swagger 文档

## libs

- file 文件操作
- hash 哈希
- prisma 数据库操作
- redis-cache 缓存
- request 请求
- utils 工具
  - random-name 随机名称

## 快速启动

### 安依赖

```bash
npm i
or
yarn
or
pnpm i
```

### 修改.env.example为.env并修改配置

### 初始化数据库

```bash
npx prisma db push

npx prisma generate
```

### 启动项目

```bash
npm run start:dev
or
yarn start:dev
or
pnpm start:dev
```
