module.exports = {
  up: async (queryInterface, Sequelize) => {
    const bloodRequests = [
      {
        id: '880e8400-e29b-41d4-a716-446655440001',
        hospital_id: '770e8400-e29b-41d4-a716-446655440001',
        blood_type: 'O+',
        quantity: 5,
        urgency_level: 'high',
        status: 'pending',
        request_date: new Date(),
      },
      {
        id: '880e8400-e29b-41d4-a716-446655440002',
        hospital_id: '770e8400-e29b-41d4-a716-446655440001',
        blood_type: 'A-',
        quantity: 3,
        urgency_level: 'medium',
        status: 'pending',
        request_date: new Date(),
      },
      {
        id: '880e8400-e29b-41d4-a716-446655440003',
        hospital_id: '770e8400-e29b-41d4-a716-446655440002',
        blood_type: 'B+',
        quantity: 2,
        urgency_level: 'low',
        status: 'approved',
        request_date: new Date('2024-04-25'),
      },
      {
        id: '880e8400-e29b-41d4-a716-446655440004',
        hospital_id: '770e8400-e29b-41d4-a716-446655440002',
        blood_type: 'AB+',
        quantity: 4,
        urgency_level: 'high',
        status: 'fulfilled',
        request_date: new Date('2024-04-20'),
      },
    ];

    await queryInterface.bulkInsert('BloodRequests', bloodRequests, {
  ignoreDuplicates: true
});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('BloodRequests', {
      id: [
        '880e8400-e29b-41d4-a716-446655440001',
        '880e8400-e29b-41d4-a716-446655440002',
        '880e8400-e29b-41d4-a716-446655440003',
        '880e8400-e29b-41d4-a716-446655440004',
      ],
    });
  },
};
