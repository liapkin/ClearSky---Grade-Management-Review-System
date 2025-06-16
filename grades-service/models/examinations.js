const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('examinations', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'teachers',
        key: 'id'
      }
    },
    course: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    semester: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'examinations',
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
      {
        name: "idx_examinations_teacher",
        using: "BTREE",
        fields: [
          { name: "teacher_id" },
        ]
      },
    ]
  });
};
