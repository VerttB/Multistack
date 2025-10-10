import { FastifyInstance } from "fastify";
import { getPostById, getPosts, createPost, deletePost, updatePost } from "../controller/post";

async function postRoutes(server: FastifyInstance) {
    server.get('', getPosts);

    server.get('/:id', getPostById);

    server.post('', createPost);

    server.delete('/:id', deletePost);

    server.patch('/:id', updatePost);

}

export default postRoutes;