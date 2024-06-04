import { Field, Int, ObjectType } from "@nestjs/graphql";
import { sys_logger } from "@prisma/client";
import { SysUserEntity } from "../sys.user.entity/sys.user.entity";

@ObjectType()
export class SysLoggerEntity implements sys_logger {
    @Field()
    id: string;

    @Field()
    createAt: Date;

    @Field()
    updateAt: Date;

    @Field()
    type: string;

    @Field()
    name: string;

    @Field()
    ip: string;

    @Field()
    status: number;

    @Field({ nullable: true })
    message: string;

    @Field(() => Int)
    time: number;

    @Field(() => Int)
    sys_userId: number;

    @Field(() => SysUserEntity, { nullable: true })
    user?: SysUserEntity
}
