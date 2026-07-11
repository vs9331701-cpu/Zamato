const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const db = require('./Confiq/db');
const userRoutes = require('./Routes/userRoutes');
const productRoutes = require('./Routes/productRoutes');
const categoryRoutes = require('./Routes/categoryRoutes');
const vendorRoutes = require('./Routes/vendorRoutes');
const orderRoutes = require('./Routes/orderRoutes');

const app = express();
const PORT = 8001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', async (req, res) => {
  try {
    await db.authenticate();
    res.json({ message: 'Database connected successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



async function startServer() {
  try {
    await db.authenticate();
    console.log('Database connected successfully');

    await db.sync({ alter: true });
    console.log('Database synchronized');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    // If DB doesn't exist, attempt to create it and retry
    const DB_NAME = process.env.DB_NAME || 'zamato';
    const DB_USER = process.env.DB_USER || 'root';
    const DB_PASSWORD = process.env.DB_PASSWORD || 'Pst@2005';
    const DB_HOST = process.env.DB_HOST || 'localhost';
    const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

    if (error && error.parent && error.parent.code === 'ER_BAD_DB_ERROR') {
      try {
        const mysql = require('mysql2/promise');
        const connection = await mysql.createConnection({
          host: DB_HOST,
          user: DB_USER,
          password: DB_PASSWORD,
          port: DB_PORT,
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
        await connection.end();
        console.log(`Database ${DB_NAME} created; retrying connection...`);

        // retry
        await db.authenticate();
        console.log('Database connected successfully');
        await db.sync({ alter: true });
        console.log('Database synchronized');
        app.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
        });
        return;
      } catch (createErr) {
        console.error('Failed to create database:', createErr);
        process.exit(1);
      }
    }

    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();
