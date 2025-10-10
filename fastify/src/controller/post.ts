import { FastifyReply, FastifyRequest } from "fastify";
import { postService } from "../service/post";
import { CreatePostDTO, UpdatePostDTO, PostResponseDTO } from "../dto/post";
import user from "../routes/user";
const postsServiceInstance = postService();

export const getPosts = async (request: FastifyRequest, reply: FastifyReply) => {
    const posts: PostResponseDTO[] = await postsServiceInstance.findAll();
    reply.status(200).send(posts);
}

export const getPostById = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const post = await postsServiceInstance.findOne(id);
    if (!post) {
        reply.status(404).send({ message: 'Post not found' });
        return;
    }
   reply.status(200).send(post);
}

export const createPost = async (request: FastifyRequest, reply: FastifyReply) => {
    const newPost = request.body as CreatePostDTO;
    const createdPost = await postsServiceInstance.create(newPost);
    reply.status(201).send(createdPost);
}

export const updatePost = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const updateData = request.body as Partial<CreatePostDTO>;
    const updatedPost = await postsServiceInstance.update(id, updateData);
    reply.status(200).send(updatedPost);
}

export const deletePost = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    await postsServiceInstance.delete(id);
    reply.status(204).send();
}