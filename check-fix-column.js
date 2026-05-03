const mysql = require('mysql2/promise');

const checkAndFix = async () => {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '',
      database: 'donation_db'
    });

    console.log('Checking Users table structure...');
    const [columns] = await connection.query('SHOW COLUMNS FROM Users');
    
    console.log('All columns in Users table:');
    columns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });
    
    // Check if is_active (with underscore) exists
    const hasIsActive = columns.some(col => col.Field === 'is_active');
    const hasIsActiveDash = columns.some(col => col.Field === 'is-active');
    
    if (hasIsActiveDash && !hasIsActive) {
      console.log('\nFound "is-active" (with dash). Renaming to "is_active"...');
      await connection.query('ALTER TABLE Users CHANGE COLUMN `is-active` `is_active` TINYINT(1) DEFAULT 1');
      console.log('Column renamed successfully!');
    } else if (!hasIsActive && !hasIsActiveDash) {
      console.log('\nNo is_active column found. Adding it...');
      await connection.query('ALTER TABLE Users ADD COLUMN `is_active` TINYINT(1) DEFAULT 1');
      console.log('Column added successfully!');
    } else {
      console.log('\nis_active column already exists with correct name.');
    }
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
};

checkAndFix();
