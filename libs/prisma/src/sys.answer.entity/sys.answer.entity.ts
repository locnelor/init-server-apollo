import { Field, Int, ObjectType } from "@nestjs/graphql";
import { sys_answer } from "@prisma/client";
import { SysQuestionEntity } from "../sys.question.entity/sys.question.entity";
import { SysPhotoEntity } from "../sys.photo.entity/sys.photo.entity";


@ObjectType()
export class SysAnswerEntity implements sys_answer {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  sys_questionId: number;

  @Field(() => SysQuestionEntity, { nullable: true })
  sys_question?: SysQuestionEntity;

  @Field(() => String)
  sys_photoId: number;

  @Field(() => SysPhotoEntity, { nullable: true })
  photo?: SysPhotoEntity;
}
