const Customer = require('../models/Customer');
const Tenant = require('../models/Tenant');
const { fetchShopifyData } = require('../utils/shopifyApi');

exports.getCustomers = async (req, res) => {
  try {
    const tenantId = req.headers['x-tenant-id'] || req.query.tenantId;
    if (!tenantId) return res.status(400).json({ error: 'Tenant ID required' });

    const tenant = await Tenant.findById(tenantId);
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

    const customers = await fetchShopifyData(tenant.shopDomain, process.env.SHOPIFY_TOKEN, 'customers');

    for (const c of customers) {
      await Customer.updateOne(
        { id: c.id, tenantId },
        { ...c, tenantId },
        { upsert: true }
      );
    }

    res.json(customers);
  } catch (err) {
    console.error('getCustomers error:', err);
    res.status(500).json({ error: err.message });
  }
};

