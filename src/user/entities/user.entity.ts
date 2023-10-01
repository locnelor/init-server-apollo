import { ObjectType, Field, Int } from '@nestjs/graphql';
import { user } from "@prisma/client"
import { Profile } from './profile.entity';

@ObjectType()
export class User implements user {
  @Field(() => Int)
  id: number;

  @Field()
  createAt: Date;

  @Field()
  updateAt: Date;

  @Field()
  profileId: number;

  @Field()
  account: string;

  @Field()
  profile: Profile
}
