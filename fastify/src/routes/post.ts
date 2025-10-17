import { FastifyInstance } from "fastify";
import { getPostById, getPosts, createPost, deletePost, updatePost } from "../controller/post";
import { verifyJWT } from "../core/middleware/jwtVerify";
import { PostResponseDTO, PostResponseSchema, UpdatePostSchema } from "../dto/post";
import { z } from "zod";
async function postRoutes(server: FastifyInstance) {
    server.get('',{
        schema: { 
            tags: ['Posts'],
            summary: 'Get all posts',
            description: 'Retrieve a list of all posts available in the system.',
            response: {
                200: z.array(PostResponseSchema)
            }
        }
    } ,getPosts);

    server.get('/:id', getPostById);

    server.post('',{ preHandler: verifyJWT }, createPost);

    server.delete('/:id', { preHandler: verifyJWT }, deletePost);

    server.patch('/:id',
        { preHandler: verifyJWT,
            schema: {
                tags: ['Posts'],
                summary: 'Update a post by ID',
                description: 'Update a post by its ID. You can update the title and/or content of the post.',
                body: UpdatePostSchema,
                response:{
                    200: PostResponseSchema,
                    404: z.object({ message: z.string() }),
                }
            }
        },
        updatePost);

}

export default postRoutes;