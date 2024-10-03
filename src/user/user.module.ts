import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { PrismaModule } from '@app/prisma';
import { HashModule } from '@app/hash';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    HashModule,
    ConfigModule
  ],
  providers: [UserResolver]
})
export class UserModule { }
