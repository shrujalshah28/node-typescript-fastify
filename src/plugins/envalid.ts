import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import { Env } from '../environment.js';

declare module 'fastify' {
  export interface FastifyInstance {
    env: Env;
  }
}

const fastifyEnv: FastifyPluginAsync<{ env: Env }> = async (fastify, options) => {
  fastify.decorate('env', options.env);
};

export default fp(fastifyEnv, '3.x');
