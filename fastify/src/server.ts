import Fastify from 'fastify';
import userRoutes from './routes/user';
import postRoutes from './routes/post';
import prismaPlugin from './db/prisma';
import commentRoutes from './routes/comment';
import ScalarApiReference from '@scalar/fastify-api-reference'
const fastify = Fastify({ logger: true });





fastify.register(prismaPlugin);
fastify.register(userRoutes, { prefix: '/users' });
fastify.register(postRoutes, { prefix: '/posts' });
fastify.register(commentRoutes, { prefix: '/comments' });


const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
