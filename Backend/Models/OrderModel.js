const db = require('../Confiq/db');
const { DataTypes } = require('sequelize');
const User = require('./UserModel');
const Vendor = require('./VendorModel');

const Order = db.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'preparing', 'on_the_way', 'delivered', 'cancelled'),
    defaultValue: 'pending',
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  deliveryFee: {
    type: DataTypes.FLOAT,
    defaultValue: 40,
  },
  taxes: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  discount: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentMode: {
    type: DataTypes.STRING,
    defaultValue: 'COD',
  },
}, {
  timestamps: true,
});

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Vendor.hasMany(Order, { foreignKey: 'vendorId', as: 'orders' });
Order.belongsTo(Vendor, { foreignKey: 'vendorId', as: 'vendor' });

module.exports = Order;
