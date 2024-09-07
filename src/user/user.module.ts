import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [
    PrismaModule
  ],
  providers: [UserResolver]
})
export class UserModule { }
