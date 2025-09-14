const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");
const Order = require("../models/Order");
const Product = require("../models/Product");

router.get("/customers/:tenantId", async (req, res) => {
  const data = await Customer.find({ tenantId: req.params.tenantId });
  res.json(data);
});

router.get("/orders/:tenantId", async (req, res) => {
  const data = await Order.find({ tenantId: req.params.tenantId });
  res.json(data);
});

router.get("/products/:tenantId", async (req, res) => {
  const data = await Product.find({ tenantId: req.params.tenantId });
  res.json(data);
});

module.exports = router;

