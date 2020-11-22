import nodeURL from 'url';

import { cleanEnv, str, port, url, CleanEnv, makeValidator } from 'envalid';
import { LogLevel } from 'fastify';

const origins = makeValidator<string[]>((x: string) => {
  let origins: string[];
  try {
    origins = JSON.parse(x);
  } catch (error) {
    throw new Error(`Invalid urls: "${x}"`);
  }
  return origins.map((origin, index) => {
    try {
      const parseURL = new nodeURL.URL(origin);
      return parseURL.origin;
    } catch (e) {
      throw new Error(`Invalid url at position [${index}]: "${origin}"`);
    }
  });
}, 'origins');

type Environment = {
  NODE_ENV: string;
  PORT: number;
  SERVER_URL: string;
  LOG_LEVEL: LogLevel;
  WHITELIST_ORIGINS: string[];
};

export type Env = Readonly<Environment & CleanEnv>;

export const env: Env = cleanEnv<Environment>(process.env, {
  NODE_ENV: str({
    choices: ['production', 'test', 'development'],
    default: 'development',
  }),
  PORT: port({ default: 3000 }),
  SERVER_URL: url(),
  LOG_LEVEL: str({
    default: 'error',
    choices: ['info', 'warn', 'error', 'fatal', 'trace', 'debug'],
  }),
  WHITELIST_ORIGINS: origins({ default: undefined }),
});
