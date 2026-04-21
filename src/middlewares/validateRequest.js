// @desc    Validar que vengan los campos requeridos
exports.validateFields = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = [];

    for (const field of requiredFields) {
      // Soportar campos anidados con dot notation (ej: 'user.email')
      const value = field.split('.').reduce((obj, key) => obj?.[key], req.body);
      
      if (value === undefined || value === null || value === '') {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Campos requeridos faltantes: ${missingFields.join(', ')}`
      });
    }

    next();
  };
};

// @desc    Validar formato de email
exports.validateEmail = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next();
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Formato de email inválido'
    });
  }

  next();
};

// @desc    Validar longitud de password
exports.validatePassword = (req, res, next) => {
  const { password, newPassword } = req.body;
  const pwd = password || newPassword;

  if (!pwd) {
    return next();
  }

  if (pwd.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'La contraseña debe tener al menos 6 caracteres'
    });
  }

  if (pwd.length > 50) {
    return res.status(400).json({
      success: false,
      message: 'La contraseña no puede exceder 50 caracteres'
    });
  }

  next();
};

// @desc    Validar formato de username
exports.validateUsername = (req, res, next) => {
  const { username } = req.body;

  if (!username) {
    return next();
  }

  // Solo letras, números, guiones y guiones bajos
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;

  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      success: false,
      message: 'El username solo puede contener letras, números, guiones y guiones bajos'
    });
  }

  if (username.length < 3) {
    return res.status(400).json({
      success: false,
      message: 'El username debe tener al menos 3 caracteres'
    });
  }

  if (username.length > 20) {
    return res.status(400).json({
      success: false,
      message: 'El username no puede exceder 20 caracteres'
    });
  }

  next();
};

// @desc    Validar ObjectId de MongoDB
exports.validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const mongoose = require('mongoose');
    const id = req.params[paramName];

    if (!id) {
      return res.status(400).json({
        success: false,
        message: `${paramName} es requerido`
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `${paramName} inválido`
      });
    }

    next();
  };
};

// @desc    Validar paginación
exports.validatePagination = (req, res, next) => {
  let { page, limit } = req.query;

  // Defaults
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;

  // Límites
  if (page < 1) page = 1;
  if (limit < 1) limit = 1;
  if (limit > 100) limit = 100;

  // Agregar a la request
  req.pagination = {
    page,
    limit,
    skip: (page - 1) * limit
  };

  next();
};

// @desc    Sanitizar input (prevenir XSS básico)
exports.sanitizeInput = (req, res, next) => {
  const sanitize = (obj, keyName) => {
    // No sanitizar campos sensibles relacionados con passwords
    if (typeof keyName === 'string' && keyName.toLowerCase().includes('password')) {
      return obj;
    }

    if (typeof obj === 'string') {
      return obj
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    }
    
    if (typeof obj === 'object' && obj !== null) {
      for (let key in obj) {
        obj[key] = sanitize(obj[key], key);
      }
    }
    
    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }

  if (req.query) {
    req.query = sanitize(req.query);
  }

  if (req.params) {
    req.params = sanitize(req.params);
  }

  next();
};

// @desc    Rate limiting simple (prevenir spam)
const requestCounts = new Map();

exports.rateLimit = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutos
    max = 100, // 100 requests por ventana
    message = 'Demasiadas solicitudes, por favor intenta más tarde'
  } = options;

  return (req, res, next) => {
    const identifier = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requestCounts.has(identifier)) {
      requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const record = requestCounts.get(identifier);

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
      return next();
    }

    if (record.count >= max) {
      return res.status(429).json({
        success: false,
        message
      });
    }

    record.count++;
    next();
  };
};

// Limpiar registros viejos cada hora
setInterval(() => {
  const now = Date.now();
  for (let [key, value] of requestCounts.entries()) {
    if (now > value.resetTime) {
      requestCounts.delete(key);
    }
  }
}, 60 * 60 * 1000);