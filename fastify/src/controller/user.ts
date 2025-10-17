import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { userService } from "../service/user";
import { CreateUserDTO } from "../dto/user";

export const userController = (fastify: FastifyInstance) => {
  const service = userService(fastify);

  return {
    getUsers: async (request: FastifyRequest, reply: FastifyReply) => {
      const users = await service.findAll();
      reply.status(200).send(users);
    },

    getUserById: async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const user = await service.findOne(id);
      if (!user) {
        reply.status(404).send({ message: "User not found" });
        return;
      }
      reply.status(200).send(user);
    },

    createUser: async (request: FastifyRequest, reply: FastifyReply) => {
      const newUser = request.body as CreateUserDTO;
      const createdUser = await service.create(newUser);
      const token = await reply.jwtSign({
        id: createdUser.id,
        email: createdUser.email,
      });
      reply.status(201).send({ createdUser, token });
    },

    updateUser: async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const updateData = request.body as Partial<CreateUserDTO>;
      const updatedUser = await service.update(id, updateData);
      reply.status(200).send(updatedUser);
    },

    deleteUser: async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      await service.delete(id);
      reply.status(204).send({ message: "User deleted successfully" });
    },
  };
};
