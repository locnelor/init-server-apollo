import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/entities/user.entity';
import { GqlAuthGuard } from './auth.guard';
import { cryptoPassword } from 'src/libs/hash';

@Resolver(of => User)
export class AuthResolver {
    constructor(
        private readonly prismaService: PrismaService
    ) { }
    @Query(() => User)
    @UseGuards(GqlAuthGuard)
    async auth(
        @Args("account") account: string,
        @Args("password") password: string
    ) {
        const entity = await this.prismaService.user.findUnique({
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
        return entity
    }
}
