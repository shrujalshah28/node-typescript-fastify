import fastify from 'fastify';

const server = fastify({ logger: true });

server.get('/ping', async (_request, _reply) => {
  return 'pong\n';
});

(async () => {
  try {
    await server.listen(3000);

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
})();

process.on('SIGINT', async () => {
  process.exit(0);
});
