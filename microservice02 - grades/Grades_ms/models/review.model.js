module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    request_message: DataTypes.STRING,
    response_message: DataTypes.STRING,
    state: {
      type: DataTypes.ENUM('Accepted', 'Rejected', 'Pending'),
      defaultValue: 'Pending'
    }
  }, {
    tableName: 'reviews', 
    freezeTableName: true,     
    timestamps: false          
  });

  Review.associate = models => {
    Review.belongsTo(models.Grade, { foreignKey: 'grade_id' });
  };

  return Review;
};
