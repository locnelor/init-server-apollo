import { Body, Controller, ForbiddenException, Get, Post, UseGuards } from "@nestjs/common";
import { CurrentUser, JwtAuthGuard } from "./auth.guard";
import { User } from "src/user/entities/user.entity";
import { PrismaService } from "src/prisma/prisma.service";
import { cryptoPassword } from "src/libs/hash";
import { AuthService } from "./auth.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Args } from "@nestjs/graphql";


@Controller("api/auth")
@ApiTags("")
export class AuthController {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly authService: AuthService
    ) { }

    @Get("getInfo")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "" })
    getInfo(
        @CurrentUser() user: User
    ) {
        console.log(user)
        return user;
    }

    @Post("auth")
    @ApiOperation({ summary: "" })
    async auth(
        @Args("account") account: string,
        @Args("password") password: string
    ) {
        const user: User = await this.prismaService.user.findUnique({
            where: {
                account,
                profile: {
                    password: cryptoPassword(password)
                }
            },
            include: {
                profile: true
            }
        })
        if (!user) throw ForbiddenException
        user.token = this.authService.getToken(user).access_token;
        return user;
    }


    @Post("sigin")
    @ApiOperation({ summary: "" })
    async sigin(
        @Args("account") account: string,
        @Args("password") password: string
    ) {
        const exist = !!await this.prismaService.user.count({
            where: { account }
        })
        if (exist) {
            throw new ForbiddenException
        }
        const user: User = await this.prismaService.user.create({
            data: {
                account,
                profile: {
                    create: {
                        password: cryptoPassword(password)
                    }
                }
            },
            include: { profile: true }
        })
        if (!user) throw ForbiddenException
        user.token = this.authService.getToken(user).access_token
        return user
    }
}