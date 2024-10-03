import { Field, Int, ObjectType } from "@nestjs/graphql";
import { sys_task_item_answer } from "@prisma/client";
import { SysTaskItemEntity } from "../sys.task.item.entity/sys.task.item.entity";
import { SysPhotoEntity } from "../sys.photo.entity/sys.photo.entity";

@ObjectType()
export class SysTaskItemAnswerEntity implements sys_task_item_answer {
  @Field(() => Int)
  id: number;

  @Field(() => SysTaskItemEntity, { nullable: true })
  sys_task_item?: SysTaskItemEntity

  @Field(() => Int)
  sys_task_itemId: number;

  @Field(() => SysPhotoEntity, { nullable: true })
  photo?: SysPhotoEntity

  @Field(() => Int)
  sys_photoId: number;
}
