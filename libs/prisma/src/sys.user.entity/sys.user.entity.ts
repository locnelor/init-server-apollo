import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { sys_user } from "@prisma/client";
import { SysRoleEntity } from "../sys.role.entity/sys.role.entity";

@ObjectType()
export class SysUserEntity extends BaseEntity implements sys_user {
  password: string;

  @Field()
  hash_key: string;

  @Field()
  account: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  loginIp: string;

  @Field(() => Int)
  sys_roleId: number;

  @Field(() => SysRoleEntity, { nullable: true })
  role?: SysRoleEntity

  @Field({ nullable: true })
  token?: string

  @Field(() => Boolean)
  status: boolean
}
