import { NextResponse } from 'next/server';
import { buildLogoutUrl } from '../../../../lib/shopify/customer-account';

export const runtime = 'edge';

export async function GET(request) {
  try {
    // Read session to get idToken for Shopify logout hint
    const sessionCookie = request.cookies.get('as_session')?.value;
    let idToken = '';

    if (sessionCookie) {
      try {
        const session = JSON.parse(sessionCookie);
        idToken = session.idToken || '';
      } catch {
        // Ignore parse errors
      }
    }

    // Determine post-logout redirect back to the storefront origin
    const url = new URL(request.url);
    const postLogoutRedirectUri = `${url.protocol}//${url.host}`;

    // Build Shopify Customer Account logout URL
    const shopifyLogoutUrl = buildLogoutUrl({ idToken, postLogoutRedirectUri });

    // Clear session and PKCE cookies before redirecting
    const response = NextResponse.redirect(shopifyLogoutUrl);
    const clearOpts = { httpOnly: true, maxAge: 0, path: '/', secure: process.env.NODE_ENV === 'production' };
    response.cookies.set('as_session', '', clearOpts);
    response.cookies.set('as_cv', '', clearOpts);
    response.cookies.set('as_state', '', clearOpts);
    response.cookies.set('as_nonce', '', clearOpts);
    response.cookies.set('as_redir', '', clearOpts);

    return response;
  } catch (err) {
    console.error('[/api/auth/logout] Error:', err);
    // Even on error, clear cookies and redirect home
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('as_session', '', { httpOnly: true, maxAge: 0, path: '/' });
    return response;
  }
}
