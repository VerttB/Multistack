import prisma from "../core/utils/prismaClient";
import bcrypt from "bcrypt";

export const authService = (() => ({
    login: async (email: string, password: string) => {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            throw new Error('User not found');
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }
       return user;
    }
}))