import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Pagination {
  @Field(() => Int)
  skip: number

  @Field(() => Int)
  take: number

  @Field(() => Int)
  total: number
}
