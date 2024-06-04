import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard, GqlCurrentUser } from './auth.guard';
import { ForbiddenError } from '@nestjs/apollo';
import { AuthService } from './auth.service';
import { PrismaService } from '@app/prisma';
import { HashService } from '@app/hash';
import { SysUserEntity } from '@app/prisma/sys.user.entity/sys.user.entity';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly authService: AuthService,
        private readonly hashService: HashService
    ) { }

    @Query(() => SysUserEntity)
    @UseGuards(GqlAuthGuard)
    viewer(
        @GqlCurrentUser() user: SysUserEntity
    ) {
        return user;
    }

    @Mutation(() => SysUserEntity)
    async auth(
        @Args("account") account: string,
        @Args("password") password: string,
        @Context() { req: { ip } }
    ) {
        const find: SysUserEntity = await this.prismaService.sys_user.findUnique({
            where: {
                account,
                profile: {
                    password: this.hashService.cryptoPassword(password)
                }
            },
            include: {
                profile: true
            }
        })
        if (!find) throw new ForbiddenError("找不到用户")
        const user: SysUserEntity = await this.prismaService.sys_user.update({
            where: {
                id: find.id
            },
            data: {
                loginIp: ip
            },
            include: {
                profile: true
            }
        })
        user.token = this.authService.getToken(user).access_token
        return user;
    }
}
