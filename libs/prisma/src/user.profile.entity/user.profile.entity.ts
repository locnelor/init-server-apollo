import { ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { user_profile } from "@prisma/client";

@ObjectType()
export class UserProfileEntity extends BaseEntity implements user_profile {
    password: string;
}
