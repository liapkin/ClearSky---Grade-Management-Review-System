const { Sequelize } = require('sequelize');
const initModels = require('./init-models');

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: 'mysql',
  logging: false
});

const db = initModels(sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;