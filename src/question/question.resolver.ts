import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CREATE_POWER, DELETE_POWER, GqlAuthPowerGuard, UPDATE_POWER, VIEW_POWER } from 'src/auth/auth.guard';
import { PrismaService } from '@app/prisma';
import { SysQuestionEntity } from '@app/prisma/sys.question.entity/sys.question.entity';
import { PaginationInput } from '@app/prisma/pagination/pagination.input/pagination.input';
import { SysQuestionPagination } from '@app/prisma/pagination/sys.question.pagination/sys.question.pagination';
import { SysVideoEntity } from '@app/prisma/sys.video.entity/sys.video.entity';
import { SysQuestionOnPhotoEntity } from '@app/prisma/sys.question.on.photo.entity/sys.question.on.photo.entity';
import { SysAnswerEntity } from '@app/prisma/sys.answer.entity/sys.answer.entity';

@Resolver()
@UseGuards(new GqlAuthPowerGuard("题库管理", "question"))
export class QuestionResolver {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  @Mutation(() => SysQuestionOnPhotoEntity)
  @UseGuards(new GqlAuthPowerGuard("添加图片", "question/image/add", [CREATE_POWER]))
  imageConnect(
    @Args("id", { type: () => Int }) id: number,
    @Args("image", { type: () => Int }) image: number
  ) {
    return this.prisma.sys_question_on_photo.create({
      data: {
        sys_questionId: id,
        sys_photoId: image
      }
    })
  }

  @Mutation(() => SysQuestionOnPhotoEntity)
  @UseGuards(new GqlAuthPowerGuard("删除图片", "question/image/delete", [DELETE_POWER]))
  imageDisconnect(
    @Args("id", { type: () => Int }) id: number,
    @Args("image", { type: () => Int }) image: number
  ) {
    return this.prisma.sys_question_on_photo.delete({
      where: {
        sys_photoId_sys_questionId: {
          sys_photoId: image,
          sys_questionId: id
        }
      }
    })
  }


  @Query(() => SysVideoEntity, { nullable: true })
  @UseGuards(new GqlAuthPowerGuard("查询题库", "question/view", []))
  async questionVideo(
    @Args("id", { type: () => Int }) id: number,
  ) {
    return await this.prisma.sys_video.findUnique({
      where: {
        id,
      },
    })
  }

  @Mutation(() => Boolean)
  @UseGuards(new GqlAuthPowerGuard("查询题库", "question/view", []))
  async questionVideoExists(
    @Args("hash_key") hash_key: string,
  ) {
    return !!await this.prisma.sys_video.count({
      where: {
        hash_key
      }
    })
  }


  @Query(() => SysQuestionEntity, { nullable: true })
  @UseGuards(new GqlAuthPowerGuard("查询题库", "question/view", []))
  async question(
    @Args("id", { type: () => Int, nullable: true }) id?: number
  ) {
    if (!id) return null;
    return await this.prisma.sys_question.findUnique({
      where: { id },
      include: {
        answers: true,
        sys_question_on_photo: true
      }
    })
  }

  @Query(() => SysQuestionPagination)
  @UseGuards(new GqlAuthPowerGuard("查询题库", "question/view", []))
  async questionList(
    @Args("pagination") { page, size, order }: PaginationInput
  ) {
    const total = await this.prisma.sys_question.count();
    const data = await this.prisma.sys_question.findMany({
      skip: (page - 1) * size,
      take: size,
      orderBy: {
        id: order
      }
    })
    return {
      page,
      size,
      total,
      data
    }
  }

  @Mutation(() => SysQuestionEntity)
  @UseGuards(new GqlAuthPowerGuard("新增题库", "question/add", [CREATE_POWER]))
  async createQuestion(
    @Args("top_id", { type: () => Int }) top_id: number,
    @Args("ass_id", { type: () => Int, nullable: true }) ass_id: number,
    @Args("answers", { type: () => [Int] }) answers: number[]
  ) {
    return await this.prisma.sys_question.create({
      data: {
        top_id,
        ass_id,
        answers: {
          createMany: {
            data: answers.map((sys_photoId) => ({ sys_photoId }))
          }
        }
      }
    })
  }

  @Mutation(() => SysQuestionEntity)
  @UseGuards(new GqlAuthPowerGuard("删除题库", "question/del", [DELETE_POWER]))
  async deleteQuestion(
    @Args("id", { type: () => Int }) id: number
  ) {
    return await this.prisma.sys_question.delete({
      where: { id }
    })
  }

  @Mutation(() => SysQuestionEntity)
  @UseGuards(new GqlAuthPowerGuard("修改题库", "question/edit", [UPDATE_POWER]))
  async updateQuestion(
    @Args("id", { type: () => Int }) id: number,
    @Args("top_id", { type: () => Int }) top_id: number,
    @Args("ass_id", { type: () => Int, nullable: true }) ass_id: number,
    @Args("answers", { type: () => [Int] }) answers: number[]
  ) {
    return await this.prisma.sys_question.update({
      where: { id },
      data: {
        top_id,
        ass_id,
        answers: {
          deleteMany: {},
          createMany: {
            data: answers.map((sys_photoId) => ({ sys_photoId }))
          }
        }
      }
    })
  }

  @Mutation(() => SysQuestionEntity)
  @UseGuards(new GqlAuthPowerGuard("设置答案", "question/image/set", [UPDATE_POWER]))
  questionSetAnswer(
    @Args("id", { type: () => Int }) id: number,
    @Args("photos", { type: () => [Int] }) photos: number[]
  ) {
    return this.prisma.sys_question.update({
      where: {
        id
      },
      data: {
        answers: {
          deleteMany: {},
          createMany: {
            data: photos.map((sys_photoId) => {
              return { sys_photoId }
            })
          }
        }
      }
    })
  }

  @Mutation(() => SysAnswerEntity)
  @UseGuards(new GqlAuthPowerGuard("设置关联", "question/image/set", [UPDATE_POWER]))
  questionSetAnswerField(
    @Args("id", { type: () => Int }) id: number,
    @Args("total", { type: () => Int }) total: number
  ) {
    return this.prisma.sys_answer.update({
      where: {
        id
      },
      data: {
        total
      }
    })
  }
}