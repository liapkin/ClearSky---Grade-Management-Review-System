module.exports = (sequelize, DataTypes) => {
  const Grade = sequelize.define('Grade', {
    value: DataTypes.INTEGER,
    state: {
      type: DataTypes.ENUM('Initial', 'Open', 'Final'),
      defaultValue: 'Initial'
    }
  }, {
    tableName: 'grades', 
    freezeTableName: true,     
    timestamps: false          
  });

  Grade.associate = models => {
    Grade.belongsTo(models.Student, { foreignKey: 'student_id' });
    Grade.belongsTo(models.Examination, { foreignKey: 'examination_id' });
    Grade.hasOne(models.Review, { foreignKey: 'grade_id' });
  };

  return Grade;
};
