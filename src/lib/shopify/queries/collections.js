import client from '../client';

export const GET_COLLECTIONS_QUERY = `#graphql
  query getCollections {
    collections(first: 250) {
      nodes {
        id
        title
        handle
        description
        descriptionHtml
        image {
          url
          altText
        }
        categoryMeta: metafield(namespace: "custom", key: "category") {
          value
          type
          reference {
            ... on Metaobject {
              id
              handle
              type
              fields {
                key
                value
              }
            }
          }
          references(first: 10) {
            nodes {
              ... on Metaobject {
                id
                handle
                type
                fields {
                  key
                  value
                }
              }
            }
          }
        }
        tagMeta: metafield(namespace: "custom", key: "tag") {
          value
          type
          reference {
            ... on Metaobject {
              id
              handle
              type
              fields {
                key
                value
              }
            }
          }
          references(first: 10) {
            nodes {
              ... on Metaobject {
                id
                handle
                type
                fields {
                  key
                  value
                }
              }
            }
          }
        }
        metafields(
          identifiers: [
            { namespace: "custom", key: "tag" }
            { namespace: "custom", key: "category" }
          ]
        ) {
          key
          value
          type
          reference {
            ... on Metaobject {
              id
              handle
              type
              fields {
                key
                value
              }
            }
          }
          references(first: 10) {
            nodes {
              ... on Metaobject {
                id
                handle
                type
                fields {
                  key
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

export function truncateWords(text, limit = 7) {
  if (!text) return '';
  const clean = text.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
  const words = clean.split(' ').filter(Boolean);
  if (words.length <= limit) return clean;
  return words.slice(0, limit).join(' ') + '...';
}

export function parseMetafieldMetaobject(metafield) {
  if (!metafield) return [];
  const results = [];

  // 1. Check single metaobject reference
  if (metafield.reference) {
    const ref = metafield.reference;
    if (ref.handle) results.push(ref.handle);
    if (Array.isArray(ref.fields)) {
      ref.fields.forEach((f) => {
        if (f?.value) results.push(f.value);
      });
    }
  }

  // 2. Check list metaobject references
  if (metafield.references?.nodes && Array.isArray(metafield.references.nodes)) {
    metafield.references.nodes.forEach((ref) => {
      if (ref.handle) results.push(ref.handle);
      if (Array.isArray(ref.fields)) {
        ref.fields.forEach((f) => {
          if (f?.value) results.push(f.value);
        });
      }
    });
  }

  // 3. Check plain string/JSON value (excluding raw GIDs)
  if (metafield.value && typeof metafield.value === 'string') {
    const val = metafield.value.trim();
    if (!val.startsWith('gid://')) {
      if (val.startsWith('[') || val.startsWith('{')) {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) {
            parsed.forEach((p) => {
              if (typeof p === 'string' && !p.startsWith('gid://')) {
                results.push(p);
              }
            });
          } else if (typeof parsed === 'string' && !parsed.startsWith('gid://')) {
            results.push(parsed);
          }
        } catch (e) {}
      } else {
        results.push(val);
      }
    }
  }

  return results;
}

export function extractCollectionTag(node) {
  const candidateValues = [];

  if (node.tagMeta) candidateValues.push(...parseMetafieldMetaobject(node.tagMeta));
  if (node.categoryMeta) candidateValues.push(...parseMetafieldMetaobject(node.categoryMeta));
  if (node.metafield) candidateValues.push(...parseMetafieldMetaobject(node.metafield));

  if (Array.isArray(node.metafields)) {
    node.metafields.forEach((m) => {
      candidateValues.push(...parseMetafieldMetaobject(m));
    });
  }

  const combined = candidateValues.join(' ').toLowerCase();

  if (combined.includes('female') || combined.includes('women') || combined.includes('woman')) {
    return 'Women';
  }
  if (combined.includes('male') || combined.includes('men') || combined.includes('man')) {
    return 'Men';
  }
  if (combined.includes('bespoke') || combined.includes('custom')) {
    return 'Bespoke';
  }

  const firstValid = candidateValues.find((c) => Boolean(c) && !c.startsWith('gid://'));
  if (firstValid) return firstValid;

  return 'Curated';
}

export async function fetchShopifyCollections() {
  try {
    const response = await client.request(GET_COLLECTIONS_QUERY);
    if (response?.data?.collections?.nodes) {
      return response.data.collections.nodes.map((node, index) => {
        const category = extractCollectionTag(node);
        const desc = node.description || '';
        const shortDesc = truncateWords(desc, 7);
        return {
          id: node.id,
          title: node.title,
          handle: node.handle,
          description: desc,
          shortDescription: shortDesc,
          category: category,
          img: node.image?.url || '/assets/new_coll_1.jpg',
          altText: node.image?.altText || node.title,
          rawNode: node,
        };
      });
    }
    return [];
  } catch (error) {
    console.error('Error fetching collections from Shopify:', error);
    return [];
  }
}


