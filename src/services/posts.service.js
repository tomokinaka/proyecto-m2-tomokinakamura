const pool = require('../db/pool');

async function getAllPosts() {
  const result = await pool.query(
    `SELECT p.id, p.title, p.content, p.author_id, p.created_at, p.updated_at,
            a.name AS author_name, a.email AS author_email
     FROM posts p
     JOIN authors a ON p.author_id = a.id
     ORDER BY p.id ASC`
  );
  return result.rows;
}

async function getPostById(id) {
  const result = await pool.query(
    `SELECT p.id, p.title, p.content, p.author_id, p.created_at, p.updated_at,
            a.name AS author_name, a.email AS author_email
     FROM posts p
     JOIN authors a ON p.author_id = a.id
     WHERE p.id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function getPostsByAuthorId(authorId) {
  const result = await pool.query(
    `SELECT id, title, content, author_id, created_at, updated_at
     FROM posts
     WHERE author_id = $1
     ORDER BY id ASC`,
    [authorId]
  );
  return result.rows;
}

async function createPost({ title, content, author_id }) {
  const result = await pool.query(
    `INSERT INTO posts (title, content, author_id)
     VALUES ($1, $2, $3)
     RETURNING id, title, content, author_id, created_at, updated_at`,
    [title.trim(), content.trim(), author_id]
  );
  return result.rows[0];
}

async function updatePost(id, data) {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.title !== undefined) {
    fields.push(`title = $${index++}`);
    values.push(data.title.trim());
  }

  if (data.content !== undefined) {
    fields.push(`content = $${index++}`);
    values.push(data.content.trim());
  }

  if (data.author_id !== undefined) {
    fields.push(`author_id = $${index++}`);
    values.push(data.author_id);
  }

  if (fields.length === 0) return null;

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const result = await pool.query(
    `UPDATE posts
     SET ${fields.join(', ')}
     WHERE id = $${index}
     RETURNING id, title, content, author_id, created_at, updated_at`,
    values
  );

  return result.rows[0] || null;
}

async function deletePost(id) {
  const result = await pool.query(
    'DELETE FROM posts WHERE id = $1 RETURNING id',
    [id]
  );
  return result.rows[0] || null;
}

module.exports = {
  getAllPosts,
  getPostById,
  getPostsByAuthorId,
  createPost,
  updatePost,
  deletePost
};