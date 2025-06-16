module.exports = (sequelize, DataTypes) => { 
  const Examination = sequelize.define('Examination', {
    course: DataTypes.STRING,
    semester: DataTypes.STRING
  }, {
    tableName: 'examinations', 
    freezeTableName: true,     
    timestamps: false          
  });

  Examination.associate = models => {
    Examination.belongsTo(models.Teacher, { foreignKey: 'teacher_id' });
    Examination.hasMany(models.Grade, { foreignKey: 'examination_id' });
  };

  return Examination;
};


//  ToDo: add no timastamps to all models, then check if first step works