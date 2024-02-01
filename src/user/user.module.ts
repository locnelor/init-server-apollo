import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';

@Module({
  imports: [PrismaModule,RedisCacheModule],
  providers: [UserResolver, UserService],
  exports: [UserService]
})
export class UserModule { }
