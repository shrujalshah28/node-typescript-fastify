import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import { Env } from '../environment.js';

declare module 'fastify' {
  export interface FastifyInstance {
    env: Env;
  }
}

const fastifyEnv: FastifyPluginAsync<{ env: Env }> = async (fastify, options) => {
  fastify.decorate(
    'env',
    // https://github.com/af/envalid/issues/141
    // https://stackoverflow.com/a/34481052/5579680
    Object.create(
      Object.getPrototypeOf(options.env),
      Object.getOwnPropertyDescriptors(options.env),
    ),
  );
};

export default fp(fastifyEnv, '3.x');
