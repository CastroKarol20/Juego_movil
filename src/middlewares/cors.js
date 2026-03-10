// @desc    Configuración de CORS personalizada
exports.corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (como apps móviles, Postman)
    if (!origin) return callback(null, true);

    // Lista blanca de dominios permitidos
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173', // Vite default
      'http://localhost:8080',
      // Agregar tus dominios de producción aquí
      // 'https://mindforge.com',
    ];

    if (process.env.NODE_ENV === 'development') {
      // En desarrollo, permitir cualquier origin
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};