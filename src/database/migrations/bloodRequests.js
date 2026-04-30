module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BloodRequests', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      hospital_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Hospitals',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      blood_type: {
        type: Sequelize.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      urgency_level: {
        type: Sequelize.ENUM('low', 'medium', 'high'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'fulfilled', 'cancelled'),
        defaultValue: 'pending',
      },
      request_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BloodRequests');
  },
};
