require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const gameRoutes = require('./routes/gameRoutes');
const rankingRoutes = require('./routes/rankingRoutes');
const achievementRoutes = require('./routes/achievementRoutes');

const { notFound, errorHandler } = require('./middlewares/errorHandler');
const { requestLogger } = require('./middlewares/logger');
const { sanitizeInput } = require('./middlewares/validateRequest');

const app = express();

// Logging middleware para ver TODAS las solicitudes
app.use((req, res, next) => {
  console.log(`📨 [${req.method}] ${req.path} - IP: ${req.ip || req.connection.remoteAddress}`);
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeInput);

if (process.env.NODE_ENV === 'development') {
  app.use(requestLogger);
}

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🧠 MindForge API funcionando correctamente',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🧠 MindForge API funcionando correctamente',
    documentation: '/api/health'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/achievements', achievementRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;