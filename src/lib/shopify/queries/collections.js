import client from '../client';

export const GET_COLLECTIONS_QUERY = `#graphql
  query getCollections {
    collections(first: 250) {
      nodes {
        id
        title
        handle
        image {
          url
          altText
        }
        metafield(namespace: "custom", key: "category") {
          value
        }
      }
    }
  }
`;

export async function fetchShopifyCollections() {
  try {
    const response = await client.request(GET_COLLECTIONS_QUERY);
    if (response?.data?.collections?.nodes) {
      return response.data.collections.nodes;
    }
    return [];
  } catch (error) {
    console.error('Error fetching collections from Shopify:', error);
    return [];
  }
}
