const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('uploads', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    uid: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    file: {
      type: DataTypes.BLOB,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'uploads',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
