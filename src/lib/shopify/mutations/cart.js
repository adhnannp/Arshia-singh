import client from '../client';
import { GET_PRODUCT_BY_HANDLE_QUERY } from '../queries/products';

export const CREATE_CART_MUTATION = `#graphql
  mutation createCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Create a Shopify Cart using Storefront API and return the checkoutUrl
 * @param {Array} cartItems - Array of cart items from CartContext
 * @returns {Promise<{ checkoutUrl: string|null, error: string|null }>}
 */
export async function createShopifyCheckout(cartItems) {
  if (!cartItems || cartItems.length === 0) {
    return { checkoutUrl: null, error: 'Cart is empty' };
  }

  try {
    const lines = [];

    for (const item of cartItems) {
      let variantId = item.variantId;

      // If variantId is missing, query Shopify by handle to resolve variant ID by size
      if (!variantId && item.handle) {
        try {
          const productRes = await client.request(GET_PRODUCT_BY_HANDLE_QUERY, {
            variables: { handle: item.handle }
          });
          const productNode = productRes?.data?.product;
          if (productNode && productNode.variants?.nodes?.length > 0) {
            const sizeStr = item.size ? item.size.toUpperCase() : '';
            const matchVariant = productNode.variants.nodes.find(v =>
              v.selectedOptions?.some(
                opt => opt.name?.toLowerCase() === 'size' && opt.value?.toUpperCase() === sizeStr
              )
            ) || productNode.variants.nodes[0];
            variantId = matchVariant?.id;
          }
        } catch (e) {
          console.warn(`[Shopify Checkout] Could not fetch variant ID for handle ${item.handle}:`, e.message);
        }
      }

      if (variantId) {
        lines.push({
          merchandiseId: variantId,
          quantity: item.quantity || 1
        });
      }
    }

    if (lines.length === 0) {
      return { checkoutUrl: null, error: 'No valid Shopify product variants found in cart.' };
    }

    const response = await client.request(CREATE_CART_MUTATION, {
      variables: {
        input: { lines }
      }
    });

    const userErrors = response?.data?.cartCreate?.userErrors;
    if (userErrors && userErrors.length > 0) {
      console.error('[Shopify Checkout] cartCreate userErrors:', userErrors);
      return { checkoutUrl: null, error: userErrors.map(e => e.message).join(', ') };
    }

    const checkoutUrl = response?.data?.cartCreate?.cart?.checkoutUrl;
    if (!checkoutUrl) {
      return { checkoutUrl: null, error: 'Shopify did not return a checkout URL.' };
    }

    return { checkoutUrl, error: null };
  } catch (err) {
    console.error('[Shopify Checkout] Failed to create checkout session:', err);
    return { checkoutUrl: null, error: err.message || 'Error creating Shopify checkout' };
  }
}
