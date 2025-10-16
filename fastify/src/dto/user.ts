import { Role } from "@prisma/client";

export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    role: Role
}

export interface UpdateUserDTO {
    name?: string;
    email?: string;
    password?: string;
}

export interface UserResponseDTO {
    id: number;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface DeleteUserDTO {
    id: String;
}

