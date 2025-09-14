// routes/fetchRoutes.js
const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");
const Order = require("../models/Order");
const Product = require("../models/Product");

// Get customers
router.get("/customers/:tenantId", async (req, res) => {
  const data = await Customer.find({ tenantId: req.params.tenantId });
  res.json(data);
});

// Get orders
router.get("/orders/:tenantId", async (req, res) => {
  const data = await Order.find({ tenantId: req.params.tenantId });
  res.json(data);
});

// Get products
router.get("/products/:tenantId", async (req, res) => {
  const data = await Product.find({ tenantId: req.params.tenantId });
  res.json(data);
});

module.exports = router;
