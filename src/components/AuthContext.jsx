'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const defaultAuth = {
  user: null,
  sessionLoading: true,
  loginModalOpen: false,
  setLoginModalOpen: () => {},
  modalView: 'login',
  setModalView: () => {},
  login: () => {},
  register: async () => ({ success: false, error: 'Auth not initialized' }),
  recoverPassword: async () => ({ success: false, error: 'Auth not initialized' }),
  loginWithGoogle: async () => {},
  logout: () => {},
  requireAuth: () => {}
};

const AuthContext = createContext(defaultAuth);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [modalView, setModalView] = useState('login');
  const [pendingAction, setPendingAction] = useState(null);

  // ─── On Mount: Check existing Customer Account API session ───────────────
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/session', { cache: 'no-store' });
        const data = await res.json();
        if (data.authenticated && data.customer) {
          setUser(data.customer);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.warn('[AuthContext] Session check failed:', err.message);
        setUser(null);
      } finally {
        setSessionLoading(false);
      }
    }
    checkSession();
  }, []);

  // ─── OAuth 2.0 Login: redirect to /api/auth/login ────────────────────────
  const login = useCallback(() => {
    // Full-page redirect to the OAuth initiation endpoint
    window.location.href = '/api/auth/login';
  }, []);

  // ─── Logout: redirect to /api/auth/logout ────────────────────────────────
  const logout = useCallback(async () => {
    setUser(null);
    window.location.href = '/api/auth/logout';
  }, []);

  // ─── Register: Still uses Storefront API customerCreate then OAuth login ──
  // Note: Customer Account API does not expose a headless registration endpoint.
  // New customers registering must use the Shopify-hosted login portal which
  // includes a "Create Account" option. We surface this by redirecting to login.
  const register = useCallback(async () => {
    // Redirect to Shopify Customer Account portal where user can create an account
    window.location.href = '/api/auth/login';
    return { success: true };
  }, []);

  // ─── Password Recovery: Handled by Shopify Customer Account portal ────────
  const recoverPassword = useCallback(async () => {
    window.location.href = '/api/auth/login';
    return { success: true };
  }, []);

  // ─── Google Sign-In (simulated popup) ────────────────────────────────────
  const loginWithGoogle = useCallback(() => {
    return new Promise((resolve) => {
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        'about:blank',
        'Google Sign-In',
        `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no`
      );

      if (popup) {
        popup.document.write(`
          <html>
            <head>
              <title>Sign in - Google Accounts</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; margin:0; background:#f8f9fa; color:#202124; }
                .card { background:white; padding:40px; border-radius:8px; box-shadow:0 4px 16px rgba(0,0,0,0.08); text-align:center; max-width:360px; width:90%; }
                h1 { font-size:24px; font-weight:400; margin:0 0 8px 0; }
                p { color:#5f6368; font-size:16px; margin:0 0 30px 0; }
                .user-btn { display:flex; align-items:center; padding:12px 16px; border:1px solid #dadce0; border-radius:20px; background:white; cursor:pointer; width:100%; box-sizing:border-box; margin-bottom:12px; transition:background-color 0.2s; }
                .user-btn:hover { background-color:#f7f8f8; }
                .avatar { width:32px; height:32px; border-radius:50%; margin-right:12px; }
                .user-info { text-align:left; }
                .user-name { font-weight:500; font-size:14px; }
                .user-email { font-size:12px; color:#5f6368; }
              </style>
            </head>
            <body>
              <div class="card">
                <h1>Choose an account</h1>
                <p>to continue to Arshia Singh</p>
                <button class="user-btn" onclick="selectUser('Arshia Singh','arshia.singh@gmail.com')">
                  <img class="avatar" src="/assets/founder.jpeg" onerror="this.src='https://api.dicebear.com/7.x/adventurer/svg?seed=Arshia'" />
                  <div class="user-info"><div class="user-name">Arshia Singh</div><div class="user-email">arshia.singh@gmail.com</div></div>
                </button>
                <button class="user-btn" onclick="selectUser('Rahul Sharma','rahul.sharma@gmail.com')">
                  <img class="avatar" src="https://api.dicebear.com/7.x/adventurer/svg?seed=Rahul" />
                  <div class="user-info"><div class="user-name">Rahul Sharma</div><div class="user-email">rahul.sharma@gmail.com</div></div>
                </button>
              </div>
              <script>
                function selectUser(name, email) {
                  window.opener.postMessage({ type:'GOOGLE_AUTH_SUCCESS', user:{ name, email, firstName:name.split(' ')[0], avatar:'https://api.dicebear.com/7.x/adventurer/svg?seed='+encodeURIComponent(email) } }, window.location.origin);
                  window.close();
                }
              </script>
            </body>
          </html>
        `);
      }

      const handleMessage = (event) => {
        if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
          const loggedInUser = event.data.user;
          setUser(loggedInUser);
          setLoginModalOpen(false);
          if (pendingAction) { pendingAction(); setPendingAction(null); }
          window.removeEventListener('message', handleMessage);
          resolve(loggedInUser);
        }
      };
      window.addEventListener('message', handleMessage);
    });
  }, [pendingAction]);

  // ─── Require Auth Gate ────────────────────────────────────────────────────
  const requireAuth = useCallback((action) => {
    if (user) {
      action();
    } else {
      setPendingAction(() => action);
      setLoginModalOpen(true);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        sessionLoading,
        loginModalOpen,
        setLoginModalOpen,
        modalView,
        setModalView,
        login,
        register,
        recoverPassword,
        loginWithGoogle,
        logout,
        requireAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context || defaultAuth;
}
