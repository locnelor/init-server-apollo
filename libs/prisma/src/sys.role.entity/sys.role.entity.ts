import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { sys_role } from "@prisma/client";
import { SysUserEntity } from "../sys.user.entity/sys.user.entity";

@ObjectType()
export class SysRoleEntity extends BaseEntity implements sys_role {
    @Field()
    name: string;

    @Field(() => Int)
    sort: number;

    @Field()
    status: boolean;

    @Field({ nullable: true })
    comment: string;

    @Field(() => [SysUserEntity], { nullable: true })
    sys_user?: SysUserEntity[]
}
