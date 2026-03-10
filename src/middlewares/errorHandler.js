// @desc    Middleware para manejar errores 404 (ruta no encontrada)
exports.notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// @desc    Middleware global de manejo de errores
exports.errorHandler = (err, req, res, next) => {
  // Log del error en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.error('=== ERROR ===');
    console.error('Message:', err.message);
    console.error('Stack:', err.stack);
    console.error('=============');
  }

  // Código de estado por defecto
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Error de Mongoose - ID inválido
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'ID inválido';
  }

  // Error de Mongoose - Validación
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map(error => error.message);
    message = errors.join(', ');
  }

  // Error de Mongoose - Duplicado (unique)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyPattern)[0];
    message = `El ${field} ya está registrado`;
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token inválido';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expirado';
  }

  // Respuesta de error
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
};

// @desc    Async handler - Wrapper para eliminar try-catch en controllers
exports.asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};