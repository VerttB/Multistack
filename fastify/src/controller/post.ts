import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { postService } from "../service/post";
import { CreatePostDTO, UpdatePostDTO, PostResponseDTO } from "../dto/post";


export const postController = (fastify: FastifyInstance) => {
    const postsServiceInstance = postService(fastify);
    return {
        getPosts: async (request: FastifyRequest, reply: FastifyReply) => {
            const posts: PostResponseDTO[] = await postsServiceInstance.findAll();
            reply.status(200).send(posts);
        },

        getPostById: async (request: FastifyRequest, reply: FastifyReply) => {
            const { id } = request.params as { id: string };
            const post = await postsServiceInstance.findOne(id);
            if (!post) {
            reply.status(404).send({ message: 'Post not found' });
            return;
                }
            reply.status(200).send(post);
            },

        createPost: async (request: FastifyRequest, reply: FastifyReply) => {
            const user = request.user as { id: string, email: string };
            const newPost = {
                ...(request.body as CreatePostDTO),
                authorId: user.id, 
            };
            const createdPost = await postsServiceInstance.create(newPost);
            reply.status(201).send(createdPost);
        },

        updatePost: async (request: FastifyRequest, reply: FastifyReply) => {
            const { id } = request.params as { id: string };
            const user = request.user as { id: string, email: string, role: string };
            const updateData = request.body as Partial<CreatePostDTO>;
                const updatedPost = await postsServiceInstance.update(id, user, updateData);
                reply.status(200).send(updatedPost);
            
        },

        deletePost: async (request: FastifyRequest, reply: FastifyReply) => {
            const { id } = request.params as { id: string };
            const user = request.user as { id: string, email: string, role: string };
            await postsServiceInstance.delete(id, user);
            reply.status(204).send();
        }
    };
};