const bcrypt = require('bcrypt');
const User = require('../models/User');

const ensureAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@blooddonation.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@2026!';
    const adminName = process.env.ADMIN_NAME || 'System Administrator';

    const existingAdmin = await User.findOne({ role: 'admin', email: adminEmail });
    if (existingAdmin) {
      console.log(`Admin already exists: ${adminEmail}`);
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      is_active: true
    });

    console.log('Default admin user created successfully:');
    console.log(`  Email: ${adminEmail}`);
    console.log(`  Password: ${adminPassword}`);
    console.log('Please change the password after first login.');
  } catch (error) {
    console.error('Failed to create default admin user:', error.message);
  }
};

module.exports = ensureAdminUser;
