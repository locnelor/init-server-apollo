import { PrismaService } from '@app/prisma';
import { SysUserPagination } from '@app/prisma/pagination/sys.user.pagination/sys.user.pagination';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class TestResolver {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  @Query(() => SysUserPagination)
  async testGetUserList(
    @Args("skip", { type: () => Int, defaultValue: 0 }) skip: number,
    @Args("take", { type: () => Int, defaultValue: 15 }) take: number
  ) {
    const total = await this.prisma.sys_user.count();
    const data = await this.prisma.sys_user.findMany({
      skip,
      take
    });
    return {
      skip,
      take,
      total,
      data
    }
  }
}
