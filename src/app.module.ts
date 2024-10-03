import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { AppResolver } from './app.resolver';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import * as Joi from 'joi';
import { RedisCacheModule } from '@app/redis-cache';
import { TestModule } from './test/test.module';
import { QuestionModule } from './question/question.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        REDIS_HOST: Joi.string(),
        REDIS_PORT: Joi.number(),
        REDIS_PASSWORD: Joi.string().empty(""),
        PORT: Joi.number(),
        JWT_SECRET: Joi.string(),
        JWT_EXPIRES: Joi.any()
      })
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        console.log(configService.get("server"))
        return {
          driver: ApolloDriver,
          subscriptions: {
            'graphql-ws': {
              onConnect: (context: any) => {
                const {
                  connectionParams,
                  extra
                } = context;
                const { Authorization } = connectionParams;
                extra.Authorization = Authorization;
              },
            }
          },
          autoSchemaFile: join(process.cwd(), 'prisma/schema.gql'),
          definitions: {
            path: join(__dirname, 'types/graphql.ts'),
          },
          playground: true,

          context: ({ req, res, connection = {} as any, extra }) => {
            const raw = (req || connection.context || extra.request)
            if (!!extra?.Authorization && !!raw.headers && !raw.headers.authorization) {
              raw.headers.authorization = extra?.Authorization
            }
            return {
              req: raw,
              res,
              trackErrors(errors) {
                console.log("app.module", errors)
              },
            };
          },
        }
      }
    }),
    RedisCacheModule,
    AuthModule,
    RoleModule,
    UserModule,
    TestModule,
    QuestionModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule { }
