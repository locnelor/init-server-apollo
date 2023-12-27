import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { WechartService } from './wechart.service';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { cryptoPassword } from 'src/libs/hash';

@Controller('wechart')
export class WechartController {
    constructor(
        private readonly wechartService: WechartService,
        private readonly authService: AuthService,
        private readonly prismaService: PrismaService
    ) { }


    @Post("login")
    @ApiOperation({ summary: "微信登录" })
    async login(
        @Body() {
            code
        }
    ) {
        const { session_key, openid } = await this.wechartService.jscode2session(code);
        const user = await this.prismaService.user.findFirst({
            where: {
                openid
            },
            include: {
                profile: true
            }
        })
        if (!user) {
            const user = await this.prismaService.user.create({
                data: {
                    openid,
                    session_key,
                    profile: {
                        create: {
                            password: cryptoPassword(openid)
                        }
                    }
                },
                include: {
                    profile: true
                }
            })
            return this.authService.getToken(user);
        }
        await this.prismaService.user.update({
            where: {
                id: user.id
            },
            data: {
                session_key
            }
        })
        return this.authService.getToken(user);
    }
}
