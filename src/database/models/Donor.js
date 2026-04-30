module.exports = (sequelize, DataTypes) => {
  const Donor = sequelize.define('Donor', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: DataTypes.UUID,
    blood_type: {
      type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    },
    last_donation_date: DataTypes.DATEONLY,
    availability_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    location: DataTypes.STRING
  }, {
    tableName: 'Donors',
    timestamps: false
  });

  return Donor;
};
