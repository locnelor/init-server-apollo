import { Body, Controller, ForbiddenException, Get, Header, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthPowerGuard } from 'src/auth/auth.guard';
import { QuestionService } from './question.service';
import { PrismaService } from '@app/prisma';
import { FileInterceptor } from '@nestjs/platform-express';
import { HashService } from '@app/hash';
import { FileService } from '@app/file';
import { Response } from 'express';
import { createReadStream } from "fs"
@Controller('question')
@UseGuards(new AuthPowerGuard("题库管理", "question"))
export class QuestionController {
  constructor(
    private readonly service: QuestionService,
    private readonly prisma: PrismaService,
    private readonly hash: HashService,
    private readonly file: FileService
  ) { }
  @Get(":id/image")
  @Header('Content-Type', 'image/png')
  async getImage(@Param("id") photo_id: string, @Res() res: Response) {
    const id = parseInt(photo_id)
    const photo = await this.prisma.sys_photo.findUnique({ where: { id } })
    const path = this.file.getPicturePath(photo.hash_key)
    const stream = createReadStream(path)
    stream.pipe(res)
  }

  @Post("uploadTopVideo")
  @UseInterceptors(FileInterceptor("file"))
  async uploadTopVideo(
    @UploadedFile("file") file: Express.Multer.File,
  ) {
    const { buffer } = file.buffer;
    const hash_key = await this.hash.sha256(buffer)
    if (!!await this.prisma.sys_video.findUnique({ where: { hash_key } })) {
      throw new ForbiddenException("该视频已存在")
    }
    this.service.saveVideo(buffer, hash_key);
    const video = await this.prisma.sys_video.create({
      data: {
        hash_key,
        size: file.size
      }
    })
    return await this.prisma.sys_question.create({
      data: {
        top_id: video.id,
      }
    })
  }

  @Post(":id/uploadAssVideo")
  @UseInterceptors(FileInterceptor("file"))
  async uploadVideo(
    @UploadedFile("file") file: Express.Multer.File,
    @Param("id") id: string,
  ) {
    const questionId = parseInt(id);
    const { buffer } = file.buffer;
    const hash_key = await this.hash.sha256(buffer)
    if (!!await this.prisma.sys_video.findUnique({ where: { hash_key } })) {
      throw new ForbiddenException("该视频已存在")
    }
    const question = await this.prisma.sys_question.findUnique({
      where: {
        id: questionId
      }
    })
    if (!question) throw new ForbiddenException("该题目不存在")
    if (!!question.ass_id) throw new ForbiddenException("该题目已存在视频")
    this.service.saveVideo(buffer, hash_key)
    const video = await this.prisma.sys_video.create({
      data: {
        hash_key,
        size: file.size
      }
    })
    await this.prisma.sys_question.update({
      where: {
        id: questionId
      },
      data: {
        ass_id: video.id
      }
    })
  }

  @Post("uploadImage")
  @UseInterceptors(FileInterceptor("file"))
  async uploadImage(
    @UploadedFile("file") file: Express.Multer.File
  ) {
    const { buffer } = file.buffer;
    const hash_key = await this.hash.sha256(buffer)
    const img = await this.prisma.sys_photo.findUnique({
      where: {
        hash_key
      }
    })
    if (!!img) {
      return img
    }
    this.service.saveImage(buffer, hash_key)
    const photo = await this.prisma.sys_photo.create({
      data: {
        hash_key
      }
    })
    return photo
  }
}
