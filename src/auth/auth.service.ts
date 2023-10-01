import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { cryptoPassword } from 'src/libs/hash';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/entities/user.entity';

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
                    password: cryptoPassword(password)
                }
            },
            include: { profile: true }
        })
    }

    getToken(user: User) {
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
            include: { profile: true }
        })
        if (!user) throw NotFoundException
        if (cryptoPassword(user.profile.password) !== crypto) throw ForbiddenException
        return user;
    }
}
