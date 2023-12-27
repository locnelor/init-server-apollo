import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from 'src/user/user.entity';

@Controller('comment')
@UseGuards(AuthGuard("jwt"))
export class CommentController {

    constructor(
        private readonly prismaService: PrismaService
    ) { }

    @Get("getComment")
    getComment() {
        return this.prismaService.comment.findMany({
            orderBy: {
                id: "desc"
            },
            where: {
                parent: null
            },
            include: {
                user: true
            }
        })
    }

    @Get(":id/getReply")
    getReply(
        @Param("id") id: number
    ) {
        return this.prismaService.comment.findMany({
            orderBy: {
                id: "desc"
            },
            where: {
                parent: { id }
            },
            include: {
                user: true
            }
        })
    }

    @Post("pushComment")
    pushComment(
        @Body() {
            context,
            reply
        },
        @CurrentUser() user: UserEntity
    ) {
        return this.prismaService.comment.create({
            data: {
                context,
                user: {
                    connect: {
                        id: user.id
                    }
                },
                parent: {
                    connect: {
                        id: reply
                    }
                }
            }
        })
    }
}
