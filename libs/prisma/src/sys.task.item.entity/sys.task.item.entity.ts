import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { sys_task_item } from "@prisma/client";

@ObjectType()
export class SysTaskItemEntity extends BaseEntity implements sys_task_item {
    @Field()
    label: string

    @Field(() => Int)
    order: number

    @Field()
    type: string

    @Field({ nullable: true })
    regex: string

    @Field(() => Int, { nullable: true })
    minLength: number

    @Field(() => Int, { nullable: true })
    maxLength: number

    @Field(() => Float, { nullable: true })
    min: number

    @Field(() => Float, { nullable: true })
    max: number

    @Field(() => Int, { nullable: true })
    floatLength: number

    @Field({ nullable: true })
    suffix: string

    @Field({ nullable: true })
    checkbox: string

    @Field({ nullable: true })
    options: string

    @Field({ nullable: true })
    select: string

    @Field({ nullable: true })
    comment: string
}
