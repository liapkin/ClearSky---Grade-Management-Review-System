const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

// ✅ Update this with your actual DB config
const sequelize = new Sequelize('SkyBlue', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

const db = {};
const basename = path.basename(__filename);

// Load all model files ending in `.model.js`
fs.readdirSync(__dirname)
  .filter(file => (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.endsWith('.model.js')
  ))
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

// Run `.associate()` if defined to set up relationships
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
