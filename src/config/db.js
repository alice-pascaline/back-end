const { Sequelize } = require('sequelize');
require('dotenv').config();

// Check if DATABASE_URL is provided (for Render/production) or use individual env vars
const databaseUrl = process.env.DATABASE_URL;

const sequelize = databaseUrl 
  ? new Sequelize(databaseUrl, {
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      dialectOptions: {
        ssl: databaseUrl.includes('render.com') ? { require: true, rejectUnauthorized: false } : false
      }
    })
  : new Sequelize(
      process.env.DB_NAME || 'blood-donation',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    );

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected successfully.');
    
    // Sync all models with database
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
