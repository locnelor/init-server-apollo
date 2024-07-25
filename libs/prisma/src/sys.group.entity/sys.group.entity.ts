import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { sys_group } from "@prisma/client";
import { SysUserEntity } from "../sys.user.entity/sys.user.entity";
import { SysGroupOnItemsEntity } from "../sys.group.on.items.entity/sys.group.on.items.entity";

@ObjectType()
export class SysGroupEntity extends BaseEntity implements sys_group {
    @Field()
    name: string;

    @Field(() => Int)
    status: number;

    @Field(() => Boolean)
    allow: boolean;

    @Field({ nullable: true })
    icon: string;

    @Field({ nullable: true })
    background: string;

    @Field({ nullable: true })
    question: string;

    @Field()
    hash_key: string;

    @Field(() => Int)
    sys_userId: number;

    @Field(() => SysUserEntity, { nullable: true })
    master?: SysUserEntity

    @Field(() => [SysGroupOnItemsEntity], { nullable: true })
    info?: SysGroupOnItemsEntity[]
}
