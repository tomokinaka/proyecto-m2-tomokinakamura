const pool = require('../db/pool');

async function getAllAuthors() {
  const result = await pool.query(
    'SELECT id, name, email, bio, created_at, updated_at FROM authors ORDER BY id ASC'
  );
  return result.rows;
}

async function getAuthorById(id) {
  const result = await pool.query(
    'SELECT id, name, email, bio, created_at, updated_at FROM authors WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

async function createAuthor({ name, email, bio }) {
  const result = await pool.query(
    `INSERT INTO authors (name, email, bio)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, bio, created_at, updated_at`,
    [name.trim(), email.trim().toLowerCase(), bio || null]
  );
  return result.rows[0];
}

async function updateAuthor(id, data) {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.name !== undefined) {
    fields.push(`name = $${index++}`);
    values.push(data.name.trim());
  }

  if (data.email !== undefined) {
    fields.push(`email = $${index++}`);
    values.push(data.email.trim().toLowerCase());
  }

  if (data.bio !== undefined) {
    fields.push(`bio = $${index++}`);
    values.push(data.bio);
  }

  if (fields.length === 0) return null;

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const result = await pool.query(
    `UPDATE authors
     SET ${fields.join(', ')}
     WHERE id = $${index}
     RETURNING id, name, email, bio, created_at, updated_at`,
    values
  );

  return result.rows[0] || null;
}

async function deleteAuthor(id) {
  const result = await pool.query(
    'DELETE FROM authors WHERE id = $1 RETURNING id',
    [id]
  );
  return result.rows[0] || null;
}

module.exports = {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
};