const express = require('express');
const axios = require('axios');
const Tenant = require('../models/Tenant');

const router = express.Router();

// Tenant middleware
const tenantMiddleware = async (req, res, next) => {
  const tenantId = req.headers['x-tenant-id'] || req.query.tenantId;
  if (!tenantId) return res.status(400).json({ error: 'Tenant ID missing' });

  const tenant = await Tenant.findById(tenantId);
  if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

  req.tenant = tenant;
  next();
};

// ---- Customers ----
router.get("/customers", tenantMiddleware, async (req, res) => {
  try {
    const { shopDomain, accessToken } = req.tenant;

    if (!accessToken) {
      return res.status(400).json({ message: "Access token missing for this tenant." });
    }

    const response = await axios.get(
      `https://${shopDomain}/admin/api/2025-07/customers.json`,
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data.customers || []);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

module.exports = router;
