const express = require('express');
const {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
} = require('../services/authors.service.js');
const { validateAuthorInput, validateId } = require('../utils/validators');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const authors = await getAllAuthors();
    res.status(200).json({
      success: true,
      data: authors
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const errors = validateAuthorInput(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors
      });
    }

    const author = await createAuthor(req.body);

    res.status(201).json({
      success: true,
      message: 'Autor creado correctamente',
      data: author
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

    const author = await getAuthorById(req.params.id);

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Autor no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: author
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

    const errors = validateAuthorInput(req.body, true);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors
      });
    }

    const updated = await updateAuthor(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Autor no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Autor actualizado correctamente',
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

    const deleted = await deleteAuthor(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Autor no encontrado'
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;