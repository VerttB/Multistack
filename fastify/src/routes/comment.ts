import { FastifyInstance } from "fastify";
import { getCommentById, getComments, createComment, deleteComment, updateComment } from "../controller/comment";


async function commentRoutes(server: FastifyInstance) {
    server.get('', getComments);

    server.get('/:id', getCommentById);

    server.post('', createComment);

    server.delete('/:id', deleteComment);

    server.patch('/:id', updateComment);

}

export default commentRoutes;