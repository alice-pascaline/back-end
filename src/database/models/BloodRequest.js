module.exports = (sequelize, DataTypes) => {
  const BloodRequest = sequelize.define('BloodRequest', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    hospital_id: DataTypes.UUID,
    blood_type: {
      type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    },
    quantity: DataTypes.INTEGER,
    urgency_level: {
      type: DataTypes.ENUM('low', 'medium', 'high')
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'fulfilled', 'cancelled'),
      defaultValue: 'pending'
    },
    request_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'BloodRequests',
    timestamps: false
  });

  return BloodRequest;
};
