import { Field, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { sys_tag } from "@prisma/client";
import { SysArticleOnTagEntity } from "../sys.article.on.tag.entity/sys.article.on.tag.entity";

@ObjectType()
export class SysTagEntity extends BaseEntity implements sys_tag {
  @Field()
  name: string;

  @Field(() => [SysArticleOnTagEntity], { nullable: true })
  articles?: SysArticleOnTagEntity
}
