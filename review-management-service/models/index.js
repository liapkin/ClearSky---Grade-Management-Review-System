const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

// Δημιουργία σύνδεσης με MySQL (π.χ. μέσω XAMPP)
const sequelize = new Sequelize('clearsky', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // βάλε true αν θες να βλέπεις τα SQL queries
});

const db = {};

// Αυτόματη φόρτωση όλων των .js αρχείων του φακέλου (εκτός του index.js)
fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js' && file.endsWith('.js'))
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Εκτέλεση associations αν υπάρχουν
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Προσθήκη του sequelize instance και του Sequelize constructor στο export
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
