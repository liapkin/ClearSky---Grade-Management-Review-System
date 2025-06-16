module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    name: DataTypes.STRING,
    surname: DataTypes.STRING,
    email: DataTypes.STRING,
    am: DataTypes.STRING
  }, {
    tableName: 'students', 
    freezeTableName: true,     
    timestamps: false          
  });

  Student.associate = models => {
    Student.belongsTo(models.Institution, { foreignKey: 'institution_id' });
    Student.hasMany(models.Grade, { foreignKey: 'student_id' });
  };

  return Student;
};
