import { FileService } from '@app/file';
import { HashService } from '@app/hash';
import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SysConfig, SysConfigKey } from './sys-config/sys-config.interface';


@Injectable()
export class SysConfigService {
  constructor(
    private readonly file: FileService,
    private readonly hash: HashService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
  ) { }
  private config: SysConfig = {
    defaultRoleId: 0,
  };
  private setKey<T extends SysConfigKey>(key: T, value: SysConfig[T]) {
    this.config[key] = value;
    this.file.setConfig(this.config);
  }
  public getConfig<T extends SysConfigKey>(key: T) {
    return this.config[key]
  }
  public loadConfig() {
    const config = this.file.getConfig();
    if (!config) {
      this.initConfig();
    }
  }
  public async initConfig() {
    console.log("init config")
    /**
     * 管理员账号
     * 管理员权限
     * 普通权限
     */
    const ADMIN_NAME = this.configService.get("ADMIN_NAME")
    const ADMIN_ROLE = this.configService.get("ADMIN_ROLE")
    const ADMIN_PASSWORD = this.configService.get("ADMIN_PASSWORD")
    const ADMIN_ACCOUNT = this.configService.get("ADMIN_ACCOUNT")
    const USER_NAME = this.configService.get("USER_NAME")
    const menu = await this.prisma.sys_menu.findMany();
    const sys_role = await this.prisma.sys_role.upsert({
      where: {
        name: ADMIN_ROLE
      },
      create: {
        name: ADMIN_ROLE,
        sort: 1
      },
      update: {
        sys_menu_on_role: {
          createMany: {
            data: menu.map(({ id }) => ({ sys_menuId: id })),
            skipDuplicates: true
          }
        }
      }
    })
    await this.prisma.sys_user.upsert({
      where: {
        account: ADMIN_ACCOUNT
      },
      create: {
        account: ADMIN_ACCOUNT,
        password: this.hash.cryptoPassword(ADMIN_PASSWORD),
        name: ADMIN_NAME,
        hash_key: this.hash.createUid([ADMIN_PASSWORD, ADMIN_ACCOUNT]),
        role: {
          connect: {
            id: sys_role.id
          }
        }
      },
      update: {
        role: {
          connect: {
            id: sys_role.id
          }
        }
      }
    })
    const user_role = await this.prisma.sys_role.upsert({
      where: {
        name: USER_NAME
      },
      create: {
        name: USER_NAME,
        sort: 2
      },
      update: {}
    })
    this.setKey("defaultRoleId", user_role.id);
  }
}
