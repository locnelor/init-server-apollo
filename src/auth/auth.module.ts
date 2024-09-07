import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from '@app/prisma';
import { HashModule } from '@app/hash';
import { SysConfigModule } from '@app/sys-config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    HashModule,
    ConfigModule,
    SysConfigModule,
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
    UserModule
  ],
  providers: [JwtStrategy, AuthService, AuthResolver],
  exports: [JwtStrategy, AuthService]
})
export class AuthModule { }
