import { Module } from '@nestjs/common';
import { GroupResolver } from './group.resolver';
import { GroupService } from './group.service';
import { PrismaModule } from '@app/prisma';
import { FileModule } from '@app/file';
import { HashModule } from '@app/hash';

@Module({
  imports: [PrismaModule, FileModule, HashModule],
  providers: [GroupResolver, GroupService]
})
export class GroupModule { }
