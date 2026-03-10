// @desc    Logger de requests
exports.requestLogger = (req, res, next) => {
  const start = Date.now();

  // Capturar cuando la respuesta termine
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      timestamp: new Date().toISOString()
    };

    // Colorear según el status code
    let color = '\x1b[0m'; // Reset
    if (res.statusCode >= 500) color = '\x1b[31m'; // Rojo
    else if (res.statusCode >= 400) color = '\x1b[33m'; // Amarillo
    else if (res.statusCode >= 300) color = '\x1b[36m'; // Cyan
    else if (res.statusCode >= 200) color = '\x1b[32m'; // Verde

    console.log(
      `${color}[${log.timestamp}] ${log.method} ${log.url} - ${log.status} - ${log.duration}\x1b[0m`
    );
  });

  next();
};

// @desc    Logger de errores
exports.errorLogger = (err, req, res, next) => {
  console.error('\x1b[31m=== ERROR LOGGED ===\x1b[0m');
  console.error('Time:', new Date().toISOString());
  console.error('Method:', req.method);
  console.error('URL:', req.originalUrl);
  console.error('IP:', req.ip || req.connection.remoteAddress);
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  console.error('\x1b[31m====================\x1b[0m');
  
  next(err);
};
