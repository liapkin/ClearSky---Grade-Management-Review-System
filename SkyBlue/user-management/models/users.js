const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define("users", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    },
    institution_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    identification_number: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: "users",
    timestamps: false
  });

  return users;
};
