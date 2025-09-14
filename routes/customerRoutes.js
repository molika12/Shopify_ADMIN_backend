const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get customers for a tenant
router.get('/', async (req, res) => {
  try {
    const { shopDomain, accessToken } = req.query; // send from frontend

    if (!shopDomain || !accessToken) {
      return res.status(400).json({ message: 'ShopDomain and accessToken are required' });
    }

    const url = `https://${shopDomain}/admin/api/2025-01/customers.json`;

    const response = await axios.get(url, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data.customers || []);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: 'Failed to fetch customers' });
  }
});

module.exports = router;
