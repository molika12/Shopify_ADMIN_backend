// utils/verifyWebhook.js
const crypto = require('crypto');

function verifyShopifyWebhook(req, res, next) {
  const hmacHeader = req.get('X-Shopify-Hmac-Sha256');
  const body = req.rawBody; // we need raw body, see server.js setup below
  const secret = process.env.SHOPIFY_API_SECRET; // put your Shopify API secret in .env

  const hash = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64');

  if (hash === hmacHeader) {
    next(); // verified
  } else {
    res.status(401).send('Webhook verification failed');
  }
}

module.exports = verifyShopifyWebhook;
