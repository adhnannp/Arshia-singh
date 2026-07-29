import { NextResponse } from 'next/server';
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
  generateNonce,
  buildAuthorizationUrl,
  getRedirectUri,
} from '../../../../lib/shopify/customer-account';

export async function GET(request) {
  try {
    // 1. Generate PKCE values
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    const state = generateState();
    const nonce = generateNonce();

    // 2. Dynamically build redirect URI from request origin (works on localhost & production)
    const redirectUri = getRedirectUri(request.url);

    // 3. Build Shopify authorization URL
    const authorizationUrl = buildAuthorizationUrl({
      redirectUri,
      state,
      nonce,
      codeChallenge,
    });

    // 4. Set secure HTTP-only cookies to persist verifier, state & nonce for callback
    const response = NextResponse.redirect(authorizationUrl);

    const cookieOpts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes to complete the flow
      path: '/',
    };

    response.cookies.set('as_cv', codeVerifier, cookieOpts);
    response.cookies.set('as_state', state, cookieOpts);
    response.cookies.set('as_nonce', nonce, cookieOpts);
    response.cookies.set('as_redir', redirectUri, cookieOpts);

    return response;
  } catch (err) {
    console.error('[/api/auth/login] Error:', err);
    return NextResponse.redirect(new URL('/?auth_error=login_init_failed', request.url));
  }
}
