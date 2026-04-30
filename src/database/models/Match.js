module.exports = (sequelize, DataTypes) => {
  const Match = sequelize.define('Match', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    donor_id: DataTypes.UUID,
    request_id: DataTypes.UUID,
    match_status: {
      type: DataTypes.ENUM('suggested', 'accepted', 'declined'),
      defaultValue: 'suggested'
    }
  }, {
    tableName: 'Matches',
    timestamps: false
  });

  return Match;
};
