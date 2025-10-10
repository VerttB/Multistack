
import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";
import { FastifyPluginAsync } from "fastify";
declare module 'fastify'{
    interface FastifyInstance{
        prisma: PrismaClient
    }
}

const prismaPlugin: FastifyPluginAsync = fp(async (fastify) => {
    const prisma = new PrismaClient();
    await prisma.$connect();
    fastify.decorate('prisma', prisma);

    fastify.addHook('onClose', async (fastify) => {
        await fastify.prisma.$disconnect();
        fastify.log.info('Prisma client disconnected');
    });

});

export default prismaPlugin;
