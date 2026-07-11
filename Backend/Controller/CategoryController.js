const Category = require('../Models/CategoryModel');
const Product = require('../Models/ProductModel');

const defaultCategories = [
  { name: 'Fast Food', image: 'https://images.pexels.com/photos/1633565/pexels-photo-1633565.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { name: 'Lunch', image: 'https://images.pexels.com/photos/5408352/pexels-photo-5408352.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { name: 'Dinner', image: 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { name: 'Biryani', image: 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { name: 'Pizza', image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { name: 'Burgers', image: 'https://images.pexels.com/photos/1633565/pexels-photo-1633565.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { name: 'Desserts', image: 'https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { name: 'Beverages', image: 'https://images.pexels.com/photos/3014562/pexels-photo-3014562.jpeg?auto=compress&cs=tinysrgb&w=300' },
];

async function seedDefaultCategories() {
  for (const category of defaultCategories) {
    await Category.findOrCreate({ where: { name: category.name }, defaults: category });
  }
}

async function GetAllCategories(req, res) {
  try {
    await seedDefaultCategories();
    const categories = await Category.findAll({
      include: [{ model: Product, as: 'products', attributes: ['id'] }],
      order: [['name', 'ASC']],
    });

    res.json(categories.map((category) => ({
      id: category.id,
      name: category.name,
      image: category.image,
      active: category.active,
      items: category.products.length,
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function CreateCategory(req, res) {
  try {
    const { name, image, active } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const category = await Category.create({ name, image, active });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function UpdateCategory(req, res) {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.update(req.body);
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { GetAllCategories, CreateCategory, UpdateCategory };
