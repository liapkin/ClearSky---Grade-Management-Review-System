const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('reviews', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    grade_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'grades',
        key: 'id'
      }
    },
    request_message: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    response_message: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    state: {
      type: DataTypes.ENUM('Pending','Accepted','Rejected',''),
      allowNull: false,
      defaultValue: "Pending"
    }
  }, {
    sequelize,
    tableName: 'reviews',
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
        name: "idx_reviews_grade",
        using: "BTREE",
        fields: [
          { name: "grade_id" },
        ]
      },
    ]
  });
};
