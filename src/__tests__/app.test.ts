import fastify from '../app.js';

describe('Fastify app test', () => {
  afterAll(() => {
    fastify.close();
  });

  test('GET /ping should return 200', async () => {
    const response = await fastify.inject({ method: 'GET', url: '/ping' });
    expect(response.statusCode).toBe(200);
    expect(response.json().message).toBe('pong');
  });

  test('GET /random-url should return 404', async () => {
    const response = await fastify.inject({ method: 'GET', url: '/random-url' });
    expect(response.statusCode).toBe(404);
  });
});
