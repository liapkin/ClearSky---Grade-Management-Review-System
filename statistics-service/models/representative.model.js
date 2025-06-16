module.exports = (sequelize, DataTypes) => {
  const Representative = sequelize.define('Representative', {
    name: DataTypes.STRING,
    surname: DataTypes.STRING
  }, {
    tableName: 'representatives', 
    freezeTableName: true,     
    timestamps: false          
  });

  Representative.associate = models => {
    Representative.belongsTo(models.Institution, { foreignKey: 'institution_id' });
  };

  return Representative;
};
