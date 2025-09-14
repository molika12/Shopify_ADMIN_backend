const fetch = require("node-fetch");

async function fetchShopifyData(shopDomain, accessToken, resource) {
  if (!shopDomain || !accessToken || !resource) {
    throw new Error('Missing required parameters for Shopify fetch');
  }

  const url = `https://${shopDomain}/admin/api/2025-07/${resource}.json`;

  const response = await fetch(url, {
    headers: {
      "X-Shopify-Access-Token": accessToken,
      "Content-Type": "application/json",
      'Accept': 'application/json'
    },
  });

  if (!response.ok) {
    let errorMessage = `Failed to fetch ${resource} from Shopify: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.errors) {
        errorMessage += ` - ${JSON.stringify(errorData.errors)}`;
      }
    } catch (_) {
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();

  if (!data || !data[resource]) {
    throw new Error(`Unexpected Shopify response format for resource: ${resource}`);
  }

  return data[resource]; 
}

module.exports = { fetchShopifyData };

