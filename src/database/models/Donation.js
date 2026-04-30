module.exports = (sequelize, DataTypes) => {
  const Donation = sequelize.define('Donation', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    donor_id: DataTypes.UUID,
    request_id: DataTypes.UUID,
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'completed'),
      defaultValue: 'pending'
    },
    donation_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'Donations',
    timestamps: false
  });

  return Donation;
};
