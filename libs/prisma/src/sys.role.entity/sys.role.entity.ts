import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { sys_role } from "@prisma/client";
import { SysUserEntity } from "../sys.user.entity/sys.user.entity";
import { SysMenuOnRoleEntity } from "../sys.menu.on.role.entity/sys.menu.on.role.entity";

@ObjectType()
export class SysRoleEntity extends BaseEntity implements sys_role {
  @Field()
  name: string;

  @Field(() => Int)
  sort: number;

  @Field()
  status: boolean;

  @Field({ nullable: true })
  comment: string;

  @Field(() => [SysUserEntity], { nullable: true })
  sys_user?: SysUserEntity[]

  @Field(() => [SysMenuOnRoleEntity], { nullable: true })
  sys_menu_on_role?: SysMenuOnRoleEntity[]
}
