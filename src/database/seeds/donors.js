module.exports = {
  up: async (queryInterface, Sequelize) => {
    const donors = [
      {
        id: '660e8400-e29b-41d4-a716-446655440001',
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        blood_type: 'O+',
        last_donation_date: new Date('2024-01-15'),
        availability_status: true,
        location: 'New York, NY',
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440002',
        user_id: '550e8400-e29b-41d4-a716-446655440002',
        blood_type: 'A-',
        last_donation_date: new Date('2023-12-20'),
        availability_status: true,
        location: 'Los Angeles, CA',
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440003',
        user_id: '550e8400-e29b-41d4-a716-446655440006',
        blood_type: 'B+',
        last_donation_date: new Date('2024-02-10'),
        availability_status: false,
        location: 'Chicago, IL',
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440004',
        user_id: '550e8400-e29b-41d4-a716-446655440007',
        blood_type: 'AB+',
        last_donation_date: new Date('2023-11-05'),
        availability_status: true,
        location: 'Houston, TX',
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440005',
        user_id: '550e8400-e29b-41d4-a716-446655440008',
        blood_type: 'O-',
        last_donation_date: new Date('2024-03-01'),
        availability_status: true,
        location: 'Phoenix, AZ',
      },
    ];

    await queryInterface.bulkInsert('Donors', donors, {
  ignoreDuplicates: true
});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Donors', {
      id: [
        '660e8400-e29b-41d4-a716-446655440001',
        '660e8400-e29b-41d4-a716-446655440002',
        '660e8400-e29b-41d4-a716-446655440003',
        '660e8400-e29b-41d4-a716-446655440004',
        '660e8400-e29b-41d4-a716-446655440005',
      ],
    });
  },
};
