module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Matches', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      donor_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Donors',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      request_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'BloodRequests',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      match_status: {
        type: Sequelize.ENUM('suggested', 'accepted', 'declined'),
        defaultValue: 'suggested',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Matches');
  },
};
