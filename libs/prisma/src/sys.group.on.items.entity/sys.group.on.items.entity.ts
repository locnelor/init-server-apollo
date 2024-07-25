import { Field, Int, ObjectType } from "@nestjs/graphql";
import { sys_group_on_items } from "@prisma/client";
import { SysGroupEntity } from "../sys.group.entity/sys.group.entity";
import { SysTaskItemEntity } from "../sys.task.item.entity/sys.task.item.entity";
@ObjectType()
export class SysGroupOnItemsEntity implements sys_group_on_items {
    @Field(() => Int)
    sys_groupId: number;

    @Field(() => Int)
    sys_task_itemId: number;

    @Field(() => SysGroupEntity, { nullable: true })
    group?: SysGroupEntity;

    @Field(() => SysTaskItemEntity, { nullable: true })
    item: SysTaskItemEntity;
}
