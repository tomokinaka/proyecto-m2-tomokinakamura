function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'Conflicto: ya existe un registro con ese valor único',
      detail: err.detail
    });
  }

  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      message: 'Relación inválida: author_id no existe',
      detail: err.detail
    });
  }

  if (err.code === '22P02') {
    return res.status(400).json({
      success: false,
      message: 'Parámetro inválido'
    });
  }

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor'
  });
}

module.exports = errorHandler;