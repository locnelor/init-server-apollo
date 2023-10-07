import { Field, InputType } from "@nestjs/graphql";
import { Length } from "class-validator";


@InputType()
export class SiginInput {
    @Field()
    @Length(2, 15, {message:"please input "})
    account: string

    @Field()
    @Length(6, 25)
    password: string
}