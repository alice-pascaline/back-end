module.exports = {
  up: async (queryInterface, Sequelize) => {
    const donations = [
      {
        id: '990e8400-e29b-41d4-a716-446655440001',
        donor_id: '660e8400-e29b-41d4-a716-446655440001',
        request_id: '880e8400-e29b-41d4-a716-446655440001',
        status: 'pending',
        donation_date: new Date(),
      },
      {
        id: '990e8400-e29b-41d4-a716-446655440002',
        donor_id: '660e8400-e29b-41d4-a716-446655440002',
        request_id: '880e8400-e29b-41d4-a716-446655440002',
        status: 'accepted',
        donation_date: new Date(),
      },
      {
        id: '990e8400-e29b-41d4-a716-446655440003',
        donor_id: '660e8400-e29b-41d4-a716-446655440001',
        request_id: '880e8400-e29b-41d4-a716-446655440003',
        status: 'completed',
        donation_date: new Date('2024-04-22'),
      },
    ];

    await queryInterface.bulkInsert('Donations', donations, {
  ignoreDuplicates: true
});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Donations', {
      id: [
        '990e8400-e29b-41d4-a716-446655440001',
        '990e8400-e29b-41d4-a716-446655440002',
        '990e8400-e29b-41d4-a716-446655440003',
      ],
    });
  },
};
