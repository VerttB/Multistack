import { FastifyReply, FastifyRequest } from "fastify";

export const adminVerify = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
    const userRole = (request.user as { role: string }).role;
    if (userRole !== 'admin') {
      return reply.status(403).send({ error: "Forbidden: Admins only" });
    }
  } catch (err) {
    return reply.status(401).send({ error: "Unauthorized" });
  }
};
