import { CreateUserDTO, UpdateUserDTO } from "../dto/user";
import prisma from "../core/utils/prismaClient";
import fastifyJwt from "@fastify/jwt";
import bcrypt from 'bcrypt';
export const userService = () => ({

  findAll: async () => {
    const users = await prisma.user.findMany();
    return users;
  },

  findOne: async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  create: async (data: CreateUserDTO) => {
    data.password = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
      data,
    });

    
  },

  update: async (id: string, data: Partial<UpdateUserDTO>) => {
    const updatedAt = new Date();
    return prisma.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt,
      },
    });
  },

  delete: async (id:string) => {
    return prisma.user.delete({
      where: { id },
    });
  },

});
