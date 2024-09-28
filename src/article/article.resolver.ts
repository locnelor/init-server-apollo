import { PrismaService } from '@app/prisma';
import { SysTagEntity } from '@app/prisma/sys.tag.entity/sys.tag.entity';
import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { GqlAuthPowerGuard } from 'src/auth/auth.guard';

@Resolver()
@UseGuards(new GqlAuthPowerGuard("文章", "article"))
export class ArticleResolver {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  // @Query(()=>[SysTagEntity])

}
