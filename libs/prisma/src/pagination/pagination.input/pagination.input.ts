import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class PaginationInput {
  @Field(() => Int, { nullable: true})
  page: number

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  size: number

  @Field({ nullable: true, defaultValue: "desc" })
  order: "asc" | "desc"
}
