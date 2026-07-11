const jwt = require('jsonwebtoken');
const Vendor = require('../Models/VendorModel');
const Product = require('../Models/ProductModel');
const Category = require('../Models/CategoryModel');

const JWT_SECRET = process.env.JWT_SECRET || 'zamato-secret-key';

function generateVendorToken(vendor) {
  return jwt.sign(
    { id: vendor.id, mobile: vendor.mobile, role: 'vendor' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function formatVendor(vendor) {
  return {
    id: vendor.id,
    ownerName: vendor.ownerName,
    restaurantName: vendor.restaurantName,
    email: vendor.email,
    mobile: vendor.mobile,
    cuisine: vendor.cuisine,
    image: vendor.image,
    address: vendor.address,
    city: vendor.city,
    pincode: vendor.pincode,
    opensAt: vendor.opensAt,
    closesAt: vendor.closesAt,
    fssai: vendor.fssai,
    gst: vendor.gst,
    pan: vendor.pan,
    active: vendor.active,
  };
}

async function RegisterVendor(req, res) {
  try {
    const { ownerName, restaurantName, email, mobile, password } = req.body;
    if (!ownerName || !restaurantName || !mobile || !password) {
      return res.status(400).json({ error: 'Owner name, restaurant name, mobile and password are required' });
    }

    const existingVendor = await Vendor.findOne({ where: { mobile } });
    if (existingVendor) {
      return res.status(409).json({ error: 'Vendor already exists' });
    }

    const vendor = await Vendor.create(req.body);
    res.status(201).json({ vendor: formatVendor(vendor), token: generateVendorToken(vendor) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function LoginVendor(req, res) {
  try {
    const { mobile, password } = req.body;
    if (!mobile || !password) {
      return res.status(400).json({ error: 'Mobile and password are required' });
    }

    const vendor = await Vendor.findOne({ where: { mobile } });
    if (!vendor || vendor.password !== password) {
      return res.status(401).json({ error: 'Invalid mobile or password' });
    }

    res.json({ vendor: formatVendor(vendor), token: generateVendorToken(vendor) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function GetVendorProfile(req, res) {
  try {
    const vendor = await Vendor.findByPk(req.vendor.id);
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    res.json({ vendor: formatVendor(vendor) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function GetPublicRestaurants(req, res) {
  try {
    const vendors = await Vendor.findAll({
      where: { active: true },
      include: [{
        model: Product,
        as: 'products',
        where: { active: true },
        required: false,
        include: [{ model: Category, as: 'category' }],
      }],
      order: [['createdAt', 'DESC']],
    });

    res.json(vendors.map((vendor) => ({
      ...formatVendor(vendor),
      products: vendor.products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        image: product.image || '',
        category: product.category ? product.category.name : '',
        categoryId: product.categoryId,
        vendorId: product.vendorId,
        isVeg: product.isVeg,
        isBestseller: product.isBestseller,
        active: product.active,
      })),
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { RegisterVendor, LoginVendor, GetVendorProfile, GetPublicRestaurants };
