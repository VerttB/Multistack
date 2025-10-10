import { FastifyReply, FastifyRequest } from "fastify";
import { userService } from "../service/user";
import { CreateUserDTO } from "../dto/user";
const userServiceInstance = userService();

export const getUsers = async (request: FastifyRequest, reply: FastifyReply) => {
    const users = await userServiceInstance.findAll();
    reply.status(200).send(users);
}

export const getUserById = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const user = await userServiceInstance.findOne(id);
    if (!user) {
        reply.status(404).send({ message: 'User not found' });
        return;
    }
   reply.status(200).send(user);
}

export const createUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const newUser = request.body as CreateUserDTO;
    const createdUser = await userServiceInstance.create(newUser);
    reply.status(201).send(createdUser);
}

export const updateUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const updateData = request.body as Partial<CreateUserDTO>;
    const updatedUser = await userServiceInstance.update(id, updateData);
    reply.status(200).send(updatedUser);
}

export const deleteUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    await userServiceInstance.delete(id);
    reply.status(204).send();
}