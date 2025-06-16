module.exports = (sequelize, DataTypes) => {
  const Upload = sequelize.define('Upload', {
    uid: { type: DataTypes.STRING, allowNull: false },
    file: { type: DataTypes.BLOB('long'), allowNull: false }
  }, {
    tableName: 'uploads',       
    freezeTableName: true,       
    timestamps: false

  });

  return Upload;
};
