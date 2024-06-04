import { HashService } from '@app/hash';
import { PrismaService } from '@app/prisma';
import { SysUserEntity } from '@app/prisma/sys.user.entity/sys.user.entity';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly hashService: HashService
    ) {
        this.init()
    }

    public async init(
    ) {
        this.prisma
    }

    public validateUser(account: string, password: string) {
        return this.prisma.sys_user.findUnique({
            where: {
                account,
                profile: {
                    password
                }
            },
            include: { profile: true }
        })
    }
    getToken(user: SysUserEntity) {
        const payload = {
            crypto: this.hashService.cryptoPassword(user.profile.password + user.loginIp),
            sub: user.id,
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async validate({ crypto, sub }) {
        const user = await this.prisma.sys_user.findUnique({
            where: {
                id: sub
            },
            include: {
                profile: true,
                // role: {
                //     include: {
                //         sys_menu_on_role: {
                //             include: {
                //                 menu: true
                //             }
                //         }
                //     }
                // }
            }
        })

        if (!user) throw NotFoundException
        if (this.hashService.cryptoPassword(user.profile.password + user.loginIp) !== crypto) throw ForbiddenException
        return user;
    }
}
