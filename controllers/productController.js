const { getShopifyData } = require('../utils/shopify');

exports.getProducts = async (req, res) => {
  const tenantId = req.query.tenantId;
  if (!tenantId) {
    return res.status(400).json({ error: 'Tenant ID required' });
  }

  try {
    const data = await getShopifyData(tenantId, 'products');

    if (!data || !data.products) {
      return res.status(404).json({ error: 'No products found' });
    }

    res.status(200).json(data.products);
  } catch (err) {
    console.error('Error fetching products:', err.response?.data || err.message);
    res.status(500).json({
      error: 'Failed to fetch products from Shopify',
      details: err.message,
    });
  }
};

