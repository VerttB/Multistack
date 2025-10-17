import { FastifyInstance } from "fastify";
import { commentController } from "../controller/comment";
import { verifyJWT } from "../core/middleware/jwtVerify";
import { CommentResponseSchema } from "../dto/comment";

import {z} from "zod";
async function commentRoutes(server: FastifyInstance) {
    const { getComments, getCommentById, createComment, deleteComment, updateComment } = commentController(server);
    server.get('',{
        schema: {
            tags: ['Comments'],
            summary: 'Get all comments',
            description: 'Retrieve a list of all comments available in the system.',
            response: {
                200: z.array(CommentResponseSchema),
                204: z.object({ message: z.string() })
            }
        }
    }, getComments);

    server.get('/:id',{
        schema: {
            tags: ['Comments'],
            summary: 'Get a comment by ID',
            description: 'Retrieve a single comment by its ID.',
            response: {
                200: CommentResponseSchema,
                404: z.object({ message: z.string() }),
            }
        }
    }, getCommentById);

    server.post('', { 
        preHandler: verifyJWT, 
        schema: {
            tags: ['Comments'],
            summary: 'Create a new comment',
            description: 'Create a new comment with the provided content, author ID, and post ID.',
            response: {
                201: CommentResponseSchema,
                404: z.object({ message: z.string() }),
            }
        }
    
    }, createComment);

    server.delete('/:id', { 
        preHandler: verifyJWT,
        schema: {
            tags: ['Comments'],
            summary: 'Delete a comment by ID',
            description: 'Delete a comment by its ID. Only the author of the comment or an admin can delete the comment.',
            response: {
                204: z.object({ message: z.string() }),
                404: z.object({ message: z.string() }),
            }
        }

    
    }, deleteComment);

    server.patch('/:id', { 
        preHandler: verifyJWT,
        schema: {
            tags: ['Comments'],
            summary: 'Update a comment by ID',
            description: 'Update a comment by its ID. Only the author of the comment or an admin can update the comment.',
            response: {
                200: CommentResponseSchema,
                404: z.object({ message: z.string() }),
            }
        }
        
    
    }, updateComment);

}

export default commentRoutes;