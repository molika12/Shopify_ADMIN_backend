const axios = require('axios');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Product = require('../models/Product');

async function syncShopifyDataForTenant(tenant) {
  if (!tenant.accessToken) {
    console.log(`⚠️ No access token for ${tenant.shopDomain}`);
    return;
  }

  try {
    const headers = {
      'X-Shopify-Access-Token': tenant.accessToken,
      'Content-Type': 'application/json',
    };

    // Customers
    const custRes = await axios.get(
      `https://${tenant.shopDomain}/admin/api/2024-10/customers.json`,
      { headers }
    );
    for (const c of custRes.data.customers) {
      await Customer.updateOne(
        { shopifyId: c.id, tenantId: tenant._id },
        { ...c, shopifyId: c.id, tenantId: tenant._id },
        { upsert: true }
      );
    }

    // Orders
    const orderRes = await axios.get(
      `https://${tenant.shopDomain}/admin/api/2024-10/orders.json`,
      { headers }
    );
    for (const o of orderRes.data.orders) {
      await Order.updateOne(
        { shopifyId: o.id, tenantId: tenant._id },
        { ...o, shopifyId: o.id, tenantId: tenant._id },
        { upsert: true }
      );
    }

    // Products
    const productRes = await axios.get(
      `https://${tenant.shopDomain}/admin/api/2024-10/products.json`,
      { headers }
    );
    for (const p of productRes.data.products) {
      await Product.updateOne(
        { shopifyId: p.id, tenantId: tenant._id },
        { ...p, shopifyId: p.id, tenantId: tenant._id },
        { upsert: true }
      );
    }

    console.log(`✅ Synced Shopify data for tenant ${tenant.shopDomain}`);
  } catch (error) {
    if (error.response) {
      console.error(`❌ Shopify sync failed for tenant ${tenant.shopDomain}:`, error.response.data);
    } else {
      console.error(`❌ Shopify sync failed for tenant ${tenant.shopDomain}:`, error.message);
    }
  }
}

module.exports = { syncShopifyDataForTenant };
