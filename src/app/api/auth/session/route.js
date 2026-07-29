import { NextResponse } from 'next/server';
import {
  refreshAccessToken,
  getCustomerProfile,
} from '../../../../lib/shopify/customer-account';

export const runtime = 'edge';

export async function GET(request) {
  try {
    const sessionCookie = request.cookies.get('as_session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false, customer: null });
    }

    let session;
    try {
      session = JSON.parse(sessionCookie);
    } catch {
      return NextResponse.json({ authenticated: false, customer: null });
    }

    const { accessToken, refreshToken, idToken, expiresAt, customer } = session;

    // 1. Check if access token is expired or expiring within 5 minutes
    const fiveMinutes = 5 * 60 * 1000;
    const isExpired = !expiresAt || Date.now() > expiresAt - fiveMinutes;

    let currentAccessToken = accessToken;
    let currentIdToken = idToken;
    let updatedSession = session;

    if (isExpired && refreshToken) {
      try {
        const refreshed = await refreshAccessToken(refreshToken);
        currentAccessToken = refreshed.accessToken;
        if (refreshed.idToken) currentIdToken = refreshed.idToken;
        updatedSession = {
          ...session,
          accessToken: refreshed.accessToken,
          refreshToken: refreshed.refreshToken,
          idToken: currentIdToken,
          expiresAt: refreshed.expiresAt,
        };
      } catch (refreshErr) {
        console.warn('[session] Token refresh failed, user must re-login:', refreshErr.message);
        // Clear invalid session
        const response = NextResponse.json({ authenticated: false, customer: null });
        response.cookies.set('as_session', '', { httpOnly: true, maxAge: 0, path: '/' });
        return response;
      }
    }

    // 2. Resolve fresh customer profile using ID token claims + Customer Account API
    let freshCustomer = await getCustomerProfile({
      accessToken: currentAccessToken,
      idToken: currentIdToken,
    });

    if (!freshCustomer) {
      freshCustomer = customer;
    }

    updatedSession.customer = freshCustomer;

    // 3. Build response with session status and customer profile
    const response = NextResponse.json({
      authenticated: Boolean(freshCustomer),
      customer: freshCustomer,
    });

    // Update session cookie with fresh customer data & tokens
    response.cookies.set('as_session', JSON.stringify(updatedSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('[/api/auth/session] Error:', err);
    return NextResponse.json({ authenticated: false, customer: null });
  }
}
