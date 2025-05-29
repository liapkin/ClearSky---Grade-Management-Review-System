const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const initModels = require('./init-models'); // Προσθήκη του init-models

// Δημιουργία σύνδεσης με MySQL (π.χ. μέσω XAMPP)
const sequelize = new Sequelize('clearsky', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // βάλε true αν θες να βλέπεις τα SQL queries
});

// Χρήση του initModels για να δημιουργήσουμε τα μοντέλα με τα associations
const db = initModels(sequelize);

// Προσθήκη του sequelize instance και του Sequelize constructor στο export
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;