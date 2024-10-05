import { Field, Int, ObjectType } from "@nestjs/graphql";
import { sys_question_on_photo } from "@prisma/client";

@ObjectType()
export class SysQuestionOnPhotoEntity implements sys_question_on_photo {
  @Field(() => Int)
  sys_photoId: number;

  @Field(() => Int)
  sys_questionId: number;
}
