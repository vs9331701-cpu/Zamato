const db = require('../Confiq/db');
const { DataTypes } = require('sequelize');

const Vendor = db.define('Vendor', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ownerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  restaurantName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cuisine: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  opensAt: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  closesAt: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fssai: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gst: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pan: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
});

module.exports = Vendor;
