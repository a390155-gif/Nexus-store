/**
 * middleware/error.middleware.js - Manejador de errores centralizado
 * Captura todos los errores de la aplicación y devuelve respuestas consistentes
 */

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Error interno del servidor';

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map((e) => e.message);
    message = errors.join(', ');
  }

  // Error de duplicado en MongoDB (email ya registrado, etc.)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Ya existe un registro con ese ${field}.`;
  }

  // ID de MongoDB inválido
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `ID inválido: ${err.value}`;
  }

  // Registrar error en consola (solo en desarrollo)
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[ERROR] ${statusCode} - ${message}`);
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

module.exports = errorHandler;
