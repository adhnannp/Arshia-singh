/**
 * DEPRECATED: Legacy Storefront API customer authentication methods.
 *
 * This file has been migrated to the Shopify Customer Account API (OAuth 2.0 + PKCE).
 * All authentication is now handled via Next.js API routes:
 *   - GET /api/auth/login      → Initiate OAuth 2.0 PKCE flow
 *   - GET /api/auth/callback   → Handle Shopify OAuth callback
 *   - GET /api/auth/session    → Check session / refresh token / fetch profile
 *   - GET /api/auth/logout     → Clear session & redirect to Shopify logout
 *
 * See: src/lib/shopify/customer-account.js
 */

// Re-export Customer Account API helpers for convenience
export {
  fetchCustomerAccountProfile,
  refreshAccessToken,
  buildLogoutUrl,
  CA_CONFIG,
} from './customer-account';
