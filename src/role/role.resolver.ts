import { PrismaService } from '@app/prisma';
import { SysUserPagination } from '@app/prisma/pagination/sys.user.pagination/sys.user.pagination';
import { SysMenuOnRoleEntity } from '@app/prisma/sys.menu.on.role.entity/sys.menu.on.role.entity';
import { SysRoleEntity } from '@app/prisma/sys.role.entity/sys.role.entity';
import { SysUserEntity } from '@app/prisma/sys.user.entity/sys.user.entity';
import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { DELETE_POWER, GqlAuthPowerGuard, UPDATE_POWER, VIEW_POWER } from 'src/auth/auth.guard';

@Resolver()
@UseGuards(new GqlAuthPowerGuard("权限管理", "role"))
export class RoleResolver {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  @Query(() => [SysRoleEntity])
  @UseGuards(new GqlAuthPowerGuard("查询所有角色", "role/getRoles", [VIEW_POWER]))
  getRoles() {
    return this.prisma.sys_role.findMany()
  }

  @Query(() => [SysRoleEntity])
  @UseGuards(new GqlAuthPowerGuard("查询角色菜单", "role/getMenuByRoleId", [VIEW_POWER]))
  getMenuByRoleId(
    @Args("id", { type: () => Int }) id: number
  ) {
    return this.prisma.sys_role.findUnique({
      where: {
        id
      },
      include: {
        sys_menu_on_role: {
          include: {
            menu: true
          }
        }
      }
    })
  }

  @Query(() => SysUserPagination)
  @UseGuards(new GqlAuthPowerGuard("查询角色相关用户", "role/getRoleUsers", [VIEW_POWER]))
  async getRoleUsers(
    @Args("id", { type: () => Int }) id: number,
    @Args("order", { nullable: true }) order: string = "desc",
    @Args("skip", { nullable: true, type: () => Int }) skip = 0,
    @Args("take", { type: () => Int, nullable: true }) take = 20
  ) {
    const where = {
      role: {
        id
      }
    }
    const total = await this.prisma.sys_user.count({
      where
    })
    const data: SysUserEntity[] = await this.prisma.sys_user.findMany({
      orderBy: {
        id: order as Prisma.SortOrder
      },
      where,
      skip,
      take
    })
    return {
      skip,
      take,
      data,
      total
    }
  }

  @Mutation(() => SysUserEntity)
  @UseGuards(new GqlAuthPowerGuard("修改用户角色", "role/setUserRole", [UPDATE_POWER]))
  setUserRole(
    @Args("userId", { type: () => Int }) userId: number,
    @Args("roleId", { type: () => Int }) roleId: number
  ) {
    return this.prisma.sys_user.update({
      where: {
        id: userId
      },
      data: {
        role: {
          connect: {
            id: roleId
          }
        }
      }
    })
  }

  @Mutation(() => SysMenuOnRoleEntity)
  @UseGuards(new GqlAuthPowerGuard("添加用户角色", "role/addMenu", [UPDATE_POWER]))
  addMenu(
    @Args("menuId", { type: () => Int }) sys_menuId: number,
    @Args("roleId", { type: () => Int }) sys_roleId: number
  ) {
    return this.prisma.sys_menu_on_role.upsert({
      where: {
        sys_roleId_sys_menuId: {
          sys_menuId,
          sys_roleId
        }
      },
      update: {
        sys_menuId,
        sys_roleId
      },
      create: {
        sys_menuId,
        sys_roleId
      }
    })
  }

  @Mutation(() => SysMenuOnRoleEntity)
  @UseGuards(new GqlAuthPowerGuard("删除用户角色", "role/delMenu", [DELETE_POWER]))
  delMenu(
    @Args("menuId", { type: () => Int }) sys_menuId: number,
    @Args("roleId", { type: () => Int }) sys_roleId: number
  ) {
    return this.prisma.sys_menu_on_role.delete({
      where: {
        sys_roleId_sys_menuId: {
          sys_menuId,
          sys_roleId
        }
      }
    })
  }
}
