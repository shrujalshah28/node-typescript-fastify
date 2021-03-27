import nodeURL from 'url';

import envalid, { CleanedEnvAccessors } from 'envalid';
import dotenv from 'dotenv';
// import { LogLevel } from 'fastify';

const { cleanEnv, str, port, url, makeValidator } = envalid;

dotenv.config();

const origins = makeValidator<string[]>((x: string) => {
  let origins: string[];
  try {
    origins = JSON.parse(x);
  } catch (error) {
    /* istanbul ignore next */
    throw new Error(`Invalid urls: "${x}"`);
  }
  return origins.map((origin, index) => {
    try {
      const parseURL = new nodeURL.URL(origin);
      return parseURL.origin;
    } catch (e) {
      /* istanbul ignore next */
      throw new Error(`Invalid url at position [${index}]: "${origin}"`);
    }
  });
});

type Environment = {
  NODE_ENV: string;
  PORT: number;
  SERVER_URL: string;
  LOG_LEVEL: string; // LogLevel;
  ALLOWED_ORIGINS: string[];
};

export type Env = Readonly<Environment & CleanedEnvAccessors>;

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
  ALLOWED_ORIGINS: origins({ default: undefined }),
});
