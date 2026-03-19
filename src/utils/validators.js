function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isPositiveInteger(value) {
  return Number.isInteger(Number(value)) && Number(value) > 0;
}

function validateAuthorInput(data, isPartial = false) {
  const errors = [];

  if (!isPartial || data.name !== undefined) {
    if (typeof data.name !== 'string' || data.name.trim() === '') {
      errors.push('name es obligatorio y debe ser un texto no vacío');
    }
  }

  if (!isPartial || data.email !== undefined) {
    if (typeof data.email !== 'string' || !isValidEmail(data.email)) {
      errors.push('email es obligatorio y debe tener formato válido');
    }
  }

  if (data.bio !== undefined && typeof data.bio !== 'string') {
    errors.push('bio debe ser un texto');
  }

  return errors;
}

function validatePostInput(data, isPartial = false) {
  const errors = [];

  if (!isPartial || data.title !== undefined) {
    if (typeof data.title !== 'string' || data.title.trim() === '') {
      errors.push('title es obligatorio y debe ser un texto no vacío');
    }
  }

  if (!isPartial || data.content !== undefined) {
    if (typeof data.content !== 'string' || data.content.trim() === '') {
      errors.push('content es obligatorio y debe ser un texto no vacío');
    }
  }

  if (!isPartial || data.author_id !== undefined) {
    if (!isPositiveInteger(data.author_id)) {
      errors.push('author_id es obligatorio y debe ser un entero positivo');
    }
  }

  return errors;
}

function validateId(id) {
  return isPositiveInteger(id);
}

module.exports = {
  validateAuthorInput,
  validatePostInput,
  validateId
};