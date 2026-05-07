require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/config/db');
const ensureAdminUser = require('./src/utils/initAdmin');
const routes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Blood Donation API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Blood Donation Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      donors: '/api/donors',
      hospitals: '/api/hospitals',
      bloodRequests: '/api/blood-requests',
      donations: '/api/donations',
      notifications: '/api/notifications',
      matches: '/api/matches'
    }
  });
});

// Simple error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    await ensureAdminUser();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Server error:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const { sequelize } = require('./src/config/db');

process.on('SIGTERM', async () => {
  console.log('Shutting down...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Shutting down...');
  await sequelize.close();
  process.exit(0);
});

startServer();
module.exports = app;
