import fastify from 'fastify';

import { env } from './environment.js';

const server = fastify({ logger: { level: env.LOG_LEVEL, prettyPrint: env.isDev } });

server.register(import('./plugins/envalid.js'), { env });
server.register(import('fastify-helmet'));
server.register(import('fastify-cors'), { origin: env.ALLOWED_ORIGINS, credentials: true });
server.register(import('fastify-cookie'));
server.register(import('fastify-compress'));

server.get('/ping', async (_request, _reply) => {
  return { message: 'pong' };
});

export default server;
