const mysql = require('mysql2/promise');

const addColumn = async () => {
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
    
    // Check if column exists
    const [columns] = await connection.query(
      "SHOW COLUMNS FROM Users LIKE 'is_active'"
    );
    
    if (columns.length === 0) {
      console.log('Adding is_active column...');
      await connection.query(
        'ALTER TABLE Users ADD COLUMN is_active BOOLEAN DEFAULT TRUE'
      );
      console.log('Column added successfully!');
    } else {
      console.log('Column already exists:', columns[0]);
    }
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
};

addColumn();
