module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
    name: DataTypes.STRING,
    surname: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    tableName: 'teachers', 
    freezeTableName: true,     
    timestamps: false          
  });

  Teacher.associate = models => {
    Teacher.belongsTo(models.Institution, { foreignKey: 'institution_id' });
    Teacher.hasMany(models.Examination, { foreignKey: 'teacher_id' });
  };

  return Teacher;
};
