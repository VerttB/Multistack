import { FastifyInstance } from "fastify";
import { AppError } from "../errors/AppError";
export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      reply.status(error.statusCode).send({ message: error.message });
    } else {
      console.error("Unexpected error:", error);
      reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
