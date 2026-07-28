import client from './client';
import { GET_CUSTOMER_DETAILS } from './queries/customer';
import {
  CUSTOMER_ACCESS_TOKEN_CREATE,
  CUSTOMER_CREATE,
  CUSTOMER_RECOVER,
  CUSTOMER_ACCESS_TOKEN_DELETE,
  CUSTOMER_UPDATE
} from './mutations/customer';

/**
 * Log in customer with Email & Password
 */
export async function customerLogin(email, password) {
  try {
    const response = await client.request(CUSTOMER_ACCESS_TOKEN_CREATE, {
      variables: {
        input: { email, password }
      }
    });

    const data = response?.data?.customerAccessTokenCreate;
    if (data?.customerUserErrors && data.customerUserErrors.length > 0) {
      return { success: false, error: data.customerUserErrors[0].message };
    }

    if (data?.customerAccessToken?.accessToken) {
      return {
        success: true,
        accessToken: data.customerAccessToken.accessToken,
        expiresAt: data.customerAccessToken.expiresAt
      };
    }

    return { success: false, error: 'Invalid login credentials' };
  } catch (err) {
    console.error('customerLogin error:', err);
    return { success: false, error: err.message || 'Authentication failed' };
  }
}

/**
 * Register new customer
 */
export async function customerRegister({ firstName, lastName, email, password, phone, acceptsMarketing = true }) {
  try {
    const input = {
      firstName,
      lastName,
      email,
      password,
      acceptsMarketing
    };
    if (phone) {
      // Standard E.164 format check (+911234567890)
      const cleanPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;
      input.phone = cleanPhone;
    }

    const response = await client.request(CUSTOMER_CREATE, {
      variables: { input }
    });

    const data = response?.data?.customerCreate;
    if (data?.customerUserErrors && data.customerUserErrors.length > 0) {
      return { success: false, error: data.customerUserErrors[0].message };
    }

    // Try logging in immediately to fetch token
    const loginRes = await customerLogin(email, password);
    if (loginRes.success) {
      return { success: true, customer: data.customer, accessToken: loginRes.accessToken };
    }

    return { success: true, customer: data.customer };
  } catch (err) {
    console.error('customerRegister error:', err);
    return { success: false, error: err.message || 'Registration failed' };
  }
}

/**
 * Fetch Customer Details by Access Token
 */
export async function fetchCustomerDetails(accessToken) {
  try {
    const response = await client.request(GET_CUSTOMER_DETAILS, {
      variables: { customerAccessToken: accessToken }
    });

    const customer = response?.data?.customer;
    if (!customer) {
      return { success: false, error: 'Customer session expired or invalid' };
    }

    return { success: true, customer };
  } catch (err) {
    console.error('fetchCustomerDetails error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Recover Customer Password
 */
export async function recoverCustomerPassword(email) {
  try {
    const response = await client.request(CUSTOMER_RECOVER, {
      variables: { email }
    });

    const data = response?.data?.customerRecover;
    if (data?.customerUserErrors && data.customerUserErrors.length > 0) {
      return { success: false, error: data.customerUserErrors[0].message };
    }

    return { success: true };
  } catch (err) {
    console.error('recoverCustomerPassword error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Logout Customer (Delete token)
 */
export async function customerLogout(accessToken) {
  try {
    if (accessToken) {
      await client.request(CUSTOMER_ACCESS_TOKEN_DELETE, {
        variables: { customerAccessToken: accessToken }
      });
    }
    return { success: true };
  } catch (err) {
    console.error('customerLogout error:', err);
    return { success: true };
  }
}
