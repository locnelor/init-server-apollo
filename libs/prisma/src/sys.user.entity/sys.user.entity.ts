import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { sys_user } from "@prisma/client";
import { UserProfileEntity } from "../user.profile.entity/user.profile.entity";
import { SysRoleEntity } from "../sys.role.entity/sys.role.entity";
import { SysLoggerEntity } from "../sys.logger.entity/sys.logger.entity";

@ObjectType()
export class SysUserEntity extends BaseEntity implements sys_user {
    password: string;

    @Field()
    hash_key: string;

    @Field()
    account: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    loginIp: string;

    @Field(() => Int)
    user_profileId: number;

    @Field(() => UserProfileEntity, { nullable: true })
    profile?: UserProfileEntity

    @Field(() => Int)
    sys_roleId: number;

    @Field(() => SysRoleEntity, { nullable: true })
    role?: SysRoleEntity

    @Field(() => [SysLoggerEntity], { nullable: true })
    sys_logger?: SysLoggerEntity[]

    @Field({ nullable: true })
    token?: string
}
