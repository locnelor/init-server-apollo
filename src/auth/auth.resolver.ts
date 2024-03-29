import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from 'src/user/user.entity';
import { GqlAuthGuard, GqlCurrentUser } from './auth.guard';
import { cryptoPassword } from 'src/libs/hash';
import { ForbiddenError } from '@nestjs/apollo';
import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { TestEntity } from './test.entity';

@Resolver(of => UserEntity)
export class AuthResolver {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly authService: AuthService
    ) { }

    @Query(() => UserEntity)
    @UseGuards(GqlAuthGuard)
    currentUser(
        @GqlCurrentUser() user: UserEntity
    ) {
        return user;
    }

    @Mutation(() => UserEntity)
    async auth(
        @Args("account") account: string,
        @Args("password") password: string
    ) {
        const user: UserEntity = await this.prismaService.user.findUnique({
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

    @Query(() => TestEntity)
    async test() {
        return {
            now: Date.now(),
            msg: "hello world"
        }
    }

}
