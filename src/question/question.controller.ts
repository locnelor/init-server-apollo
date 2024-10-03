import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthPowerGuard } from 'src/auth/auth.guard';
import { QuestionService } from './question.service';
import { PrismaService } from '@app/prisma';

@Controller('question')
@UseGuards(new AuthPowerGuard("题库管理", "question"))
export class QuestionController {
  constructor(
    private readonly service: QuestionService,
    private readonly prisma: PrismaService
  ) { }

  @Post("uploadVideo")
  async uploadVideo() {

  }

  @Post("uploadImage")
  async uploadImage() {

  }
}
