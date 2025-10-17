import { FastifyReply, FastifyRequest } from "fastify";
import { commentService } from "../service/comment";
import { CreateCommentDTO, UpdateCommentDTO } from "../dto/comment";
const commentServiceInstance = commentService();

export const getComments = async (request: FastifyRequest, reply: FastifyReply) => {
    const comments = await commentServiceInstance.findAll();
    reply.status(200).send(comments);
}

export const getCommentById = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const comment = await commentServiceInstance.findOne(id);
    if (!comment) {
        reply.status(404).send({ message: 'Comment not found' });
        return;
    }
   reply.status(200).send(comment);
}

export const createComment = async (request: FastifyRequest, reply: FastifyReply) => {
    const newComment = request.body as CreateCommentDTO;
    const createdComment = await commentServiceInstance.create(newComment);
    reply.status(201).send(createdComment);
}

export const updateComment = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const user = request.user as { id: string, email: string, role: string };
    const updateData = request.body as Partial<UpdateCommentDTO>;
    const updatedComment = await commentServiceInstance.update(id, user, updateData);
    reply.status(200).send(updatedComment);
}

export const deleteComment = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const user = request.user as { id: string, email: string, role: string };
    await commentServiceInstance.delete(id, user);
    reply.status(204).send({ message: 'Comment deleted successfully' });
}