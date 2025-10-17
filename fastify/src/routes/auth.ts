import { FastifyInstance } from "fastify";
import { authController} from "../controller/auth";
import { z } from "zod";
import { UserResponseSchema } from "../dto/user";

async function authRoutes(server: FastifyInstance) {
    const { login, me, register } = authController(server);
    server.post('/login',{
        schema: {
            tags: ['Auth'],
            summary: 'User login',
            description: 'Authenticate a user and return a JWT token.',
            response: {
                200: z.object({ message: z.string(), token: z.string() }),
                401: z.object({ message: z.string() }),
            }
        }
    }, login);
    server.post('/me', {
        schema: {
            tags: ['Auth'],
            summary: 'Get current user',
            description: 'Retrieve the currently authenticated user.',
            response: {
                200: UserResponseSchema,
                401: z.object({ message: z.string() }),
            }
        }
    }, me);
    server.post('/register', {
        schema: {
            tags: ['Auth'],
            summary: 'User registration',
            description: 'Register a new user and return a JWT token.',
            response: {
                201: z.object({ user: UserResponseSchema, token: z.string() }),
                400: z.object({ message: z.string() }),
            }
        }
    }, register);
    }

export default authRoutes;