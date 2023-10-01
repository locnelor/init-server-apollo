import { Field, ObjectType } from "@nestjs/graphql";
import { profile } from "@prisma/client"

@ObjectType()
export class Profile implements profile {
    @Field()
    id: number;

    @Field()
    createAt: Date;

    @Field()
    updateAt: Date;

    @Field()
    userId: number;

    @Field()
    password: string;
}