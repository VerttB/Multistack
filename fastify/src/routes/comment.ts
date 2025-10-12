import { FastifyInstance } from "fastify";
import { getCommentById, getComments, createComment, deleteComment, updateComment } from "../controller/comment";
import { verifyJWT } from "../core/config/jwt";


async function commentRoutes(server: FastifyInstance) {
    server.get('', getComments);

    server.get('/:id', getCommentById);

    server.post('',{ preHandler: verifyJWT }, createComment);

    server.delete('/:id', { preHandler: verifyJWT }, deleteComment);

    server.patch('/:id', { preHandler: verifyJWT }, updateComment);

}

export default commentRoutes;