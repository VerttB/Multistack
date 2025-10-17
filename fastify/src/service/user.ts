import { CreateUserDTO, UpdateUserDTO } from "../dto/user";
import bcrypt from 'bcrypt';
import { FastifyInstance } from "fastify";
export const userService = (fastify: FastifyInstance) => ({

  findAll: async () => {
    const users = await fastify.prisma.user.findMany();
    return users;
  },

  findOne: async (id: string) => {
    return fastify.prisma.user.findUnique({
      where: { id },
    });
  },

  create: async (data: CreateUserDTO) => {
    data.password = await bcrypt.hash(data.password, 10);
    return fastify.prisma.user.create({
      data,
    });

    
  },

  update: async (id: string, data: Partial<UpdateUserDTO>) => {
    const updatedAt = new Date();
    return fastify.prisma.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt,
      },
    });
  },

  delete: async (id:string) => {
    return fastify.prisma.user.delete({
      where: { id },
    });
  },

});
