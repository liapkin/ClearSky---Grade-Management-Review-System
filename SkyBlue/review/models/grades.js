const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('grades', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id'
      }
    },
    examination_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'examinations',
        key: 'id'
      }
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'grades',
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
        name: "idx_grades_student",
        using: "BTREE",
        fields: [
          { name: "student_id" },
        ]
      },
      {
        name: "idx_grades_examination",
        using: "BTREE",
        fields: [
          { name: "examination_id" },
        ]
      },
    ]
  });
};
