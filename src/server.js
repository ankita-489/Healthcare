require('dotenv').config();
const app = require('./app');
const { sequelize, testConnection } = require('./models');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('Connecting to PostgreSQL database...');
    await testConnection();

    // Synchronize models with PostgreSQL database
    console.log('Synchronizing database schema...');
    await sequelize.sync({ alter: true });
    console.log('Database tables synchronized successfully.');

    const server = app.listen(PORT, () => {
      console.log(`Healthcare Backend Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Health Check: http://localhost:${PORT}/api/health`);
    });

    const gracefulShutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        console.log('HTTP server closed.');
        try {
          await sequelize.close();
          console.log('Database connection closed.');
          process.exit(0);
        } catch (err) {
          console.error('Error during database closure:', err);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
