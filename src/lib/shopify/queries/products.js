import client from '../client';

export const GET_COLLECTION_PRODUCTS_QUERY = `#graphql
  query GetCollectionProducts(
    $handle: String!
    $first: Int!
    $after: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      image {
        url
        altText
      }

      products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse) {
        pageInfo {
          hasNextPage
          endCursor
        }

        nodes {
          id
          title
          handle

          featuredImage {
            url
            altText
          }

          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }

          availableForSale

          metafields(
            identifiers: [
              { namespace: "custom", key: "category2" }
              { namespace: "custom", key: "wash_care" }
              { namespace: "custom", key: "fabric" }
              { namespace: "custom", key: "delivery" }
              { namespace: "custom", key: "styling_tip" }
              { namespace: "custom", key: "pockets" }
              { namespace: "custom", key: "category" }
              { namespace: "custom", key: "lining" }
              { namespace: "custom", key: "fit" }
              { namespace: "custom", key: "components" }
            ]
          ) {
            namespace
            key
            value
            type
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE_QUERY = `#graphql
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      availableForSale

      images(first: 20) {
        nodes {
          url
          altText
          width
          height
        }
      }

      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }

      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }

      options {
        id
        name
        values
      }

      variants(first: 50) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
          }
        }
      }

      metafields(
        identifiers: [
          { namespace: "custom", key: "category2" }
          { namespace: "custom", key: "wash_care" }
          { namespace: "custom", key: "fabric" }
          { namespace: "custom", key: "delivery" }
          { namespace: "custom", key: "styling_tip" }
          { namespace: "custom", key: "pockets" }
          { namespace: "custom", key: "category" }
          { namespace: "custom", key: "lining" }
          { namespace: "custom", key: "fit" }
          { namespace: "custom", key: "components" }
          { namespace: "custom", key: "details" }
          { namespace: "custom", key: "textile" }
        ]
      ) {
        namespace
        key
        value
        type
      }
    }
  }
`;

export const GET_ALL_PRODUCTS_QUERY = `#graphql
  query GetAllProducts(
    $query: String
    $first: Int!
    $after: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
  ) {
    products(first: $first, after: $after, query: $query, sortKey: $sortKey, reverse: $reverse) {
      pageInfo {
        hasNextPage
        endCursor
      }

      nodes {
        id
        title
        handle
        description

        featuredImage {
          url
          altText
        }

        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }

        availableForSale

        metafields(
          identifiers: [
            { namespace: "custom", key: "category2" }
            { namespace: "custom", key: "wash_care" }
            { namespace: "custom", key: "fabric" }
            { namespace: "custom", key: "delivery" }
            { namespace: "custom", key: "styling_tip" }
            { namespace: "custom", key: "pockets" }
            { namespace: "custom", key: "category" }
            { namespace: "custom", key: "lining" }
            { namespace: "custom", key: "fit" }
            { namespace: "custom", key: "components" }
          ]
        ) {
          namespace
          key
          value
          type
        }
      }
    }
  }
`;

export async function fetchCollectionProducts({ handle, first = 20, after = null, sortKey = null, reverse = false }) {
  try {
    const variables = { handle, first, after };
    if (sortKey) {
      variables.sortKey = sortKey;
      variables.reverse = reverse;
    }

    const response = await client.request(GET_COLLECTION_PRODUCTS_QUERY, { variables });
    if (response?.data?.collection) {
      return {
        collection: {
          id: response.data.collection.id,
          title: response.data.collection.title,
          handle: response.data.collection.handle,
          description: response.data.collection.description,
          descriptionHtml: response.data.collection.descriptionHtml,
          image: response.data.collection.image,
        },
        products: response.data.collection.products?.nodes || [],
        pageInfo: response.data.collection.products?.pageInfo || { hasNextPage: false, endCursor: null },
      };
    }
    return { collection: null, products: [], pageInfo: { hasNextPage: false, endCursor: null } };
  } catch (error) {
    console.error('Error fetching collection products from Shopify:', error);
    return { collection: null, products: [], pageInfo: { hasNextPage: false, endCursor: null } };
  }
}

export async function fetchProductByHandle(handle) {
  try {
    const response = await client.request(GET_PRODUCT_BY_HANDLE_QUERY, { variables: { handle } });
    if (response?.data?.product) {
      return response.data.product;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching product [${handle}] from Shopify:`, error);
    return null;
  }
}

export async function fetchShopifyProducts({ query = null, first = 50, after = null, sortKey = null, reverse = false }) {
  try {
    const variables = { first, after };
    if (query && query.trim() !== '') {
      variables.query = query.trim();
    }
    if (sortKey) {
      variables.sortKey = sortKey;
      variables.reverse = reverse;
    }

    const response = await client.request(GET_ALL_PRODUCTS_QUERY, { variables });
    if (response?.data?.products) {
      return {
        products: response.data.products.nodes || [],
        pageInfo: response.data.products.pageInfo || { hasNextPage: false, endCursor: null },
      };
    }
    return { products: [], pageInfo: { hasNextPage: false, endCursor: null } };
  } catch (error) {
    console.error('Error fetching all products from Shopify:', error);
    return { products: [], pageInfo: { hasNextPage: false, endCursor: null } };
  }
}
