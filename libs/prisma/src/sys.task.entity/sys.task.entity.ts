import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { sys_task } from "@prisma/client";
import { SysUserEntity } from "../sys.user.entity/sys.user.entity";
import { SysTaskItemEntity } from "../sys.task.item.entity/sys.task.item.entity";

@ObjectType()
export class SysTaskEntity extends BaseEntity implements sys_task {
  @Field(() => Int)
  sys_userId: number;

  @Field(() => SysUserEntity, { nullable: true })
  user?: SysUserEntity;

  @Field(() => Int)
  corrects: number;

  @Field(() => [SysTaskItemEntity], { nullable: true })
  sys_task_item?: SysTaskItemEntity[];
}
