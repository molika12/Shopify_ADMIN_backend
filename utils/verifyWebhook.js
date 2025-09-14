const crypto = require('crypto');

function verifyShopifyWebhook(req, res, next) {
  const hmacHeader = req.get('X-Shopify-Hmac-Sha256');
  const body = req.rawBody; 
  const secret = process.env.SHOPIFY_API_SECRET; 

  const hash = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64');

  if (hash === hmacHeader) {
    next(); 
  } else {
    res.status(401).send('Webhook verification failed');
  }
}

module.exports = verifyShopifyWebhook;

