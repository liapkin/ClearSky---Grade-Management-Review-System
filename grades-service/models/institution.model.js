module.exports = (sequelize, DataTypes) => {
  const Institution = sequelize.define('Institution', {
    name: { type: DataTypes.STRING, allowNull: false },
    tokens: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
  }, {
    tableName: 'institutions', 
    freezeTableName: true,     
    timestamps: false          
  });

  Institution.associate = models => {
    Institution.hasMany(models.Teacher, { foreignKey: 'institution_id' });
    Institution.hasMany(models.Student, { foreignKey: 'institution_id' });
    Institution.hasMany(models.Representative, { foreignKey: 'institution_id' });
  };

  return Institution;
};
