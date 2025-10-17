import { User } from "@prisma/client";
import { checkPermission } from "../core/permissions/permissions";
import prisma from "../core/utils/prismaClient";
import { CreatePostDTO, UpdatePostDTO } from "../dto/post";
import { AppError } from "../core/errors/AppError";

export const postService = () => ({
    findAll: async () => {
        return await prisma.post.findMany({
            select: { id: true, title: true, content: true , authorId: true}
        });
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
    update: async (id: string,user: { role: string, id: string }, data: UpdatePostDTO) => {
        const post = await prisma.post.findUnique({
            where: { id }
        });
        console.log("Post achado", post);
        if (!post) {
            throw new AppError('Post not found', 404);
            
        }
        checkPermission(user.role,"update","post", user.id, post!.authorId);

        return await prisma.post.update({
            where: { id },
            data
        });
    },
    delete: async (id: string, user: { role: string, id: string }) => {
        const post = await prisma.post.findUnique({
            where: { id }
        });

        if (!post) {
            throw new AppError('Post not found', 404);
        }

        checkPermission(user.role,"delete","post", user.id, post!.authorId);

        return await prisma.post.delete({
            where: { id }
        });
    }

})