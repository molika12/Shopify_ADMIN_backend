const express = require('express');
const router = express.Router();
const { getCustomers, getOrders, getProducts } = require('../controllers/shopifyController');

// Tenant-aware APIs
router.get('/customers', getCustomers);
router.get('/orders', getOrders);
router.get('/products', getProducts);

module.exports = router;
