const Sequelize = require('sequelize');
require('dotenv').config();

const DB_URL =
  process.env.DATABASE_URL ||
  'mysql://root:vcsQgWCXIBBBKuCqKxJUOIiVEZCazqXy@tokaido.proxy.rlwy.net:11760/railway';

const db = new Sequelize(DB_URL, {
  dialect: 'mysql',
  logging: false,
});

module.exports = db;