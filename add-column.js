const { sequelize } = require('./src/database/models');

const addColumn = async () => {
  try {
    // Check if column exists first
    const [results] = await sequelize.query(
      "SHOW COLUMNS FROM Users LIKE 'is_active'"
    );
    
    if (results.length === 0) {
      console.log('Adding is_active column to Users table...');
      await sequelize.query(
        'ALTER TABLE Users ADD COLUMN is_active BOOLEAN DEFAULT TRUE'
      );
      console.log('Column added successfully!');
    } else {
      console.log('Column is_active already exists.');
    }
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    await sequelize.close();
    process.exit(1);
  }
};

addColumn();
