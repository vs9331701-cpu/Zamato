const express = require('express');
const { RegisterVendor, LoginVendor, GetVendorProfile, GetPublicRestaurants } = require('../Controller/VendorController');
const { vendorAuthMiddleware } = require('../Midleware/VendorAuthMiddleware');

const router = express.Router();

router.post('/register', RegisterVendor);
router.post('/login', LoginVendor);
router.get('/me', vendorAuthMiddleware, GetVendorProfile);
router.get('/restaurants', GetPublicRestaurants);

module.exports = router;
