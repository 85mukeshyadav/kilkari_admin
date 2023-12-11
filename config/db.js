//'use strict';
require('dotenv').config();
//  this file is for instance of
const Sequelize = require('sequelize');

// Option 1: Passing parameters separately
//const prodDb = 'cjhfzely_questionbank';
//const debugDb = 'cjhfzely_tathagatdev';
console.log('ENV detail',process.env.DB);
const Db = process.env.DB;
const sequelize = new Sequelize(
  Db,
  process.env.DB_USER,
  process.env.DB_PWD,
  {
    host: '127.0.0.1',
    dialect: 'mariadb',
    pool: {
      max: 5000,
      min: 0,
      acquire: 300000,
      idle: 10000,
    },
    define: {
      timestamps: false,
    },
  }
);
// new model are listed here so that they can be frmed in database
const Crons = require('../models/crons.js')(sequelize, Sequelize);
const Logs = require('../models/logs.js')(sequelize, Sequelize);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = {
  Crons,Logs
};
