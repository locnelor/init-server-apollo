import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { sys_kgnb } from "@prisma/client";
import { SysUserEntity } from "../sys.user.entity/sys.user.entity";

@ObjectType()
export class SysKgnbEntity extends BaseEntity implements sys_kgnb {
  @Field(() => Int)
  creatorId: number;

  @Field(() => SysUserEntity, { nullable: true })
  creator?: SysUserEntity

  @Field(() => Int)
  targetId: number;

  @Field(() => SysUserEntity, { nullable: true })
  target?: SysUserEntity

  @Field()
  context: string;

  @Field()
  time: Date;
}
