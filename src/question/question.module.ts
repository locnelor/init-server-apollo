import { Module } from '@nestjs/common';
import { QuestionResolver } from './question.resolver';
import { PrismaModule } from '@app/prisma';
import { HashModule } from '@app/hash';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';

@Module({
  imports: [
    PrismaModule,
    HashModule
  ],
  providers: [QuestionResolver, QuestionService],
  controllers: [QuestionController]
})
export class QuestionModule { }
