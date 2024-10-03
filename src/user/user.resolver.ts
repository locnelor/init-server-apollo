import { HashService } from '@app/hash';
import { PrismaService } from '@app/prisma';
import { PaginationInput } from '@app/prisma/pagination/pagination.input/pagination.input';
import { SysUserPagination } from '@app/prisma/pagination/sys.user.pagination/sys.user.pagination';
import { SysUserEntity } from '@app/prisma/sys.user.entity/sys.user.entity';
import { ForbiddenError } from '@nestjs/apollo';
import { UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CREATE_POWER, DELETE_POWER, GqlAuthPowerGuard, UPDATE_POWER, VIEW_POWER } from 'src/auth/auth.guard';

@Resolver()
@UseGuards(new GqlAuthPowerGuard("用户", "user"))
export class UserResolver {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hash: HashService,
    private readonly config: ConfigService
  ) { }

  @Query(() => SysUserPagination)
  @UseGuards(new GqlAuthPowerGuard("查询用户", "user/view", [VIEW_POWER]))
  async selUsers(
    @Args("pagination", { type: () => PaginationInput }) { size, page }: PaginationInput
  ) {
    const total = await this.prisma.sys_user.count();
    const data = await this.prisma.sys_user.findMany({
      take: size,
      skip: (page - 1) * size,
      include: { role: true }
    });
    return {
      data,
      total,
      size,
      page
    }
  }

  @Mutation(() => SysUserEntity)
  @UseGuards(new GqlAuthPowerGuard("添加用户", "user/add", [CREATE_POWER]))
  async addUser(
    @Args("account") account: string,
    @Args("name") name: string,
    @Args("role_id", { type: () => Int }) role_id: number,
    @Args("status", { type: () => Boolean, nullable: true }) status?: boolean
  ) {
    const hash_key = this.hash.createUid([account, name])
    if (await this.prisma.sys_user.findUnique({ where: { account } })) {
      throw new ForbiddenError("账号已存在")
    }
    return await this.prisma.sys_user.create({
      data: {
        account,
        name,
        hash_key,
        password: this.hash.cryptoPassword(account),
        status,
        role: {
          connect: {
            id: role_id
          }
        }
      }
    })
  }

  @Mutation(() => SysUserEntity)
  @UseGuards(new GqlAuthPowerGuard("修改用户", "user/edit", [UPDATE_POWER]))
  updUser(
    @Args("id", { type: () => Int }) id: number,
    @Args("account") account: string,
    @Args("name") name: string,
    @Args("role_id", { type: () => Int }) role_id: number,
    @Args("status", { type: () => Boolean, nullable: true }) status?: boolean
  ) {
    return this.prisma.sys_user.update({
      where: {
        id
      },
      data: {
        account,
        name,
        role: {
          connect: {
            id: role_id
          }
        }
      }
    })
  }

  @Mutation(() => SysUserEntity)
  @UseGuards(new GqlAuthPowerGuard("删除用户", "user/del", [DELETE_POWER]))
  delUser(@Args("id", { type: () => Int }) id: number) {
    return this.prisma.sys_user.delete({
      where: { id }
    })
  }

}
