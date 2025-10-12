import { FastifyInstance } from "fastify";
import { getPostById, getPosts, createPost, deletePost, updatePost } from "../controller/post";
import { verifyJWT } from "../core/config/jwt";

async function postRoutes(server: FastifyInstance) {
    server.get('', getPosts);

    server.get('/:id', getPostById);

    server.post('',{ preHandler: verifyJWT }, createPost);

    server.delete('/:id', { preHandler: verifyJWT }, deletePost);

    server.patch('/:id',{ preHandler: verifyJWT }, updatePost);

}

export default postRoutes;