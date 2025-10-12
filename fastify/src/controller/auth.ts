import { FastifyReply, FastifyRequest } from "fastify";
import { authService } from "../service/auth";

const authServiceInstance = authService();

export const login = async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = request.body as { email: string, password: string };
    try {
        const user = await authServiceInstance.login(email, password);
        const token = await reply.jwtSign({ email, id: user.id });
        reply.status(200).send({ message: 'Login successful', token });
    } catch (error) {
        reply.status(401).send({ message: error});
    }
}
