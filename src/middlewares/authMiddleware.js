const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Proteger rutas - Verificar JWT
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Verificar si el token viene en los headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Verificar si existe el token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado. Token no proporcionado'
      });
    }

    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar usuario
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Usuario inactivo'
        });
      }

      // Agregar usuario a la request
      req.user = user;
      next();

    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expirado. Por favor inicia sesión nuevamente'
        });
      }

      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Token inválido'
        });
      }

      throw error;
    }

  } catch (error) {
    console.error('Error en protect middleware:', error);
    res.status(500).json({
      success: false,
      message: 'Error en autenticación'
    });
  }
};

// @desc    Verificar si el usuario es administrador (opcional para futuro)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
    }

    // Verificar si el usuario tiene el rol requerido
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para realizar esta acción'
      });
    }

    next();
  };
};

// @desc    Middleware opcional - permite acceso con o sin token
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Si el token es inválido, simplemente continuar sin usuario
        console.log('Token inválido en optionalAuth, continuando sin usuario');
      }
    }

    next();

  } catch (error) {
    console.error('Error en optionalAuth middleware:', error);
    next();
  }
};