import { Module } from '@nestjs/common';
import { SysConfigService } from './sys-config.service';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from '@app/file';
import { HashModule } from '@app/hash';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [
    ConfigModule,
    FileModule,
    HashModule,
    PrismaModule
  ],
  providers: [SysConfigService],
  exports: [SysConfigService],
})
export class SysConfigModule { }
