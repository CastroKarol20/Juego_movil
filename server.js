require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, '0.0.0.0', () => {
      console.log('================================');
      console.log('🧠  MindForge Backend');
      console.log('================================');
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV}`);
      console.log('================================');
    });

  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();