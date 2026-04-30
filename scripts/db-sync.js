const { sequelize } = require('../src/database/models');

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync all models with the database
    await sequelize.sync({ force: false }); // Set force: true to drop and recreate tables
    console.log('Database synchronized successfully!');

    // Run seeds after synchronization
    const { runSeeds } = require('../src/database/seeds');
    await runSeeds();
    
  } catch (error) {
    console.error('Error synchronizing database:', error);
  } finally {
    await sequelize.close();
  }
};

syncDatabase();
