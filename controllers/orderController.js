// controllers/orderController.js
const { getShopifyData } = require('../utils/shopify');

// Get all orders from Shopify
exports.getOrders = async (req, res) => {
  const tenantId = req.query.tenantId;
  if (!tenantId) return res.status(400).json({ error: 'Tenant ID required' });

  try {
    const data = await getShopifyData(tenantId, 'orders');

    const orders = data.orders.map((o) => ({
      id: o.id,
      customerName: o.customer
        ? `${o.customer.first_name || ''} ${o.customer.last_name || ''}`.trim()
        : o.shipping_address
        ? `${o.shipping_address.first_name || ''} ${o.shipping_address.last_name || ''}`.trim()
        : "Guest",
      email: o.email || 'N/A',
      date: o.created_at ? new Date(o.created_at).toISOString() : null,
      total: o.total_price ? `${o.total_price} ${o.currency}` : "0.00",
      financialStatus: o.financial_status || 'N/A',
      fulfillmentStatus: o.fulfillment_status || 'unfulfilled',
      lineItems: o.line_items.map((li) => ({
        name: li.name,
        quantity: li.quantity,
        price: li.price,
      })),
    }));

    res.status(200).json(orders);
  } catch (err) {
    console.error("❌ Error fetching orders:", err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
};
