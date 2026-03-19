const express = require('express');
const {
  getAllPosts,
  getPostById,
  getPostsByAuthorId,
  createPost,
  updatePost,
  deletePost
} = require('../services/posts.service');
const { validatePostInput, validateId } = require('../utils/validators');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const posts = await getAllPosts();
    res.status(200).json({
      success: true,
      data: posts
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const errors = validatePostInput(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors
      });
    }

    const post = await createPost(req.body);

    res.status(201).json({
      success: true,
      message: 'Post creado correctamente',
      data: post
    });
  } catch (error) {
    next(error);
  }
});

router.get('/author/:authorId', async (req, res, next) => {
  try {
    if (!validateId(req.params.authorId)) {
      return res.status(400).json({
        success: false,
        message: 'authorId inválido'
      });
    }

    const posts = await getPostsByAuthorId(req.params.authorId);

    res.status(200).json({
      success: true,
      data: posts
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    if (!validateId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'id inválido'
      });
    }

    const post = await getPostById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    if (!validateId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'id inválido'
      });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Debes enviar al menos un campo para actualizar'
      });
    }

    const errors = validatePostInput(req.body, true);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors
      });
    }

    const updated = await updatePost(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Post actualizado correctamente',
      data: updated
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (!validateId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'id inválido'
      });
    }

    const deleted = await deletePost(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;