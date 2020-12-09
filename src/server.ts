import fastify from 'fastify';

import { env } from './environment.js';

const server = fastify({ logger: { level: env.LOG_LEVEL, prettyPrint: env.isDev } });

server.register(import('./plugins/envalid.js'), { env });
server.register(import('fastify-helmet'));
server.register(import('fastify-cors'), { origin: env.ALLOWED_ORIGINS, credentials: true });
server.register(import('fastify-cookie'));
server.register(import('fastify-compress'));

server.get('/ping', async (_request, _reply) => {
  return 'pong\n';
});

try {
  await server.listen(env.PORT);

  /**
   * Note:
   *
   * Below line send single to PM2 to indicate server (instance)
   * is ready to accept the request.
   *
   * @see https://pm2.keymetrics.io/docs/usage/signals-clean-restart/
   */
  process.send && process.send('ready');
} catch (err) {
  server.log.error(err);
  process.exit(1);
}

process.on('SIGINT', async () => {
  process.exit(0);
});
