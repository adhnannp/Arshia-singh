import { NextResponse } from 'next/server';

// Server-side persistent storage for customer carts across sessions & devices
const memoryCartStore = new Map();

/**
 * Resolve customer key (email or ID) from session cookie or request payload
 */
function getCustomerKey(request, body = null) {
  try {
    // 1. Read from HTTP-only session cookie (Shopify Customer Account OAuth)
    const sessionCookie = request.cookies.get('as_session')?.value;
    if (sessionCookie) {
      const session = JSON.parse(sessionCookie);
      if (session?.customer?.email) return `cart_${session.customer.email.toLowerCase().trim()}`;
      if (session?.customer?.id) return `cart_${session.customer.id}`;
    }

    // 2. Read from body payload
    if (body?.email) {
      return `cart_${body.email.toLowerCase().trim()}`;
    }
    if (body?.customerId) {
      return `cart_${body.customerId}`;
    }

    // 3. Read from query parameters
    const { searchParams } = new URL(request.url);
    const emailParam = searchParams.get('email');
    if (emailParam) {
      return `cart_${emailParam.toLowerCase().trim()}`;
    }
    const idParam = searchParams.get('customerId');
    if (idParam) {
      return `cart_${idParam}`;
    }
  } catch (err) {
    console.warn('[/api/cart] Customer resolution error:', err);
  }
  return null;
}

/**
 * GET /api/cart
 * Fetches the user's cart from server storage (called by Laptop or Phone on load/focus)
 */
export async function GET(request) {
  try {
    const customerKey = getCustomerKey(request);

    if (!customerKey) {
      return NextResponse.json({
        authenticated: false,
        cartItems: [],
        message: 'No authenticated customer identified'
      });
    }

    let cartItems = [];

    // Check Cloudflare KV if bound in environment
    if (typeof process !== 'undefined' && process.env?.CART_KV) {
      try {
        const raw = await process.env.CART_KV.get(customerKey, 'json');
        if (Array.isArray(raw)) cartItems = raw;
      } catch (kvErr) {
        console.warn('[/api/cart GET] KV read error:', kvErr);
      }
    }

    // Fallback to server memory cache
    if (cartItems.length === 0 && memoryCartStore.has(customerKey)) {
      cartItems = memoryCartStore.get(customerKey) || [];
    }

    return NextResponse.json({
      authenticated: true,
      cartItems: Array.isArray(cartItems) ? cartItems : [],
      customerKey
    });
  } catch (err) {
    console.error('[/api/cart GET] Error:', err);
    return NextResponse.json(
      { authenticated: false, cartItems: [], error: err.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cart
 * Saves the user's cart to server storage (called whenever cart changes on Phone or Laptop)
 */
export async function POST(request) {
  try {
    let body = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const customerKey = getCustomerKey(request, body);
    if (!customerKey) {
      return NextResponse.json(
        { success: false, message: 'Unauthenticated. Cannot sync cart without customer identity.' },
        { status: 401 }
      );
    }

    const { cartItems } = body;
    if (!Array.isArray(cartItems)) {
      return NextResponse.json({ error: 'cartItems must be an array' }, { status: 400 });
    }

    const sanitizedItems = cartItems.map((item) => ({
      id: item.id || `${Date.now()}_${Math.random()}`,
      handle: item.handle || '',
      variantId: item.variantId || '',
      name: item.name || '',
      size: item.size || '',
      price: item.price || '0',
      img: item.img || '',
      quantity: typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1,
      quantityAvailable: typeof item.quantityAvailable === 'number' ? item.quantityAvailable : null,
      selectedOptions: item.selectedOptions || null,
      isUnavailable: Boolean(item.isUnavailable),
      stockNotice: item.stockNotice || null,
      updatedAt: Date.now()
    }));

    // Persist in Cloudflare KV if available
    if (typeof process !== 'undefined' && process.env?.CART_KV) {
      try {
        await process.env.CART_KV.put(customerKey, JSON.stringify(sanitizedItems), {
          expirationTtl: 60 * 60 * 24 * 60 // 60 days
        });
      } catch (kvErr) {
        console.warn('[/api/cart POST] KV write error:', kvErr);
      }
    }

    // Persist in server memory cache
    memoryCartStore.set(customerKey, sanitizedItems);

    return NextResponse.json({
      success: true,
      count: sanitizedItems.length,
      customerKey
    });
  } catch (err) {
    console.error('[/api/cart POST] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/cart
 * Clears the customer's cart on server
 */
export async function DELETE(request) {
  try {
    const customerKey = getCustomerKey(request);
    if (customerKey) {
      if (typeof process !== 'undefined' && process.env?.CART_KV) {
        try {
          await process.env.CART_KV.delete(customerKey);
        } catch (kvErr) {
          console.warn('[/api/cart DELETE] KV delete error:', kvErr);
        }
      }
      memoryCartStore.delete(customerKey);
    }
    return NextResponse.json({ success: true, message: 'Server cart cleared' });
  } catch (err) {
    console.error('[/api/cart DELETE] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
