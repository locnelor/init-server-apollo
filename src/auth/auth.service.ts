import { HashService } from '@app/hash';
import { PrismaService } from '@app/prisma';
import { SysUserEntity } from '@app/prisma/sys.user.entity/sys.user.entity';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwt: JwtService,
        private readonly prisma: PrismaService,
        private readonly hash: HashService,
        private readonly config: ConfigService
    ) {
        const ADMIN_NAME = this.config.get("ADMIN_NAME")
        const ADMIN_ROLE = this.config.get("ADMIN_ROLE")
        const ADMIN_PASSWORD = this.config.get("ADMIN_PASSWORD")
        const ADMIN_ACCOUNT = this.config.get("ADMIN_ACCOUNT")
        this.init(
            ADMIN_ACCOUNT,
            ADMIN_NAME,
            ADMIN_ROLE,
            ADMIN_PASSWORD
        )
    }

    public async init(
        account: string,
        name: string,
        role: string,
        password: string
    ) {
        const menu = await this.prisma.sys_menu.findMany();
        const sys_role = await this.prisma.sys_role.upsert({
            where: {
                name: role
            },
            create: {
                name: role,
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
                account
            },
            create: {
                account,
                password: this.hash.cryptoPassword(password),
                name,
                hash_key: this.hash.createUid([password, account]),
                role: {
                    connect: {
                        id: sys_role.id
                    }
                },
                profile: {
                    create: {

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
    }

    public validateUser(account: string, password: string) {
        return this.prisma.sys_user.findUnique({
            where: {
                account,
                password
            },
            include: { profile: true }
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
                profile: true,
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
