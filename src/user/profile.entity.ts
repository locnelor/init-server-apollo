import { Field, ObjectType } from "@nestjs/graphql";
import { Profile } from "@prisma/client"

@ObjectType()
export class ProfileEntity implements Profile {
    @Field()
    id: number;

    @Field()
    createAt: Date;

    @Field()
    updateAt: Date;

    @Field()
    userId: number;

    password: string;
}