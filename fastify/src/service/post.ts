import { checkPermission } from "../core/permissions/permissions";
import { CreatePostDTO, UpdatePostDTO } from "../dto/post";
import { AppError } from "../core/errors/AppError";
import { FastifyInstance } from "fastify";

export const postService = (fastify: FastifyInstance) => ({
    findAll: async () => {
        return await fastify.prisma.post.findMany({
            select: { id: true, title: true, content: true , authorId: true}
        });
    },
    findOne: async (id: string) => {
        return await fastify.prisma.post.findUnique({
            where: { id }
        });
    },
    create: async (data: CreatePostDTO) => {
        return await fastify.prisma.post.create({
            data
        });
    },
    update: async (id: string,user: { role: string, id: string }, data: UpdatePostDTO) => {
        const post = await fastify.prisma.post.findUnique({
            where: { id }
        });
        console.log("Post achado", post);
        if (!post) {
            throw new AppError('Post not found', 404);
            
        }
        checkPermission(user.role,"update","post", user.id, post!.authorId);

        return await fastify.prisma.post.update({
            where: { id },
            data
        });
    },
    delete: async (id: string, user: { role: string, id: string }) => {
        const post = await fastify.prisma.post.findUnique({
            where: { id }
        });

        if (!post) {
            throw new AppError('Post not found', 404);
        }

        checkPermission(user.role,"delete","post", user.id, post!.authorId);

        return await fastify.prisma.post.delete({
            where: { id }
        });
    }

})