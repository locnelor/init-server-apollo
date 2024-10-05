import { Field, ObjectType } from "@nestjs/graphql";
import { Pagination } from "../pagination";
import { SysQuestionEntity } from "@app/prisma/sys.question.entity/sys.question.entity";

@ObjectType()
export class SysQuestionPagination extends Pagination {

  @Field(() => [SysQuestionEntity])
  data: SysQuestionEntity[];
}
