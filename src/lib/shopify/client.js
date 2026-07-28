import {createStorefrontApiClient} from '@shopify/storefront-api-client';

const client = createStorefrontApiClient({
  storeDomain: 'https://1atm4n-tq.myshopify.com',
  apiVersion: '2025-10',
  publicAccessToken: 'd126fc90f2206215fe16b278468b2da3',
});

export default client;
