import { FastifyInstance } from "fastify";
import { AppError } from "../core/errors/AppError";
import { checkPermission } from "../core/permissions/permissions";

import { CreateCommentDTO, UpdateCommentDTO } from "../dto/comment";

export const commentService = (fastify:FastifyInstance) => ({
    findAll: async () => {
        return await fastify.prisma.comment.findMany();
    },
    findOne: async (id: string) => {
        return await fastify.prisma.comment.findUnique({
            where: { id}
        });
    },
    create: async (data: CreateCommentDTO) => {
        return await fastify.prisma.comment.create({
            data
        });
    },
    update: async (id: string,user:{ role: string, id: string }, data: UpdateCommentDTO) => {
        const comment = await fastify.prisma.comment.findUnique({
            where: { id }
        });

        if (!comment) {
            throw new AppError('Comment not found', 404);
        }

        checkPermission(user.role,"update","comment", user.id, comment!.authorId);
        return await fastify.prisma.comment.update({
            where: { id },
            data
        });
    },
    delete: async (id: string, user:{ role: string, id: string }) => {
         const comment = await fastify.prisma.comment.findUnique({
            where: { id }
        });
        console.log("Comment achado", comment);
        if (!comment) {
            throw new AppError('Comment not found', 404);
        }

        checkPermission(user.role,"delete","comment", user.id, comment!.authorId);
        return await fastify.prisma.comment.delete({
            where: { id}
        });
    }
});