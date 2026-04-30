const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: hashedPassword,
        role: 'donor',
        phone: '+1234567890',
        created_at: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: hashedPassword,
        role: 'donor',
        phone: '+1234567891',
        created_at: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'City Hospital',
        email: 'admin@cityhospital.com',
        password: hashedPassword,
        role: 'hospital',
        phone: '+1234567892',
        created_at: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        name: 'General Hospital',
        email: 'admin@generalhospital.com',
        password: hashedPassword,
        role: 'hospital',
        phone: '+1234567893',
        created_at: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
        name: 'System Admin',
        email: 'admin@bloodsystem.com',
        password: hashedPassword,
        role: 'admin',
        phone: '+1234567894',
        created_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('Users', users, {
  ignoreDuplicates: true
});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {
      id: [
        '550e8400-e29b-41d4-a716-446655440001',
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440003',
        '550e8400-e29b-41d4-a716-446655440004',
        '550e8400-e29b-41d4-a716-446655440005',
      ],
    });
  },
};
