import { ObjectType, Field, Float } from '@nestjs/graphql';


@ObjectType()
export class TestEntity {
    @Field(() => Float)
    now: number

    @Field()
    msg: string
}
