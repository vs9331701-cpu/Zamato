const express = require('express');
const { GetAllProducts, CreateProduct, UpdateProduct } = require('../Controller/ProductController');
const { vendorAuthMiddleware } = require('../Midleware/VendorAuthMiddleware');

const router = express.Router();

router.get('/', GetAllProducts);
router.get('/vendor/me', vendorAuthMiddleware, GetAllProducts);
router.post('/', vendorAuthMiddleware, CreateProduct);
router.put('/:id', vendorAuthMiddleware, UpdateProduct);

module.exports = router;
