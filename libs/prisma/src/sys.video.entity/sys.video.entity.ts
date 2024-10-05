import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { $Enums, sys_video } from "@prisma/client";
import { SysQuestionEntity } from "../sys.question.entity/sys.question.entity";

@ObjectType()
export class SysVideoEntity extends BaseEntity implements sys_video {
  @Field(() => String)
  status: $Enums.VideoStatus;

  @Field()
  hash_key: string;

  @Field(() => Int)
  size: number;

  @Field(() => SysQuestionEntity, { nullable: true })
  questionTop?: SysQuestionEntity;

  @Field(() => SysQuestionEntity, { nullable: true })
  questionAss?: SysQuestionEntity;
}
