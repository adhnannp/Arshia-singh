import { NextResponse } from 'next/server';
import {
  exchangeCodeForTokens,
  fetchCustomerAccountProfile,
} from '../../../../lib/shopify/customer-account';

export const runtime = 'edge';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const returnedState = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle errors returned from Shopify (e.g. user cancelled)
    if (error) {
      console.error('[callback] Shopify auth error:', error, searchParams.get('error_description'));
      return NextResponse.redirect(new URL(`/?auth_error=${encodeURIComponent(error)}`, request.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL('/?auth_error=missing_code', request.url));
    }

    // 1. Retrieve PKCE cookies
    const storedState = request.cookies.get('as_state')?.value;
    const codeVerifier = request.cookies.get('as_cv')?.value;
    const redirectUri = request.cookies.get('as_redir')?.value;

    if (!storedState || !codeVerifier || !redirectUri) {
      console.error('[callback] Missing PKCE cookies');
      return NextResponse.redirect(new URL('/?auth_error=session_expired', request.url));
    }

    // 2. Validate state to prevent CSRF attacks
    if (returnedState !== storedState) {
      console.error('[callback] State mismatch. Possible CSRF.');
      return NextResponse.redirect(new URL('/?auth_error=state_mismatch', request.url));
    }

    // 3. Exchange auth code + verifier for tokens
    const tokens = await exchangeCodeForTokens({ code, codeVerifier, redirectUri });

    // 4. Fetch customer profile immediately
    let customerProfile = null;
    try {
      customerProfile = await fetchCustomerAccountProfile(tokens.accessToken);
    } catch (profileErr) {
      console.warn('[callback] Could not fetch customer profile:', profileErr.message);
    }

    // 5. Build session payload to store in HTTP-only cookie
    const session = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      idToken: tokens.idToken,
      expiresAt: tokens.expiresAt,
      customer: customerProfile,
    };

    // 6. Store session as JSON in HTTP-only cookie
    const response = NextResponse.redirect(new URL('/', request.url));

    response.cookies.set('as_session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    // 7. Clear PKCE cookies
    const clearOpts = { httpOnly: true, maxAge: 0, path: '/' };
    response.cookies.set('as_cv', '', clearOpts);
    response.cookies.set('as_state', '', clearOpts);
    response.cookies.set('as_nonce', '', clearOpts);
    response.cookies.set('as_redir', '', clearOpts);

    return response;
  } catch (err) {
    console.error('[/api/auth/callback] Error:', err);
    return NextResponse.redirect(new URL('/?auth_error=callback_failed', request.url));
  }
}
