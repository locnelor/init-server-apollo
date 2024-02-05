import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { cryptoPassword } from 'src/libs/hash';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService
    ) { }
    public validateUser(account: string, password: string) {
        return this.prismaService.user.findUnique({
            where: {
                account,
                profile: {
                    password
                }
            },
            include: { profile: true }
        })
    }
    getToken(user: UserEntity) {
        const payload = {
            crypto: cryptoPassword(user.profile.password),
            sub: user.id
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async validate({ crypto, sub }) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: sub
            },
            include: {
                profile: true,
            }
        })
        if (!user) throw NotFoundException
        if (cryptoPassword(user.profile.password) !== crypto) throw ForbiddenException
        return user;
    }
}
