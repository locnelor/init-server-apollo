import { Module } from '@nestjs/common';
import { ArticleResolver } from './article.resolver';
import { ArticleService } from './article.service';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [PrismaModule],
  providers: [ArticleResolver, ArticleService]
})
export class ArticleModule { }
