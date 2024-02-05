import { Field, ObjectType } from "@nestjs/graphql";
import { Profile } from "@prisma/client";
import { BaseEntity } from "src/baseEntity";



@ObjectType()
export class ProfileEntity extends BaseEntity implements Profile{
    @Field()
    password: string;
}