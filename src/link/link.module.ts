import { Module } from '@nestjs/common';
import { LinkResolver } from './link.resolver';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [PrismaModule],
  providers: [LinkResolver]
})
export class LinkModule { }
