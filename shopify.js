const fetch = require("node-fetch");

/**
 * Fetch customers, orders, products from Shopify dynamically per tenant.
 * @param {string} shopDomain - Tenant's Shopify store domain
 * @param {string} accessToken - Tenant's Shopify access token (OAuth token)
 * @param {string} resource - Shopify resource to fetch ('customers', 'orders', 'products')
 * @returns {Promise<Array>} - Array of resource objects
 * @throws Will throw an error if fetch fails or Shopify returns non-OK status
 */
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
    // Attempt to extract Shopify error message if available
    let errorMessage = `Failed to fetch ${resource} from Shopify: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.errors) {
        errorMessage += ` - ${JSON.stringify(errorData.errors)}`;
      }
    } catch (_) {
      // Ignore JSON parse errors here
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();

  if (!data || !data[resource]) {
    throw new Error(`Unexpected Shopify response format for resource: ${resource}`);
  }

  return data[resource]; // e.g., customers, orders, products
}

module.exports = { fetchShopifyData };
