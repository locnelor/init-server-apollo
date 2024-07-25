import { Field, InputType } from "@nestjs/graphql";
import { TaskItemInput } from "src/input/task-item-input/task-item-input";

@InputType()
export class CreateGroupInput {
    @Field(() => Boolean, { nullable: true })
    allow?: boolean

    @Field()
    name: string

    @Field(() => [String], { nullable: true })
    question?: string[]

    @Field(() => [TaskItemInput], { nullable: true })
    info?: TaskItemInput[]
}
