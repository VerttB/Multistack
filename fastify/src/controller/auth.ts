import { FastifyReply, FastifyRequest } from "fastify";
import { authService } from "../service/auth";
import { userService } from "../service/user";
import { CreateUserDTO } from "../dto/user";

const authServiceInstance = authService();
const userServiceInstance = userService();

export const login = async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = request.body as { email: string, password: string };
    const user = await authServiceInstance.login(email, password);
    const token = await reply.jwtSign({ email, id: user.id, role: user.role });
    reply.status(200).send({ message: 'Login successful', token });
   
   
}

export const me = async (request: FastifyRequest, reply: FastifyReply) => {
    await request.jwtVerify();
    const userId = (request.user as { id: string }).id;
    const user = await authServiceInstance.me(userId);
    reply.status(200).send(user);
};

export const register = async (request: FastifyRequest, reply: FastifyReply) => {
    const newUser = request.body as CreateUserDTO;
    const user = await userServiceInstance.create(newUser);
    const token = await reply.jwtSign({ email: user.email, id: user.id, role: user.role });
    reply.status(201).send({ message: 'Registration successful', token });
};
