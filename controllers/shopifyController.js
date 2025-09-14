// controllers/shopifyController.js
const axios = require('axios');
const User = require('../models/User'); // Your DB model where user tokens are stored

exports.getCustomers = async (req, res) => {
  try {
    const userId = req.user.id; // Assume middleware sets req.user
    const user = await User.findById(userId);

    if (!user || !user.shopifyStore || !user.shopifyToken) {
      return res.status(403).json({ success: false, message: "Shopify not connected" });
    }

    const headers = {
      'X-Shopify-Access-Token': user.shopifyToken,
      'Content-Type': 'application/json',
    };

    const response = await axios.get(
      `https://${user.shopifyStore}/admin/api/2023-07/customers.json`,
      { headers }
    );

    const customers = response.data.customers.map((c) => ({
      id: c.id,
      firstName: c.first_name,
      lastName: c.last_name,
      email: c.email,
      totalSpent: c.total_spent,
      ordersCount: c.orders_count,
    }));

    res.json(customers);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
