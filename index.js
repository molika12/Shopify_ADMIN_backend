require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const axios = require('axios');


const Tenant = require('./models/Tenant');
const Customer = require('./models/Customer');
const Order = require('./models/Order');
const Product = require('./models/Product');
const authRoutes = require('./routes/authRoutes');
const syncRoutes = require('./routes/syncRoutes');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000, 
})
.then(() => console.log(" MongoDB Connected"))
.catch(err => {
  console.error(" MongoDB Error:", err);
});


app.use('/api/auth', authRoutes);
app.use("/api/sync", syncRoutes);

async function tenantMiddleware(req, res, next) {
  const tenantId = req.headers['x-tenant-id'] || req.query.tenantId;
  if (!tenantId) return res.status(400).json({ error: 'Tenant ID missing' });

  try {
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

    req.tenant = tenant;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


app.get('/api/shopify/customers', tenantMiddleware, async (req, res) => {
  try {
    if (!req.tenant.accessToken) {
      return res.status(400).json({ error: 'No access token for this tenant' });
    }

    const headers = {
      'X-Shopify-Access-Token': req.tenant.accessToken,
      'Content-Type': 'application/json',
    };

    const response = await axios.get(
      `https://${req.tenant.shopDomain}/admin/api/2025-07/customers.json`,
      { headers }
    );

    res.json(response.data.customers || []);
  } catch (error) {
    console.error(' Error fetching Shopify customers:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/shopify/orders', tenantMiddleware, async (req, res) => {
  try {
    if (!req.tenant.accessToken) {
      return res.status(400).json({ error: 'No access token for this tenant' });
    }

    const headers = {
      'X-Shopify-Access-Token': req.tenant.accessToken,
      'Content-Type': 'application/json',
    };

    const response = await axios.get(
      `https://${req.tenant.shopDomain}/admin/api/2025-07/orders.json`,
      { headers }
    );

    res.json(response.data.orders || []);
  } catch (error) {
    console.error(' Error fetching Shopify orders:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/shopify/products', tenantMiddleware, async (req, res) => {
  try {
    if (!req.tenant.accessToken) {
      return res.status(400).json({ error: 'No access token for this tenant' });
    }

    const headers = {
      'X-Shopify-Access-Token': req.tenant.accessToken,
      'Content-Type': 'application/json',
    };

    const response = await axios.get(
      `https://${req.tenant.shopDomain}/admin/api/2025-07/products.json`,
      { headers }
    );

    res.json(response.data.products || []);
  } catch (error) {
    console.error(' Error fetching Shopify products:', error.message);
    res.status(500).json({ error: error.message });
  }
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));


