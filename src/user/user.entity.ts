import { Field, Int, ObjectType } from "@nestjs/graphql";
import { User } from "@prisma/client";
import { BaseEntity } from "src/baseEntity";
import { ProfileEntity } from "./profile.entity";


@ObjectType()
export class UserEntity extends BaseEntity implements User {
    @Field()
    account: string;

    @Field()
    name: string;

    @Field(() => Int)
    role: number;

    @Field(() => ProfileEntity)
    profile: ProfileEntity

    @Field(() => Int)
    profileId: number;

    @Field({ nullable: true })
    token?: string
}