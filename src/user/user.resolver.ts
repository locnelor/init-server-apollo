import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisCacheService
  ) { }


  @Query(() => [UserEntity], { name: 'user' })
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => UserEntity, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOne(id);
  }

  @Mutation(() => UserEntity)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.remove(id);
  }
}
