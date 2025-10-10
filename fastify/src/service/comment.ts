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
    update: async (id: string, data: UpdateCommentDTO) => {
        return await prisma.comment.update({
            where: { id },
            data
        });
    },
    delete: async (id: string) => {
        return await prisma.comment.delete({
            where: { id}
        });
    }
});