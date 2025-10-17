import { FastifyInstance } from "fastify";
import { NotFoundError, UnauthorizedError } from "../core/errors/exceptions";
import bcrypt from "bcrypt";

export const authService = ((fastify: FastifyInstance) => ({
    login: async (email: string, password: string) => {
        const user = await fastify.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            throw new Error('User not found');
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new UnauthorizedError('Invalid credentials');
        }
       return user;
    },
    me: async (userId : string) => {
        const user = await fastify.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true }
        });
        if (!user) {
            throw new NotFoundError('User not found');
        }
        return user;
    }


}))