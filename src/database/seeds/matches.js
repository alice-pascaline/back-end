module.exports = {
  up: async (queryInterface, Sequelize) => {
    const matches = [
      {
        id: '220e8400-e29b-41d4-a716-446655440001',
        donor_id: '660e8400-e29b-41d4-a716-446655440001',
        request_id: '880e8400-e29b-41d4-a716-446655440001',
        match_status: 'suggested',
      },
      {
        id: '220e8400-e29b-41d4-a716-446655440002',
        donor_id: '660e8400-e29b-41d4-a716-446655440002',
        request_id: '880e8400-e29b-41d4-a716-446655440002',
        match_status: 'accepted',
      },
      {
        id: '220e8400-e29b-41d4-a716-446655440003',
        donor_id: '660e8400-e29b-41d4-a716-446655440001',
        request_id: '880e8400-e29b-41d4-a716-446655440003',
        match_status: 'suggested',
      },
      {
        id: '220e8400-e29b-41d4-a716-446655440004',
        donor_id: '660e8400-e29b-41d4-a716-446655440002',
        request_id: '880e8400-e29b-41d4-a716-446655440004',
        match_status: 'accepted',
      },
    ];

    await queryInterface.bulkInsert('Matches', matches, {
  ignoreDuplicates: true
});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Matches', {
      id: [
        '220e8400-e29b-41d4-a716-446655440001',
        '220e8400-e29b-41d4-a716-446655440002',
        '220e8400-e29b-41d4-a716-446655440003',
        '220e8400-e29b-41d4-a716-446655440004',
      ],
    });
  },
};
