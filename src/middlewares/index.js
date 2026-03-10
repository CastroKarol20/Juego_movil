// Exportar todos los middlewares desde un solo lugar

const { protect, authorize, optionalAuth } = require('./authMiddleware');
const { notFound, errorHandler, asyncHandler } = require('./errorHandler');
const {
  validateFields,
  validateEmail,
  validatePassword,
  validateUsername,
  validateObjectId,
  validatePagination,
  sanitizeInput,
  rateLimit
} = require('./validateRequest');
const { requestLogger, errorLogger } = require('./logger');
const { corsOptions } = require('./cors');

module.exports = {
  // Auth
  protect,
  authorize,
  optionalAuth,
  
  // Error handling
  notFound,
  errorHandler,
  asyncHandler,
  
  // Validation
  validateFields,
  validateEmail,
  validatePassword,
  validateUsername,
  validateObjectId,
  validatePagination,
  sanitizeInput,
  rateLimit,
  
  // Logging
  requestLogger,
  errorLogger,
  
  // CORS
  corsOptions
};