import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Pagination {
  @Field(() => Int)
  page: number

  @Field(() => Int)
  size: number

  @Field(() => Int)
  total: number
}
