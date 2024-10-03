import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { sys_photo } from "@prisma/client";
import { SysQuestionEntity } from "../sys.question.entity/sys.question.entity";
import { SysAnswerEntity } from "../sys.answer.entity/sys.answer.entity";
import { SysTaskItemAnswerEntity } from "../sys.task.item.answer.entity/sys.task.item.answer.entity";

@ObjectType()
export class SysPhotoEntity extends BaseEntity implements sys_photo {
  @Field(() => Int)
  sys_questionId: number;

  @Field(() => SysQuestionEntity, { nullable: true })
  sys_question?: SysQuestionEntity;

  @Field()
  hash_key: string;

  @Field(() => [SysAnswerEntity], { nullable: true })
  sys_answer?: SysAnswerEntity[]

  @Field(() => [SysTaskItemAnswerEntity], { nullable: true })
  sys_task_item_answer?: SysTaskItemAnswerEntity[]
}
