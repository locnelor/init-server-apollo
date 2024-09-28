import { Field, Int, ObjectType } from "@nestjs/graphql";
import { sys_article_on_tags } from "@prisma/client";
import { SysArticleEntity } from "../sys.article.entity/sys.article.entity";
import { SysTagEntity } from "../sys.tag.entity/sys.tag.entity";

@ObjectType()
export class SysArticleOnTagEntity implements sys_article_on_tags {
  @Field(() => Int)
  sys_articleId: number;

  @Field(() => SysArticleEntity, { nullable: true })
  article?: SysArticleEntity

  @Field(() => Int)
  sys_tagId: number;

  @Field(() => SysTagEntity, { nullable: true })
  tag?: SysTagEntity
}
