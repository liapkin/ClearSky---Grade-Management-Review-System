module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define('Log', {
    uid: { type: DataTypes.STRING, allowNull: false },
    instructor_id: { type: DataTypes.INTEGER, allowNull: false },
    action: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'logs',
    freezeTableName: true,
    timestamps: false
  });

  return Log;
};
