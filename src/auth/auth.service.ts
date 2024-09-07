import { HashService } from '@app/hash';
import { PrismaService } from '@app/prisma';
import { SysUserEntity } from '@app/prisma/sys.user.entity/sys.user.entity';
import { SysConfigService } from '@app/sys-config';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
    private readonly hash: HashService,
    private readonly sysConfig: SysConfigService
  ) {
    sysConfig.loadConfig();
  }


  public validateUser(account: string, password: string) {
    return this.prisma.sys_user.findUnique({
      where: {
        account,
        password
      }
    })
  }
  getToken(user: SysUserEntity) {
    const payload = {
      crypto: this.hash.cryptoPassword(user.password + user.loginIp),
      sub: user.id,
    };
    return {
      access_token: this.jwt.sign(payload),
    };
  }

  async validate({ crypto, sub }) {
    const user = await this.prisma.sys_user.findUnique({
      where: {
        id: sub
      },
      include: {
        role: {
          include: {
            sys_menu_on_role: {
              include: {
                menu: true
              }
            }
          }
        }
      }
    })
    if (!user) throw NotFoundException
    if (this.hash.cryptoPassword(user.password + user.loginIp) !== crypto) throw ForbiddenException
    return user;
  }
}
