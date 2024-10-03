import { HashService } from "@app/hash";
import { SysUserEntity } from "@app/prisma/sys.user.entity/sys.user.entity";
import { AuthenticationError, ForbiddenError } from "@nestjs/apollo";
import { ExecutionContext, ForbiddenException, UnauthorizedException, createParamDecorator } from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";
import { PrismaClient } from "@prisma/client";


export class JwtAuthGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}

export class GqlAuthGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    return super.canActivate(
      new ExecutionContextHost([req]),
    );
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new AuthenticationError('请先登录！');
    }
    return user;
  }
}


export const GqlCurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user
  },
);


let client = new PrismaClient;
let time;
type MenuItem = {
  name: string,
  path: string,
  power?: number[],
  children?: MenuItem
}
const menuList: MenuItem[] = [];
const start = async (list: MenuItem[], parentId = 0, parentPath = "", roleId: number) => {
  const arr: MenuItem[] = list.filter((e) => {
    if (parentPath.length === 0) return !e.path.includes("/");
    return e.path.slice(0, parentPath.length) === parentPath;
  });
  const other: MenuItem[] = list.filter((e) => {
    if (parentPath.length === 0) return e.path.includes("/");
    return e.path.slice(0, parentPath.length) !== parentPath;
  });
  for (const item of arr) {
    const parent = parentId === 0 ? undefined : {
      connect: {
        id: parentId
      }
    }
    const role = item.power?.reduce((acc, item) => acc | item, 0) || 0;
    const menu = await client.sys_menu.upsert({
      where: {
        path: item.path
      },
      create: {
        name: item.name,
        parent,
        path: item.path,
        role
      },
      update: {
        name: item.name,
        parent,
        role
      }
    });
    await client.sys_menu_on_role.upsert({
      where: {
        sys_roleId_sys_menuId: {
          sys_roleId: roleId,
          sys_menuId: menu.id
        }
      },
      create: {
        sys_menuId: menu.id,
        sys_roleId: roleId
      },
      update: {}
    })
    console.log(`
${menu.name}
${menu.path}
`)
    start(
      other,
      menu.id,
      menu.path,
      roleId
    )
  }
}
const initRole = async () => {
  console.log("初始化角色：")
  const role = await client.sys_role.upsert({
    where: {
      name: process.env.ADMIN_ROLE
    },
    create: {
      name: process.env.ADMIN_ROLE,
      sort: 0

    },
    update: {}
  })
  return role
}
const makeAdmin = async (roleId: number) => {
  console.log(`初始化管理员：`)
  const hashServer = new HashService()
  const user = await client.sys_user.upsert({
    where: {
      account: process.env.ADMIN_ACCOUNT
    },
    create: {
      name: process.env.ADMIN_NAME,
      password: hashServer.cryptoPassword(process.env.ADMIN_PASSWORD),
      account: process.env.ADMIN_ACCOUNT,
      role: {
        connect: {
          id: roleId
        }
      },
      hash_key: hashServer.createUid()
    },
    update: {
      role: {
        connect: {
          id: roleId
        }
      },
    }
  })
  return user;
}
const run = () => {
  clearTimeout(time);
  time = setTimeout(async () => {
    const role = await initRole();
    console.log(`初始化菜单列表：`)
    await start(menuList, 0, "", role.id)
    await makeAdmin(role.id)
  }, 1000);
}
const pushMenu = (menu: MenuItem) => {
  menuList.push(menu)
  run();
}


export class AuthPowerGuard extends AuthGuard("jwt") {
  constructor(
    private readonly name: string,
    private readonly path: string,
    private readonly power?: number[]
  ) {
    super()
    pushMenu({
      name,
      path,
      power
    })
  }
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
  handleRequest(err, user) {
    if (!this.power) return null
    if (err || !user) {
      throw err || new UnauthorizedException('请先登录！');
    }
    if (!this.power.length) return user
    const {
      menu: {
        role
      }
    } = user.role.sys_menu_on_role.find(({ menu }) => {
      return menu.path === this.path
    }) || { role: 0 };
    if (!role) throw new ForbiddenException('权限不足');
    const power = this.power.reduce((acc, item) => acc | item, 0);
    if ((power & role) !== power) {
      throw new ForbiddenException('权限不足')
    }
    return user
  }
}
export const VIEW_POWER = 1;//查询权限
export const CREATE_POWER = 1 << 1;//编辑权限
export const UPDATE_POWER = 1 << 2;//删除权限
export const DELETE_POWER = 1 << 3;//增加权限
export const EXPORT_POWER = 1 << 4;//导出权限
export const IMPOER_POWER = 1 << 5;//导入权限
export const ASSIGN_POWER = 1 << 6;//分配权限


export class GqlAuthPowerGuard extends AuthGuard("jwt") {
  constructor(
    private readonly name: string,
    private readonly path: string,
    private readonly power?: number[]
  ) {
    super()
    pushMenu({
      name,
      path,
      power
    })
  }
  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    return super.canActivate(
      new ExecutionContextHost([req]),
    );
  }
  handleRequest<TUser extends SysUserEntity>(err: any, user: TUser) {
    if (!this.power) return null
    if (err || !user) {
      throw err || new AuthenticationError('请先登录！');
    }
    if (!this.power.length) {
      return user;
    }
    const {
      menu: {
        role
      }
    } = user.role.sys_menu_on_role.find(({ menu }) => {
      return menu.path === this.path
    }) || { role: 0 };
    if (!role) throw new ForbiddenError('权限不足');
    const power = this.power.reduce((acc, item) => acc | item, 0);
    if ((power & role) !== power) {
      throw new ForbiddenError('权限不足')
    }
    return user
  }
}