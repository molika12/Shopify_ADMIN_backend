const Customer = require("../models/Customer");
const Order = require("../models/Order");
const Product = require("../models/Product");
const axios = require("axios");

const fetchFromShopify = async (shopDomain, accessToken, endpoint) => {
  const headers = {
    "X-Shopify-Access-Token": accessToken,
    "Content-Type": "application/json",
  };
  const url = `https://${shopDomain}/admin/api/2025-07/${endpoint}.json`;
  const res = await axios.get(url, { headers });
  return res.data[endpoint.replace(".json","")] || [];
};

// Save/update customers
const syncCustomers = async (req, res) => {
  try {
    const { shopDomain, accessToken, _id: tenantId } = req.tenant;
    const customers = await fetchFromShopify(shopDomain, accessToken, "customers");

    for (const c of customers) {
      await Customer.updateOne(
        { tenantId, customerId: c.id.toString() },
        {
          tenantId,
          customerId: c.id.toString(),
          firstName: c.first_name,
          lastName: c.last_name,
          email: c.email,
          phone: c.phone,
          createdAt: new Date(c.created_at),
          updatedAt: new Date(c.updated_at),
        },
        { upsert: true }
      );
    }

    res.json({ message: "Customers synced successfully", count: customers.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Save/update orders
const syncOrders = async (req, res) => {
  try {
    const { shopDomain, accessToken, _id: tenantId } = req.tenant;
    const orders = await fetchFromShopify(shopDomain, accessToken, "orders");

    for (const o of orders) {
      await Order.updateOne(
        { tenantId, orderId: o.id.toString() },
        {
          tenantId,
          orderId: o.id.toString(),
          customerId: o.customer?.id?.toString() || null,
          email: o.customer?.email || o.email || null,
          totalPrice: parseFloat(o.total_price || 0),
          lineItems: o.line_items || [],
          createdAt: new Date(o.created_at),
          updatedAt: new Date(o.updated_at),
        },
        { upsert: true }
      );
    }

    res.json({ message: "Orders synced successfully", count: orders.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Save/update products
const syncProducts = async (req, res) => {
  try {
    const { shopDomain, accessToken, _id: tenantId } = req.tenant;
    const products = await fetchFromShopify(shopDomain, accessToken, "products");

    for (const p of products) {
      await Product.updateOne(
        { tenantId, productId: p.id.toString() },
        {
          tenantId,
          productId: p.id.toString(),
          title: p.title,
          price: parseFloat(p.variants?.[0]?.price || 0),
          createdAt: new Date(p.created_at),
          updatedAt: new Date(p.updated_at),
        },
        { upsert: true }
      );
    }

    res.json({ message: "Products synced successfully", count: products.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { syncCustomers, syncOrders, syncProducts };
