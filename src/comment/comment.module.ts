import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CommentController]
})
export class CommentModule { }
