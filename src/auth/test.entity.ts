import { ObjectType, Field, Float } from '@nestjs/graphql';


@ObjectType()
export class Test {
    @Field(() => Float)
    now: number

    @Field()
    msg: string
}
