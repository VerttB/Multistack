import { FastifyInstance } from "fastify";
import { login } from "../controller/auth";


async function authRoutes(server: FastifyInstance) {
    server.post('/login', login);
    
    }

export default authRoutes;