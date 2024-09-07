import { PrismaService } from '@app/prisma';
import { SysUserEntity } from '@app/prisma/sys.user.entity/sys.user.entity';
import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { GqlAuthPowerGuard, VIEW_POWER } from 'src/auth/auth.guard';

@Resolver()
@UseGuards(new GqlAuthPowerGuard("用户", "user"))
export class UserResolver {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  @Query(() => [SysUserEntity])
  @UseGuards(new GqlAuthPowerGuard("查询用户", "user/view", [VIEW_POWER]))
  selUsers() {
    return this.prisma.sys_user.findMany({});
  }


}
