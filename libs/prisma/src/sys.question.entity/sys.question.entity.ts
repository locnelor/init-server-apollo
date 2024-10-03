import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { sys_question } from "@prisma/client";
import { SysPhotoEntity } from "../sys.photo.entity/sys.photo.entity";
import { SysAnswerEntity } from "../sys.answer.entity/sys.answer.entity";
import { SysTaskItemEntity } from "../sys.task.item.entity/sys.task.item.entity";
import { SysVideoEntity } from "../sys.video.entity/sys.video.entity";

@ObjectType()
export class SysQuestionEntity extends BaseEntity implements sys_question {
  @Field(() => [SysPhotoEntity], { nullable: true })
  photos?: SysPhotoEntity[];

  @Field(() => [SysAnswerEntity], { nullable: true })
  answers?: SysAnswerEntity[];

  @Field(() => [SysTaskItemEntity], { nullable: true })
  sys_task_items?: SysTaskItemEntity[];

  @Field(() => Int)
  top_id: number;

  @Field(() => SysVideoEntity, { nullable: true })
  top?: SysVideoEntity;

  @Field(() => Int)
  ass_id: number;

  @Field(() => SysVideoEntity, { nullable: true })
  ass?: SysVideoEntity;
}
