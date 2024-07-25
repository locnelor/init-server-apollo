import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CREATE_POWER, DELETE_POWER, GqlAuthPowerGuard, GqlCurrentUser, UPDATE_POWER, VIEW_POWER } from 'src/auth/auth.guard';
import { GroupService } from './group.service';
import { CreateGroupInput } from './input/create-group-input/create-group-input';
import { sys_user } from '@prisma/client';

@Resolver()
@UseGuards(new GqlAuthPowerGuard("群组", "group"))
export class GroupResolver {
    constructor(
        private readonly groupService: GroupService
    ) { }

    @Query(() => String)
    async getSelfGroups(
        @GqlCurrentUser() user: sys_user
    ) {
        return this.groupService.getGroupsByuser(user);
    }

    @Mutation(() => String)
    @UseGuards(new GqlAuthPowerGuard("创建群组", "group/create", [CREATE_POWER]))
    async createGroup(
        @Args("data") data: CreateGroupInput,
        @GqlCurrentUser() user: sys_user
    ) {
        return this.groupService.createGroup(data, user)
    }

    @Mutation(() => String)
    @UseGuards(new GqlAuthPowerGuard("删除群组", "group/delete", [DELETE_POWER]))
    async deleteGroup() {
        return "deleteGroup";
    }
    @Mutation(() => String)
    @UseGuards(new GqlAuthPowerGuard("删除他人群组", "group/super/delete", [DELETE_POWER]))
    async superDeleteGroup() {
        return "deleteGroup";
    }

    // @Query()


    @Query(() => String)
    @UseGuards(new GqlAuthPowerGuard("查看所有群组", "group/view", [VIEW_POWER]))
    async getAllGroup() {
        return "viewGroup";
    }

    @Mutation(() => String)
    @UseGuards(new GqlAuthPowerGuard("更新群组", "group/update", [UPDATE_POWER]))
    async updateGroup() {
        return "updateGroup";
    }


}
