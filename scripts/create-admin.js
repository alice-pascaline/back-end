const connectDB = require('../src/config/db');
const User = require('../src/models/User');
const bcrypt = require('bcrypt');

const createAdminUser = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@blooddonation.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@2026!';
    const adminName = process.env.ADMIN_NAME || 'System Administrator';

    const existingAdmin = await User.findOne({ role: 'admin', email: adminEmail });
    
    if (existingAdmin) {
      console.log('Admin user already exists:');
      console.log('Email:', existingAdmin.email);
      console.log('Please use the existing admin account or delete it first.');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      is_active: true
    });

    console.log('Admin user created successfully!');
    console.log('=================================');
    console.log('Email: admin@blooddonation.com');
    console.log('Password: Admin@2026!');
    console.log('=================================');
    console.log('Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdminUser();
