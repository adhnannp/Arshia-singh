import crypto from 'crypto';

// ─── Shopify Customer Account API Configuration ─────────────────────────────
export const CA_CONFIG = {
  CLIENT_ID: 'f22d876c-2d19-4b39-8334-f8856fcb3412',
  SHOP_ID: '73325543578',
  AUTHORIZE_ENDPOINT: 'https://shopify.com/authentication/73325543578/oauth/authorize',
  TOKEN_ENDPOINT: 'https://shopify.com/authentication/73325543578/oauth/token',
  LOGOUT_ENDPOINT: 'https://shopify.com/authentication/73325543578/logout',
  GRAPHQL_ENDPOINT: 'https://shopify.com/authentication/73325543578/account/customer/api/2024-07/graphql',
  SCOPES: 'openid email customer-account-api:full',
};

// ─── PKCE Utilities ──────────────────────────────────────────────────────────

/**
 * Generate a cryptographically secure code verifier (RFC 7636)
 */
export function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url');
}

/**
 * Compute S256 code challenge from a code verifier (RFC 7636)
 */
export function generateCodeChallenge(verifier) {
  return crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64url');
}

/**
 * Generate a random state string (CSRF protection)
 */
export function generateState() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Generate a random nonce string (replay attack protection)
 */
export function generateNonce() {
  return crypto.randomBytes(16).toString('hex');
}

// ─── OAuth 2.0 Flow Helpers ──────────────────────────────────────────────────

/**
 * Build authorization URL to redirect user to Shopify login
 */
export function buildAuthorizationUrl({ redirectUri, state, nonce, codeChallenge }) {
  const params = new URLSearchParams({
    client_id: CA_CONFIG.CLIENT_ID,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: CA_CONFIG.SCOPES,
    state,
    nonce,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });
  return `${CA_CONFIG.AUTHORIZE_ENDPOINT}?${params.toString()}`;
}

/**
 * Exchange authorization code + verifier for tokens
 */
export async function exchangeCodeForTokens({ code, codeVerifier, redirectUri }) {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: CA_CONFIG.CLIENT_ID,
    redirect_uri: redirectUri,
    code,
    code_verifier: codeVerifier,
  });

  const response = await fetch(CA_CONFIG.TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[CA] Token exchange failed:', response.status, errorText);
    throw new Error(`Token exchange failed: ${response.status}`);
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    idToken: data.id_token,
    expiresIn: data.expires_in,
    expiresAt: Date.now() + (data.expires_in || 7200) * 1000,
  };
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken) {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: CA_CONFIG.CLIENT_ID,
    refresh_token: refreshToken,
  });

  const response = await fetch(CA_CONFIG.TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[CA] Token refresh failed:', response.status, errorText);
    throw new Error(`Token refresh failed: ${response.status}`);
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || refreshToken,
    idToken: data.id_token,
    expiresIn: data.expires_in,
    expiresAt: Date.now() + (data.expires_in || 7200) * 1000,
  };
}

// ─── Customer Account API GraphQL ────────────────────────────────────────────

/**
 * Fetch customer profile, addresses and recent orders from Customer Account API
 */
export async function fetchCustomerAccountProfile(accessToken) {
  const query = `
    query GetCustomerProfile {
      customer {
        id
        firstName
        lastName
        emailAddress {
          emailAddress
        }
        phoneNumber {
          phoneNumber
        }
        defaultAddress {
          id
          address1
          address2
          city
          zoneCode
          zip
          territoryCode
        }
        orders(first: 10) {
          edges {
            node {
              id
              name
              number
              processedAt
              financialStatus
              totalPrice {
                amount
                currencyCode
              }
              lineItems(first: 5) {
                edges {
                  node {
                    title
                    quantity
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(CA_CONFIG.GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken,
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('[CA] GraphQL query error:', response.status, errText);
    throw new Error(`Customer Account API query failed: ${response.status}`);
  }

  const result = await response.json();
  if (result.errors?.length) {
    console.error('[CA] GraphQL errors:', result.errors);
    throw new Error(result.errors[0].message);
  }

  const raw = result?.data?.customer;
  if (!raw) return null;

  const email = raw.emailAddress?.emailAddress || '';
  const phone = raw.phoneNumber?.phoneNumber || '';
  const firstName = raw.firstName || '';
  const lastName = raw.lastName || '';
  const name = `${firstName} ${lastName}`.trim() || email;

  return {
    id: raw.id,
    firstName,
    lastName,
    name,
    email,
    phone,
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(email || 'customer')}`,
    defaultAddress: raw.defaultAddress
      ? {
          id: raw.defaultAddress.id,
          address1: raw.defaultAddress.address1,
          address2: raw.defaultAddress.address2,
          city: raw.defaultAddress.city,
          zip: raw.defaultAddress.zip,
          country: raw.defaultAddress.territoryCode,
        }
      : null,
    orders: raw.orders || { edges: [] },
  };
}

// ─── Logout ──────────────────────────────────────────────────────────────────

/**
 * Build Shopify Customer Account logout URL
 */
export function buildLogoutUrl({ idToken, postLogoutRedirectUri }) {
  const params = new URLSearchParams({
    id_token_hint: idToken || '',
    post_logout_redirect_uri: postLogoutRedirectUri,
  });
  return `${CA_CONFIG.LOGOUT_ENDPOINT}?${params.toString()}`;
}

// ─── Redirect URI Helper ─────────────────────────────────────────────────────

/**
 * Detect the correct redirect URI from the incoming request origin.
 * Works for both localhost dev and production domain.
 */
export function getRedirectUri(requestUrl) {
  const url = new URL(requestUrl);
  const origin = `${url.protocol}//${url.host}`;
  return `${origin}/api/auth/callback`;
}
