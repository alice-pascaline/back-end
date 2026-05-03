const mysql = require('mysql2/promise');

const fixColumn = async () => {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '',
      database: 'donation_db'
    });

    console.log('Connected to database...');
    
    // Check column type
    const [columns] = await connection.query(
      "SHOW COLUMNS FROM Users LIKE 'is_active'"
    );
    
    console.log('Current column info:', columns[0]);
    
    // Fix the column - change to BOOLEAN/TINYINT(1)
    console.log('Fixing is_active column type...');
    await connection.query(
      'ALTER TABLE Users MODIFY COLUMN is_active TINYINT(1) DEFAULT 1'
    );
    
    // Verify the change
    const [updatedColumns] = await connection.query(
      "SHOW COLUMNS FROM Users LIKE 'is_active'"
    );
    
    console.log('Updated column info:', updatedColumns[0]);
    console.log('Column fixed successfully!');
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
};

fixColumn();
