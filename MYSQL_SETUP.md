# MySQL Database Setup for Blood Donation System

## Prerequisites
1. MySQL Server installed and running
2. MySQL Command Line Client or GUI tool (like MySQL Workbench)

## Database Setup

### 1. Create Database
```sql
CREATE DATABASE `blood-donation` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Create User (Optional)
```sql
CREATE USER 'blooddonation'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON `blood-donation`.* TO 'blooddonation'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Update Environment Variables
Update your `.env` file with your MySQL credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=blood-donation
DB_USER=root
DB_PASSWORD=your_mysql_password
```

## Running the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm run dev
```

The server will automatically create all necessary tables on first run using Sequelize's sync functionality.

## Database Schema

The following tables will be created automatically:

- `users` - User accounts (donors, hospitals, admins)
- `donors` - Donor-specific information
- `hospitals` - Hospital-specific information  
- `blood_requests` - Blood donation requests
- `donations` - Donation records
- `matches` - Donor-request matches
- `notifications` - User notifications

## Troubleshooting

### Connection Refused Error
If you get "Connection refused" error:
1. Make sure MySQL server is running
2. Check that the port (3306) is correct
3. Verify your MySQL username and password
4. Ensure the database exists

### Authentication Error
If you get authentication errors:
1. Double-check your MySQL credentials in `.env`
2. Make sure the user has privileges on the database

### Database Not Found
If you get "Unknown database" error:
1. Create the database manually using the SQL command above
2. Check the database name in your `.env` file

## Default Admin User

The system will automatically create a default admin user:
- Email: admin@blooddonation.com
- Password: Admin@2026!

**Important:** Change this password after first login!
