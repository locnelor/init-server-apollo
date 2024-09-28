import { PrismaService } from '@app/prisma';
import { SysKgnbEntity } from '@app/prisma/sys.kgnb.entity/sys.kgnb.entity';
import { SysUserEntity } from '@app/prisma/sys.user.entity/sys.user.entity';
import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CREATE_POWER, DELETE_POWER, GqlAuthPowerGuard, GqlCurrentUser, UPDATE_POWER } from 'src/auth/auth.guard';

@Resolver()
@UseGuards(new GqlAuthPowerGuard("阔哥牛逼", "kgnb"))
export class KgnbResolver {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  @UseGuards(new GqlAuthPowerGuard("添加阔哥牛逼", "kgnb/add", [CREATE_POWER]))
  @Mutation(() => SysKgnbEntity)
  createKgnb(
    @GqlCurrentUser() user: SysUserEntity,
    @Args("targetId", { type: () => Int }) targetId: number,
    @Args("context") context: string,
    @Args("time") time: string
  ) {
    return this.prisma.sys_kgnb.create({
      data: {
        creatorId: user.id,
        targetId,
        context,
        time
      }
    })
  }

  @UseGuards(new GqlAuthPowerGuard("修改阔哥牛逼", "kgnb/upd", [UPDATE_POWER]))
  @Mutation(() => SysKgnbEntity)
  updateKgnb(
    @GqlCurrentUser() user: SysUserEntity,
    @Args("targetId", { type: () => Int }) targetId: number,
    @Args("context") context: string,
    @Args("time") time: string,
    @Args("id", { type: () => Int }) id: number
  ) {
    return this.prisma.sys_kgnb.update({
      where: {
        id
      },
      data: {
        targetId,
        context,
        time
      }
    })
  }

  @UseGuards(new GqlAuthPowerGuard("删除阔哥牛逼", "kgnb/del", [DELETE_POWER]))
  @Mutation(() => SysKgnbEntity)
  deleteKgnb(
    @Args("id", { type: () => Int }) id: number
  ) {
    return this.prisma.sys_kgnb.delete({
      where: {
        id
      }
    })
  }


  @Query(() => [SysKgnbEntity])
  getKgnb() {
    return this.prisma.sys_kgnb.findMany({
      include: {
        creator: true,
        target: true
      }
    })
  }
}
