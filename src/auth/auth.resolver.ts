import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/entities/user.entity';
import { GqlAuthGuard, GqlCurrentUser } from './auth.guard';
import { cryptoPassword } from 'src/libs/hash';
import { SiginInput } from './dto/sigin.input';
import { ForbiddenError } from '@nestjs/apollo';
import { AuthService } from './auth.service';

@Resolver(of => User)
export class AuthResolver {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly authService: AuthService
    ) { }

    @Query(() => User)
    @UseGuards(GqlAuthGuard)
    getInfo(
        @GqlCurrentUser() user: User
    ) {
        console.log(user)
        return user;
    }

    @Query(() => User)
    @UseGuards(GqlAuthGuard)
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
        if (!user) throw ForbiddenError
        user.token = this.authService.getToken(user).access_token
        return user;
    }

    @Mutation(() => User)
    async sigin(
        @Args("siginInput") { account, password }: SiginInput
    ) {
        const user: User = await this.prismaService.user.create({
            data: {
                account,
                profile: {
                    create: {
                        password: cryptoPassword(password)
                    }
                }
            },
            include: {
                profile: true
            }
        })
        if (!user) throw ForbiddenError
        user.token = this.authService.getToken(user).access_token
        return user
    }

}
