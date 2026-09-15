import client from '../client';

export const GET_TESTIMONIALS_QUERY = `#graphql
  query GetTestimonials($type: String = "testimonials", $first: Int = 20) {
    metaobjects(type: $type, first: $first) {
      edges {
        node {
          id
          handle
          type
          fields {
            key
            value
            reference {
              ... on MediaImage {
                image {
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
          quote: field(key: "quote") { value }
          name: field(key: "name") { value }
          role: field(key: "role") { value }
          city: field(key: "city") { value }
          postmark: field(key: "postmark") { value }
          card_color: field(key: "card_color") { value }
          stamp_tint: field(key: "stamp_tint") { value }
          photo: field(key: "photo") {
            reference {
              ... on MediaImage {
                image {
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
        }
      }
    }
  }
`;

function getFieldValue(node, keys) {
  for (const key of keys) {
    if (node[key]?.value) return node[key].value;
    if (Array.isArray(node.fields)) {
      const found = node.fields.find(
        (f) => f.key === key || f.key?.toLowerCase() === key.toLowerCase()
      );
      if (found?.value) return found.value;
    }
  }
  return '';
}

function getFieldImage(node, keys) {
  for (const key of keys) {
    if (node[key]?.reference?.image?.url) return node[key].reference.image.url;
    if (Array.isArray(node.fields)) {
      const found = node.fields.find(
        (f) => f.key === key || f.key?.toLowerCase() === key.toLowerCase()
      );
      if (found?.reference?.image?.url) return found.reference.image.url;
    }
  }
  return '';
}

function normalizeColor(val, fallback) {
  if (!val || typeof val !== 'string') return fallback;
  const trimmed = val.trim();
  if (trimmed.startsWith('#') || trimmed.startsWith('rgb') || trimmed.startsWith('hsl')) {
    return trimmed;
  }
  if (/^[0-9A-Fa-f]{3,8}$/.test(trimmed)) {
    return `#${trimmed}`;
  }
  return trimmed || fallback;
}

const DEFAULT_PALETTE = [
  { card: '#E9A78C', stamp: '#C4826A' },
  { card: '#8CC7B2', stamp: '#5C9A85' },
  { card: '#F2D07C', stamp: '#B79246' },
  { card: '#CDB4DB', stamp: '#9077A0' },
  { card: '#F0B27A', stamp: '#B27C46' },
  { card: '#A9C4E0', stamp: '#6E8CAE' },
];

export function normalizeTestimonial(node, index = 0) {
  if (!node) return null;

  const defaultColors = DEFAULT_PALETTE[index % DEFAULT_PALETTE.length];
  const quote = getFieldValue(node, ['quote', 'content', 'text']);
  const name = getFieldValue(node, ['name', 'author', 'patron_name']);
  const role = getFieldValue(node, ['role', 'title', 'designation']) || 'Verified Patron';
  const city = getFieldValue(node, ['city', 'location']) || '';
  const postmark = getFieldValue(node, ['postmark', 'date', 'code']) || (city ? `${city.toUpperCase().slice(0, 3)} · 01` : 'AS · 26');
  
  const rawCardColor = getFieldValue(node, ['card_color', 'cardColor', 'color']);
  const rawStampTint = getFieldValue(node, ['stamp_tint', 'stampTint', 'tint']);
  
  const cardColor = normalizeColor(rawCardColor, defaultColors.card);
  const stampTint = normalizeColor(rawStampTint, defaultColors.stamp);

  const photo = getFieldImage(node, ['photo', 'image', 'avatar']) || 'https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg';

  return {
    id: node.id || `testimonial-${index}`,
    handle: node.handle || '',
    quote,
    name,
    role,
    city,
    postmark,
    cardColor,
    stampTint,
    photo,
  };
}

export async function fetchShopifyTestimonials({ type = 'testimonials', first = 20 } = {}) {
  try {
    const response = await client.request(GET_TESTIMONIALS_QUERY, {
      variables: { type, first },
    });

    const edges = response?.data?.metaobjects?.edges;
    if (Array.isArray(edges) && edges.length > 0) {
      return edges
        .map((edge, idx) => normalizeTestimonial(edge.node, idx))
        .filter((item) => Boolean(item && (item.quote || item.name)));
    }

    // Fallback: check singular type 'testimonial' or 'postcard_patron' if needed
    if (type === 'testimonials') {
      const fallbackResponse = await client.request(GET_TESTIMONIALS_QUERY, {
        variables: { type: 'testimonial', first },
      });
      const fallbackEdges = fallbackResponse?.data?.metaobjects?.edges;
      if (Array.isArray(fallbackEdges) && fallbackEdges.length > 0) {
        return fallbackEdges
          .map((edge, idx) => normalizeTestimonial(edge.node, idx))
          .filter((item) => Boolean(item && (item.quote || item.name)));
      }
    }

    return [];
  } catch (error) {
    console.error('Error fetching testimonials from Shopify:', error);
    return [];
  }
}
