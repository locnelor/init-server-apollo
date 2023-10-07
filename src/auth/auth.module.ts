import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return ({
          secret: "sbppk",
          signOptions: {
            expiresIn: configService.get("EXPIRES_IN")
          }
        })
      },
      inject: [ConfigService]
    }),
    RedisCacheModule,
    UserModule
  ],
  controllers: [
    AuthController
  ],
  providers: [JwtStrategy, AuthService, AuthResolver]
})
export class AuthModule { }
