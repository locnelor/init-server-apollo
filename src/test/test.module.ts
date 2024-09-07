import { Module } from '@nestjs/common';
import { TestResolver } from './test.resolver';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [PrismaModule],
  providers: [TestResolver]
})
export class TestModule { }
