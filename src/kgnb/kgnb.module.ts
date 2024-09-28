import { Module } from '@nestjs/common';
import { KgnbResolver } from './kgnb.resolver';
import { PrismaModule } from '@app/prisma';

@Module({
  providers: [KgnbResolver],
  imports: [PrismaModule]
})
export class KgnbModule { }
