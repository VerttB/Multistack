import { Role } from "@prisma/client";
import { z } from "zod";
export const CreateUserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    role: z.enum(Role)
}); 

export const UpdateUserSchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).max(100).optional(),
    role: z.enum(Role).optional()
});

export const UserResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const DeleteUserSchema = z.object({ 
    id: z.number()
});
export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
export type UserResponseDTO = z.infer<typeof UserResponseSchema>;
export type DeleteUserDTO = z.infer<typeof DeleteUserSchema>;


