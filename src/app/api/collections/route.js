import { NextResponse } from 'next/server';
import { fetchShopifyCollections } from '../../../lib/shopify/queries/collections';

export const runtime = 'edge';

export async function GET() {
  try {
    const nodes = await fetchShopifyCollections();
    return NextResponse.json({ nodes });
  } catch (error) {
    console.error('Failed to fetch collections from Shopify:', error);
    return NextResponse.json({ error: error.message, nodes: [] }, { status: 500 });
  }
}
