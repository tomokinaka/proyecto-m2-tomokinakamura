const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/db/pool');

beforeEach(async () => {
  await pool.query('TRUNCATE TABLE posts, authors RESTART IDENTITY CASCADE');
});

afterAll(async () => {
  await pool.end();
});

describe('Posts API', () => {
  test('POST /posts crea un post', async () => {
    const authorResult = await pool.query(
      'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING id',
      ['Autor Uno', 'autor1@test.com', 'Bio']
    );

    const response = await request(app)
      .post('/posts')
      .send({
        title: 'Nuevo post',
        content: 'Contenido del post',
        author_id: authorResult.rows[0].id
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
  });

  test('GET /posts devuelve todos los posts', async () => {
    const authorResult = await pool.query(
      'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING id',
      ['Autor Dos', 'autor2@test.com', 'Bio']
    );

    await pool.query(
      'INSERT INTO posts (title, content, author_id) VALUES ($1, $2, $3)',
      ['Post 1', 'Contenido 1', authorResult.rows[0].id]
    );

    const response = await request(app).get('/posts');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBe(1);
  });

  test('GET /posts/:id devuelve un post', async () => {
    const authorResult = await pool.query(
      'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING id',
      ['Autor Tres', 'autor3@test.com', 'Bio']
    );

    const postResult = await pool.query(
      'INSERT INTO posts (title, content, author_id) VALUES ($1, $2, $3) RETURNING id',
      ['Post por ID', 'Contenido por ID', authorResult.rows[0].id]
    );

    const response = await request(app).get(`/posts/${postResult.rows[0].id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data.id).toBe(postResult.rows[0].id);
  });

  test('GET /posts/author/:authorId devuelve posts por autor', async () => {
    const authorResult = await pool.query(
      'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING id',
      ['Autor Cuatro', 'autor4@test.com', 'Bio']
    );

    await pool.query(
      'INSERT INTO posts (title, content, author_id) VALUES ($1, $2, $3), ($4, $5, $6)',
      ['Post A', 'Contenido A', authorResult.rows[0].id, 'Post B', 'Contenido B', authorResult.rows[0].id]
    );

    const response = await request(app).get(`/posts/author/${authorResult.rows[0].id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(2);
  });

  test('POST /posts valida campos obligatorios', async () => {
    const response = await request(app)
      .post('/posts')
      .send({
        content: 'Sin title',
        author_id: 1
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('DELETE /posts/:id elimina un post', async () => {
    const authorResult = await pool.query(
      'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING id',
      ['Autor Cinco', 'autor5@test.com', 'Bio']
    );

    const postResult = await pool.query(
      'INSERT INTO posts (title, content, author_id) VALUES ($1, $2, $3) RETURNING id',
      ['Post a eliminar', 'Contenido', authorResult.rows[0].id]
    );

    const response = await request(app).delete(`/posts/${postResult.rows[0].id}`);

    expect(response.statusCode).toBe(204);
  });
});