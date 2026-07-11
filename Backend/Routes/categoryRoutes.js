const express = require('express');
const { GetAllCategories, CreateCategory, UpdateCategory } = require('../Controller/CategoryController');

const router = express.Router();

router.get('/', GetAllCategories);
router.post('/', CreateCategory);
router.put('/:id', UpdateCategory);

module.exports = router;
