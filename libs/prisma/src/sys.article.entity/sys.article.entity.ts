import { Field, Int, ObjectType } from "@nestjs/graphql";
import { sys_article } from "@prisma/client";
import { BaseEntity } from "../base.entity/base.entity";
import { SysUserEntity } from "../sys.user.entity/sys.user.entity";
import { SysArticleOnTagEntity } from "../sys.article.on.tag.entity/sys.article.on.tag.entity";

@ObjectType()
export class SysArticleEntity extends BaseEntity implements sys_article {
  @Field(() => Int)
  sys_userId: number;

  @Field(() => SysUserEntity, { nullable: true })
  creator?: SysUserEntity

  @Field()
  title: string;

  @Field()
  sub_title: string;

  @Field()
  hash_key: string;

  @Field(() => Boolean)
  lock: boolean;

  @Field(() => [SysArticleOnTagEntity], { nullable: true })
  tags?: SysArticleOnTagEntity[]
}
