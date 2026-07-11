const Category = require('../Models/CategoryModel');
const Product = require('../Models/ProductModel');

async function GetAllProducts(req, res) {
  try {
    const where = {};
    if (req.query.categoryId) {
      where.categoryId = req.query.categoryId;
    }
    if (req.query.active === 'true') {
      where.active = true;
    }
    if (req.query.vendorId) {
      where.vendorId = req.query.vendorId;
    }
    if (req.vendor) {
      where.vendorId = req.vendor.id;
    }

    const products = await Product.findAll({
      where,
      include: [{ model: Category, as: 'category' }],
      order: [['createdAt', 'DESC']],
    });

    res.json(products.map(formatProduct));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function CreateProduct(req, res) {
  try {
    const { name, description, price, image, categoryId, categoryName, isVeg, isBestseller, stock, active, vendorId } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: 'Product name and price are required' });
    }

    let category = null;
    if (categoryId) {
      category = await Category.findByPk(categoryId);
    } else if (categoryName) {
      const result = await Category.findOrCreate({ where: { name: categoryName }, defaults: { name: categoryName, active: true } });
      category = result[0];
    }

    if (!category) {
      return res.status(400).json({ message: 'Valid category is required' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image,
      categoryId: category.id,
      vendorId: req.vendor ? req.vendor.id : vendorId,
      isVeg,
      isBestseller,
      stock,
      active,
    });

    const created = await Product.findByPk(product.id, { include: [{ model: Category, as: 'category' }] });
    res.status(201).json(formatProduct(created));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function UpdateProduct(req, res) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.update(req.body);
    const updated = await Product.findByPk(product.id, { include: [{ model: Category, as: 'category' }] });
    res.json(formatProduct(updated));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

function formatProduct(product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: product.price,
    image: product.image || '',
    isVeg: product.isVeg,
    veg: product.isVeg,
    isBestseller: product.isBestseller,
    stock: product.stock,
    active: product.active,
    categoryId: product.categoryId,
    vendorId: product.vendorId,
    category: product.category ? product.category.name : '',
    rating: 4.2,
    sold: 0,
  };
}

module.exports = { GetAllProducts, CreateProduct, UpdateProduct };
