import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { sys_task_item } from "@prisma/client";
import { SysTaskEntity } from "../sys.task.entity/sys.task.entity";
import { SysQuestionEntity } from "../sys.question.entity/sys.question.entity";
import { SysTaskItemAnswerEntity } from "../sys.task.item.answer.entity/sys.task.item.answer.entity";

@ObjectType()
export class SysTaskItemEntity extends BaseEntity implements sys_task_item {
  @Field(() => Int)
  sys_taskId: number;

  @Field(() => SysTaskEntity, { nullable: true })
  task?: SysTaskEntity; 

  @Field(() => Int)
  sys_questionId: number;

  @Field(() => SysQuestionEntity, { nullable: true })
  question?: SysQuestionEntity;

  @Field(() => Boolean)
  correct: boolean;

  @Field(() => [SysTaskItemAnswerEntity], { nullable: true })
  answers?: SysTaskItemAnswerEntity[];
}
