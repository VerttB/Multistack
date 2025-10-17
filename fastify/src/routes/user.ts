import { FastifyInstance } from "fastify";
import { userController } from "../controller/user";
import { adminVerify } from "../core/middleware/adminVerify";
import { UserResponseSchema } from "../dto/user";
import { z } from "zod";
import { verifyJWT } from "../core/middleware/jwtVerify";

async function userRoutes(server: FastifyInstance) {
    const { getUsers, getUserById, createUser, updateUser, deleteUser } = userController(server);
    server.get('', {
        preHandler: adminVerify,
        schema: { 
            tags: ['Users'],
            summary: 'Get all users',
            description: 'Retrieve a list of all users registered in the system.',
            response: {
                200: z.array(UserResponseSchema)
            }
        }

    
    },getUsers);

    server.get('/:id',{
        schema: {
            tags: ['Users'],
            summary: 'Get a user by ID',
            description: 'Retrieve a single user by their ID.',
            response: {
                200: UserResponseSchema,
                404: z.object({ message: z.string() })
            }
        }
    } ,getUserById);
    
    server.post('', {
        preHandler: adminVerify,
        schema: {
            tags: ['Users'],
            summary: 'Create a new user',
            description: 'Create a new user with the provided information.',
            response: {
                201: UserResponseSchema
            }
        }
    }, createUser);

    server.patch('/:id', {
        preHandler: verifyJWT,
        schema: {
            tags: ['Users'],
            summary: 'Update a user by ID',
            description: 'Update a user by their ID. Only admins can update users.',
            response: {
                200: UserResponseSchema,
                404: z.object({ message: z.string() })
            }
        }
    }, updateUser);

    server.delete('/:id',{
        preHandler: adminVerify,
        schema: {
            tags: ['Users'],
            summary: 'Delete a user by ID',
            description: 'Delete a user by their ID. Only admins can delete users.',
            response: {
                204: z.object({ message: z.string() }),
                404: z.object({ message: z.string() })
            }
        }
    } , deleteUser);
    
    }

export default userRoutes;