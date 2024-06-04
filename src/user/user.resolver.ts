import { PrismaService } from '@app/prisma';
import { SysUserEntity } from '@app/prisma/sys.user.entity/sys.user.entity';
import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { GqlAuthPowerGuard, QueryPower, gqlAuthPowerGuardTest } from 'src/auth/auth.guard';

@Resolver()
export class UserResolver {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    @Query(() => [SysUserEntity])
    @UseGuards(gqlAuthPowerGuardTest())
    selUsers() {

        return this.prisma.sys_user.findMany({});
    }
}
