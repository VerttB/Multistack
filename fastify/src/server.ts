import Fastify from 'fastify';
import userRoutes from './routes/user';
import postRoutes from './routes/post';
import prismaPlugin from './db/prisma';
import commentRoutes from './routes/comment';
import jwt from '@fastify/jwt'
import dotenv from 'dotenv';

dotenv.config();

const fastify = Fastify({ logger: true });



fastify.register(jwt, {
  secret: process.env.JWT_SECRET!,
  
  sign: {
    expiresIn: '1h'
  },
});

 fastify.register(require('@fastify/swagger'), {
      swagger: {
        info: {
          title: 'My API Documentation',
          description: 'API documentation for my Fastify application',
          version: '1.0.0',
          tags: [
            { name: 'Users', description: 'User related endpoints' },
            { name: 'Posts', description: 'Post related endpoints' },
            { name: 'Comments', description: 'Comment related endpoints' },
          ],
        },
            },
    });

fastify.register(require('@fastify/swagger-ui'), {
      routePrefix: '/documentation', // Access Swagger UI at /documentation
    });


fastify.register(prismaPlugin);
fastify.register(userRoutes, { prefix: '/users' , name: 'Users' });
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
