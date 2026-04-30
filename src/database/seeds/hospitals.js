module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hospitals = [
      {
        id: '770e8400-e29b-41d4-a716-446655440001',
        user_id: '550e8400-e29b-41d4-a716-446655440003',
        hospital_name: 'City Hospital',
        address: '123 Main St, New York, NY 10001',
        contact_number: '+1-212-555-0101',
      },
      {
        id: '770e8400-e29b-41d4-a716-446655440002',
        user_id: '550e8400-e29b-41d4-a716-446655440004',
        hospital_name: 'General Hospital',
        address: '456 Oak Ave, Los Angeles, CA 90001',
        contact_number: '+1-213-555-0202',
      },
    ];

    await queryInterface.bulkInsert('Hospitals', hospitals, {
  ignoreDuplicates: true
});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Hospitals', {
      id: [
        '770e8400-e29b-41d4-a716-446655440001',
        '770e8400-e29b-41d4-a716-446655440002',
      ],
    });
  },
};
