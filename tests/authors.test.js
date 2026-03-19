const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/db/pool');

beforeEach(async () => {
  await pool.query('TRUNCATE TABLE posts, authors RESTART IDENTITY CASCADE');
});

afterAll(async () => {
  await pool.end();
});

describe('Authors API', () => {
  test('POST /authors crea un autor', async () => {
    const response = await request(app)
      .post('/authors')
      .send({
        name: 'Carlos Ruiz',
        email: 'carlos@example.com',
        bio: 'Autor de pruebas'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe('carlos@example.com');
  });

  test('GET /authors devuelve todos los autores', async () => {
    await pool.query(
      'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3)',
      ['Ana', 'ana@test.com', 'Bio Ana']
    );

    const response = await request(app).get('/authors');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBe(1);
  });

  test('GET /authors/:id devuelve un autor', async () => {
    const result = await pool.query(
      'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING id',
      ['Mario', 'mario@test.com', 'Bio Mario']
    );

    const response = await request(app).get(`/authors/${result.rows[0].id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data.id).toBe(result.rows[0].id);
  });

  test('PUT /authors/:id actualiza un autor', async () => {
    const result = await pool.query(
      'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING id',
      ['Laura', 'laura@test.com', 'Bio original']
    );

    const response = await request(app)
      .put(`/authors/${result.rows[0].id}`)
      .send({ bio: 'Bio actualizada' });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.bio).toBe('Bio actualizada');
  });

  test('POST /authors no permite email duplicado', async () => {
    await pool.query(
      'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3)',
      ['Ana', 'duplicado@test.com', 'Bio']
    );

    const response = await request(app)
      .post('/authors')
      .send({
        name: 'Otra Ana',
        email: 'duplicado@test.com',
        bio: 'Otra bio'
      });

    expect(response.statusCode).toBe(409);
    expect(response.body.success).toBe(false);
  });

  test('DELETE /authors/:id elimina un autor', async () => {
    const result = await pool.query(
      'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING id',
      ['Pedro', 'pedro@test.com', 'Bio Pedro']
    );

    const response = await request(app).delete(`/authors/${result.rows[0].id}`);

    expect(response.statusCode).toBe(204);
  });
});