import { AppError } from "../core/errors/AppError";
import { NotFoundError } from "../core/errors/exceptions";
import { checkPermission } from "../core/permissions/permissions";
import prisma from "../core/utils/prismaClient";

import { CreateCommentDTO, UpdateCommentDTO } from "../dto/comment";

export const commentService = () => ({
    findAll: async () => {
        return await prisma.comment.findMany();
    },
    findOne: async (id: string) => {
        return await prisma.comment.findUnique({
            where: { id}
        });
    },
    create: async (data: CreateCommentDTO) => {
        return await prisma.comment.create({
            data
        });
    },
    update: async (id: string,user:{ role: string, id: string }, data: UpdateCommentDTO) => {
        const comment = await prisma.comment.findUnique({
            where: { id }
        });

        if (!comment) {
            throw new NotFoundError('Comment not found');
        }

        checkPermission(user.role,"update","comment", user.id, comment!.authorId);
        return await prisma.comment.update({
            where: { id },
            data
        });
    },
    delete: async (id: string, user:{ role: string, id: string }) => {
         const comment = await prisma.comment.findUnique({
            where: { id }
        });
        if (!comment) {
            throw new NotFoundError('Comment not found');
        }

        checkPermission(user.role,"delete","comment", user.id, comment!.authorId);
        return await prisma.comment.delete({
            where: { id}
        });
    }
});