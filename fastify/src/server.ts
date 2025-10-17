import Fastify from 'fastify';
import userRoutes from './routes/user';
import postRoutes from './routes/post';
import prismaPlugin from './db/prisma';
import commentRoutes from './routes/comment';
import jwt from '@fastify/jwt'
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import { registerErrorHandler } from './core/middleware/exceptionHandler';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

dotenv.config();

const fastify = Fastify({ logger: { level: 'info' } }).withTypeProvider<ZodTypeProvider>();

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

fastify.register(jwt, {
  secret: process.env.JWT_SECRET!,
  
  sign: {
    expiresIn: '1h'
  },
});


 fastify.register(require('@fastify/swagger'), {
      openapi: {
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
      transform: jsonSchemaTransform,
      exposeRoute: true,
    });

fastify.register(require('@fastify/swagger-ui'), {
      routePrefix: '/docs', 
    });



fastify.register(prismaPlugin);
fastify.register(userRoutes, { prefix: '/users' , name: 'Users' });
fastify.register(postRoutes, { prefix: '/posts' });
fastify.register(commentRoutes, { prefix: '/comments' });
fastify.register(authRoutes, { prefix: '/auth' });

registerErrorHandler(fastify);

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
