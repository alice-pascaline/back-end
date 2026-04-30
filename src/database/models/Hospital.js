module.exports = (sequelize, DataTypes) => {
  const Hospital = sequelize.define('Hospital', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: DataTypes.UUID,
    hospital_name: DataTypes.STRING,
    address: DataTypes.STRING,
    contact_number: DataTypes.STRING
  }, {
    tableName: 'Hospitals',
    timestamps: false
  });

  return Hospital;
};
