import { FastifyInstance } from "fastify";
import { postController } from "../controller/post";
import { verifyJWT } from "../core/middleware/jwtVerify";
import { PostResponseDTO, PostResponseSchema, UpdatePostSchema } from "../dto/post";
import { z } from "zod";
async function postRoutes(server: FastifyInstance) {
    const { getPosts, getPostById, createPost, deletePost, updatePost } = postController(server);
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

    server.get('/:id', 
        {
            schema: {
                tags: ['Posts'],
                summary: 'Get a post by ID',
                description: 'Retrieve a single post by its ID.',
                response: {
                    200: PostResponseSchema,
                    404: z.object({ message: z.string() }),
                }
            }
        },getPostById);

    server.post('',{ 
        preHandler: verifyJWT, 
        schema: {
            tags: ['Posts'],
            summary: 'Create a new post',
            description: 'Create a new post with the provided title, content, and author ID.',
            response: {
                201: PostResponseSchema,
            }
        }
    }, createPost);

    server.delete('/:id', { 
        preHandler: verifyJWT,
        schema: {
            tags: ['Posts'],
            summary: 'Delete a post by ID',
            description: 'Delete a post by its ID. Only the author of the post or an admin can delete the post.',
            response: {
                204: z.object({ message: z.string() }),
                404: z.object({ message: z.string() }),
            }
        }
    
    
    }, deletePost);

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