import { CreateUserDTO, UpdateUserDTO } from "../dto/user";
import prisma from "../core/utils/prismaClient";
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
