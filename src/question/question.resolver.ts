import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthPowerGuard, CREATE_POWER, VIEW_POWER } from 'src/auth/auth.guard';
import { PrismaService } from '@app/prisma';
import { SysQuestionEntity } from '@app/prisma/sys.question.entity/sys.question.entity';
import { PaginationInput } from '@app/prisma/pagination/pagination.input/pagination.input';
import { SysQuestionPagination } from '@app/prisma/pagination/sys.question.pagination/sys.question.pagination';

@Resolver()
@UseGuards(new AuthPowerGuard("题库管理", "question"))
export class QuestionResolver {
  constructor(
    private readonly prisma: PrismaService
  ) { }
  @Query(() => Boolean)
  @UseGuards(new AuthPowerGuard("查询题库", "question/view", [VIEW_POWER]))
  async questionVideoExists(
    @Args("hash_key") hash_key: string,
  ) {
    return !!await this.prisma.sys_video.count({
      where: {
        hash_key
      }
    })
  }

  @Query(() => SysQuestionPagination)
  @UseGuards(new AuthPowerGuard("查询题库", "question/view", []))
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
  @UseGuards(new AuthPowerGuard("新增题库", "question/add", [CREATE_POWER]))
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
  @UseGuards(new AuthPowerGuard("删除题库", "question/del"))
  async deleteQuestion(
    @Args("id", { type: () => Int }) id: number
  ) {
    return await this.prisma.sys_question.delete({
      where: { id }
    })
  }

  @Mutation(() => SysQuestionEntity)
  @UseGuards(new AuthPowerGuard("修改题库", "question/edit"))
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
}