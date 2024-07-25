import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';
import { CreateGroupInput } from './input/create-group-input/create-group-input';
import { sys_user } from '@prisma/client';
import { HashService } from '@app/hash';
import { SysGroupEntity } from '@app/prisma/sys.group.entity/sys.group.entity';

@Injectable()
export class GroupService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly hash: HashService
    ) { }

    public getGroupsByuser(user: sys_user) {
        return this.prisma.sys_group.findMany({
            where: {
                sys_userId: user.id
            },
            include: {
                info: {
                    include: {
                        item: true
                    }
                }
            }
        })
    }

    public async createGroup(data: CreateGroupInput, user: sys_user) {
        const hash_key = this.hash.createUid();
        const group: SysGroupEntity = await this.prisma.sys_group.create({
            data: {
                allow: data.allow,
                name: data.name,
                question: data.question.join("_split_"),
                hash_key,
                master: {
                    connect: {
                        id: user.id
                    }
                },
            }
        })
        const info = await this.prisma.sys_task_item.createMany({
            data: data.info.map((item) => ({
                ...item
            }))
        })
        group.info = info

        // this.prisma.sys_group_on_items.createMany({
        //     data: data.info.map(item => {
        //         return {
        //             group_id: group.id,
        //             ...item
        //         }
        //     })
        // })
    }
}
