import { Module } from '@nestjs/common';
import { WechartService } from './wechart.service';
import { WechartController } from './wechart.controller';
import { ConfigModule } from '@nestjs/config';
import { RequestModule } from 'src/request/request.module';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [ConfigModule, RequestModule, AuthModule, PrismaModule],
  providers: [WechartService],
  controllers: [WechartController]
})
export class WechartModule { }
