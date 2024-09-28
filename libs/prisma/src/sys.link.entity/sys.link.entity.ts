import { Field, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { sys_link } from "@prisma/client";

@ObjectType()
export class SysLinkEntity extends BaseEntity implements sys_link {
  @Field()
  name: string;

  @Field()
  href: string;
}
