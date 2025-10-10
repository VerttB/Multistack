import prisma from "../core/utils/prismaClient";
import { CreatePostDTO, UpdatePostDTO } from "../dto/post";

export const postService = () => ({
    findAll: async () => {
        return await prisma.post.findMany();
    },
    findOne: async (id: string) => {
        return await prisma.post.findUnique({
            where: { id }
        });
    },
    create: async (data: CreatePostDTO) => {
        return await prisma.post.create({
            data
        });
    },
    update: async (id: string, data: UpdatePostDTO) => {
        return await prisma.post.update({
            where: { id },
            data
        });
    },
    delete: async (id: string) => {
        return await prisma.post.delete({
            where: { id }
        });
    }

})