module.exports = {
  up: async (queryInterface, Sequelize) => {
    const notifications = [
      {
        id: '110e8400-e29b-41d4-a716-446655440001',
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        message: 'You have a new blood donation request for O+ blood type.',
        type: 'request',
        is_read: false,
        created_at: new Date(),
      },
      {
        id: '110e8400-e29b-41d4-a716-446655440002',
        user_id: '550e8400-e29b-41d4-a716-446655440002',
        message: 'Your donation offer has been accepted by City Hospital.',
        type: 'approval',
        is_read: true,
        created_at: new Date('2024-04-25'),
      },
      {
        id: '110e8400-e29b-41d4-a716-446655440003',
        user_id: '550e8400-e29b-41d4-a716-446655440003',
        message: 'Your blood request has been fulfilled. Thank you!',
        type: 'approval',
        is_read: false,
        created_at: new Date(),
      },
      {
        id: '110e8400-e29b-41d4-a716-446655440004',
        user_id: '550e8400-e29b-41d4-a716-446655440004',
        message: 'Your donation request could not be processed at this time.',
        type: 'rejection',
        is_read: true,
        created_at: new Date('2024-04-24'),
      },
    ];

    await queryInterface.bulkInsert('Notifications', notifications, {
  ignoreDuplicates: true
});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Notifications', {
      id: [
        '110e8400-e29b-41d4-a716-446655440001',
        '110e8400-e29b-41d4-a716-446655440002',
        '110e8400-e29b-41d4-a716-446655440003',
        '110e8400-e29b-41d4-a716-446655440004',
      ],
    });
  },
};
