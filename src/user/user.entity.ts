import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from "@prisma/client"
import { ProfileEntity } from './profile.entity';

@ObjectType()
export class UserEntity implements User {
  @Field(() => Int)
  role: number;

  @Field({ nullable: true })
  openid: string;

  @Field({ nullable: true })
  session_key: string;

  @Field(() => Int)
  id: number;

  @Field()
  createAt: Date;

  @Field()
  updateAt: Date;

  @Field({ nullable: true })
  token?: string

  @Field({ nullable: true })
  account: string;

  @Field({ nullable: true })
  profile?: ProfileEntity
}
