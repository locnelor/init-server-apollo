import { Field, ObjectType } from "@nestjs/graphql";
import { Pagination } from "../pagination";

@ObjectType()
export class SysQuestionPagination extends Pagination {

  @Field(() => [SysQuestionPagination])
  data: SysQuestionPagination[];
}
