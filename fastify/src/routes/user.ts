import { FastifyInstance } from "fastify";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "../controller/user";


async function userRoutes(server: FastifyInstance) {
    server.get('',getUsers);

    server.get('/:id', getUserById);
    
    server.post('', createUser);

    server.patch('/:id', updateUser);

    server.delete('/:id', deleteUser);
    }

export default userRoutes;