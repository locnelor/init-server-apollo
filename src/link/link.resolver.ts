import { PrismaService } from '@app/prisma';
import { SysLinkEntity } from '@app/prisma/sys.link.entity/sys.link.entity';
import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CREATE_POWER, DELETE_POWER, GqlAuthPowerGuard, GqlCurrentUser, UPDATE_POWER } from 'src/auth/auth.guard';

@Resolver()
@UseGuards(new GqlAuthPowerGuard("友链", "link"))
export class LinkResolver {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  @UseGuards(new GqlAuthPowerGuard("添加友链", "link/add", [CREATE_POWER]))
  @Mutation(() => SysLinkEntity)
  createLink(
    @Args("name") name: string,
    @Args("href") href: string
  ) {
    return this.prisma.sys_link.create({
      data: {
        name,
        href
      }
    })
  }

  @UseGuards(new GqlAuthPowerGuard("修改友链", "link/upd", [UPDATE_POWER]))
  @Mutation(() => SysLinkEntity)
  updateLink(
    @Args("id", { type: () => Int }) id: number,
    @Args("name") name: string,
    @Args("href") href: string
  ) {
    return this.prisma.sys_link.update({
      where: {
        id
      },
      data: {
        name,
        href
      }
    })
  }

  @UseGuards(new GqlAuthPowerGuard("删除友链", "link/del", [DELETE_POWER]))
  @Mutation(() => SysLinkEntity)
  deleteLink(
    @Args("id", { type: () => Int }) id: number
  ) {
    return this.prisma.sys_link.delete({
      where: {
        id
      }
    })
  }


  @UseGuards(new GqlAuthPowerGuard("删除多个友链", "link/dels", [DELETE_POWER]))
  @Mutation(() => Int)
  async deleteLinks(
    @Args("ids", { type: () => [Int] }) ids: number[]
  ) {
    const result = await this.prisma.sys_link.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    })
    return result.count
  }

  @Query(() => [SysLinkEntity])
  getLink() {
    return this.prisma.sys_link.findMany()
  }
}
