import { FileService } from '@app/file';
import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');

// Tell fluent-ffmpeg where it can find FFmpeg
ffmpeg.setFfmpegPath(ffmpegStatic);
@Injectable()
export class QuestionService {
  constructor(
    private readonly file: FileService,
    private readonly prisma: PrismaService
  ) { }
  public saveVideo(video: ArrayBufferLike, hash_key: string) {
    const filePath = this.file.getVideoDir(hash_key)
    if (!existsSync(filePath)) mkdirSync(filePath, { recursive: true });
    const source = this.file.getVideoSourceFile(hash_key)
    writeFileSync(source, Buffer.from(video))
    const output = this.file.getVideoOutputFile(hash_key)
    ffmpeg(source)
      .videoCodec('libx264') // 设置视频编解码器
      // .audioCodec('libfaac') // 设置 音频解码器
      .format('hls') // 输出视频格式
      .outputOptions('-hls_list_size 0') //  -hls_list_size n:设置播放列表保存的最多条目，设置为0会保存有所片信息，默认值为5
      .outputOption('-hls_time 5') // -hls_time n: 设置每片的长度，默认值为2。单位为秒
      .output(output) // 输出文件
      .on('progress', (progress) => { // 监听切片进度
        console.log(progress)
        console.log('Processing: ' + progress.percent + '% done');
      })
      .on('end', async () => { // 监听结束
        await this.prisma.sys_video.update({
          where: {
            hash_key
          },
          data: {
            status: $Enums.VideoStatus.FINISH
          }
        })
      })
      .on('error', async (err) => { // 监听错误
        await this.prisma.sys_video.update({
          where: {
            hash_key
          },
          data: {
            status: $Enums.VideoStatus.ERROR
          }
        })
      })
      .run(); // 执行
  }
  saveImage(buffer: ArrayBufferLike, hash_key: string) {
    if (!existsSync(this.file.pictureRoot)) mkdirSync(this.file.pictureRoot, { recursive: true });
    const filePath = this.file.getPicturePath(hash_key)
    writeFileSync(filePath, Buffer.from(buffer))
  }
}
