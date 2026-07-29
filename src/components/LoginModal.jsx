'use client';

import { useAuth } from './AuthContext';

export default function LoginModal() {
  const {
    user,
    loginModalOpen,
    setLoginModalOpen,
    login,
    logout
  } = useAuth();

  if (!loginModalOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={() => setLoginModalOpen(false)}>
      <div className="login-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="login-modal-close" onClick={() => setLoginModalOpen(false)} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 1.5L14.5 14.5M1.5 14.5L14.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <span className="login-modal-subtitle">ARSHIA SINGH</span>

        {/* LOGGED-IN CUSTOMER PROFILE VIEW */}
        {user ? (
          <div className="profile-view-container">
            <h2 className="login-modal-title">CUSTOMER PROFILE</h2>

            <div className="profile-badge-header">
              <div className="avatar-circle">
                {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="profile-badge-info">
                <span className="profile-user-name">
                  {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Valued Customer'}
                </span>
                <span className="profile-user-email">{user.email || 'No email registered'}</span>
              </div>
            </div>

            <div className="profile-details-grid">
              <div className="detail-card">
                <span className="detail-label">CONTACT INFORMATION</span>
                <p className="detail-value">{user.phone || 'Phone not added'}</p>
                <p className="detail-subvalue">{user.email}</p>
              </div>

              <div className="detail-card">
                <span className="detail-label">DEFAULT SHIPPING ADDRESS</span>
                {user.defaultAddress ? (
                  <p className="detail-value">
                    {user.defaultAddress.address1}, {user.defaultAddress.city} {user.defaultAddress.zip}, {user.defaultAddress.country}
                  </p>
                ) : (
                  <p className="detail-subvalue">No default address saved yet</p>
                )}
              </div>

              {user.orders && user.orders.edges && user.orders.edges.length > 0 && (
                <div className="detail-card full-width">
                  <span className="detail-label">RECENT ORDERS</span>
                  <div className="orders-list">
                    {user.orders.edges.map(({ node }) => (
                      <div key={node.id} className="order-row">
                        <span className="order-num">#{node.orderNumber}</span>
                        <span className="order-date">{new Date(node.processedAt).toLocaleDateString()}</span>
                        <span className="order-status">{node.financialStatus}</span>
                        <span className="order-total">
                          {node.totalPrice?.currencyCode} ₹{node.totalPrice?.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              className="logout-btn"
              onClick={async () => {
                await logout();
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          /* LOGGED-OUT: OAuth 2.0 Sign-In View */
          <div className="auth-forms-container">
            <div className="auth-form">
              <h2 className="login-modal-title">WELCOME BACK</h2>
              <p className="login-modal-desc">
                Sign in securely via your Arshia Singh account. Manage your orders,
                addresses, and wishlist in one place.
              </p>

              {/* Shopify Customer Account OAuth Button */}
              <button
                id="shopify-oauth-signin-btn"
                className="primary-auth-btn shopify-oauth-btn"
                onClick={() => login()}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '10px', flexShrink: 0 }}>
                  <path d="M20 21C20 18.2386 16.4183 16 12 16C7.58172 16 4 18.2386 4 21M12 12C9.79086 12 8 10.2091 8 8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8C16 10.2091 14.2091 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                CONTINUE TO SIGN IN
              </button>

              <p className="oauth-info-text">
                New to Arshia Singh? You can create an account on the secure sign-in page.
              </p>

              <div className="oauth-security-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C12 22 4 18 4 11V5L12 2L20 5V11C20 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Secured by Shopify · OAuth 2.0 + PKCE
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .shopify-oauth-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }
        .oauth-info-text {
          font-size: 11px;
          color: #888;
          text-align: center;
          line-height: 1.6;
          margin: 0 0 16px 0;
        }
        .oauth-security-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-family: var(--font-mono, monospace);
          font-size: 9px;
          letter-spacing: 0.12em;
          color: #aaa;
          padding: 8px 0;
          border-top: 1px solid #E5E2DC;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalEnter {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .login-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(12px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.3s ease-out forwards;
        }

        .login-modal-card {
          background: #FAF9F6;
          padding: 48px 40px;
          border-radius: 2px;
          width: 100%;
          max-width: 480px;
          position: relative;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.2);
          animation: modalEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          max-height: 90vh;
          overflow-y: auto;
        }

        .login-modal-close {
          position: absolute;
          top: 24px;
          right: 24px;
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s, transform 0.2s;
          padding: 6px;
        }
        .login-modal-close:hover {
          color: #111;
          transform: rotate(90deg);
        }

        .login-modal-subtitle {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          letter-spacing: 0.3em;
          color: #887a64;
          text-transform: uppercase;
          margin-bottom: 12px;
          display: block;
          font-weight: 500;
        }

        .login-modal-title {
          font-family: var(--font-display, serif);
          font-size: 1.8rem;
          color: #111;
          font-weight: 300;
          margin: 0 0 8px 0;
          letter-spacing: 0.04em;
        }

        .login-modal-desc {
          font-family: var(--font-body, sans-serif);
          font-size: 13px;
          color: #666;
          line-height: 1.6;
          margin: 0 0 24px 0;
        }

        /* Tab selector */
        .auth-tab-selector {
          display: flex;
          border-bottom: 1px solid #E5E2DC;
          margin-bottom: 24px;
        }
        .tab-btn {
          flex: 1;
          padding: 12px 0;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #888;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tab-btn.active {
          color: #111;
          border-bottom-color: #111;
          font-weight: 600;
        }

        /* Alerts */
        .auth-alert {
          padding: 12px 14px;
          font-size: 12px;
          margin-bottom: 20px;
          border-radius: 2px;
          line-height: 1.5;
        }
        .error-alert {
          background: #FDF2F2;
          color: #9B1C1C;
          border: 1px solid #F8B4B4;
        }
        .success-alert {
          background: #F0FDF4;
          color: #166534;
          border: 1px solid #BBF7D0;
        }

        /* Forms */
        .auth-form {
          display: flex;
          flex-direction: column;
        }
        .form-row {
          display: flex;
          gap: 12px;
        }
        .form-group {
          margin-bottom: 18px;
          display: flex;
          flex-direction: column;
        }
        .form-group.half {
          flex: 1;
        }
        .input-label {
          font-family: var(--font-mono, monospace);
          font-size: 9px;
          letter-spacing: 0.15em;
          color: #555;
          margin-bottom: 6px;
          font-weight: 500;
        }
        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .forgot-link {
          background: none;
          border: none;
          font-size: 10px;
          color: #887a64;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
        }
        .luxury-input {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #DCD8D0;
          background: #FFF;
          font-size: 13px;
          color: #111;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .luxury-input:focus {
          border-color: #111;
        }

        .checkbox-group {
          margin-bottom: 20px;
        }
        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 11px;
          color: #666;
          cursor: pointer;
          line-height: 1.4;
        }
        .checkbox-label input {
          margin-top: 2px;
        }

        .primary-auth-btn {
          width: 100%;
          padding: 14px;
          background: #111;
          color: #FAF9F6;
          border: 1px solid #111;
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.3s, color 0.3s;
          margin-top: 6px;
        }
        .primary-auth-btn:hover {
          background: transparent;
          color: #111;
        }
        .primary-auth-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .back-to-login-btn {
          background: none;
          border: none;
          margin-top: 16px;
          font-size: 11px;
          color: #666;
          cursor: pointer;
          align-self: center;
        }
        .back-to-login-btn:hover {
          color: #111;
        }

        /* Profile View Styling */
        .profile-view-container {
          display: flex;
          flex-direction: column;
        }
        .profile-badge-header {
          display: flex;
          align-items: center;
          gap: 16px;
          background: #F2EFE9;
          padding: 16px;
          border-radius: 2px;
          margin-bottom: 24px;
        }
        .avatar-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #111;
          color: #FAF9F6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display, serif);
          font-size: 18px;
          font-weight: 500;
        }
        .profile-badge-info {
          display: flex;
          flex-direction: column;
        }
        .profile-user-name {
          font-size: 15px;
          font-weight: 600;
          color: #111;
        }
        .profile-user-email {
          font-size: 12px;
          color: #666;
        }

        .profile-details-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }
        .detail-card {
          border: 1px solid #E5E2DC;
          padding: 14px 16px;
          border-radius: 2px;
          background: #FFF;
        }
        .detail-card.full-width {
          width: 100%;
          box-sizing: border-box;
        }
        .detail-label {
          font-family: var(--font-mono, monospace);
          font-size: 9px;
          letter-spacing: 0.15em;
          color: #887a64;
          display: block;
          margin-bottom: 6px;
        }
        .detail-value {
          font-size: 13px;
          color: #111;
          margin: 0;
          font-weight: 500;
        }
        .detail-subvalue {
          font-size: 12px;
          color: #666;
          margin: 4px 0 0 0;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 8px;
        }
        .order-row {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          padding: 6px 0;
          border-bottom: 1px dashed #E5E2DC;
        }
        .order-row:last-child {
          border-bottom: none;
        }
        .order-num {
          font-weight: 600;
        }

        .logout-btn {
          width: 100%;
          padding: 12px;
          border: 1px solid #9B1C1C;
          background: transparent;
          color: #9B1C1C;
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .logout-btn:hover {
          background: #9B1C1C;
          color: #FFF;
        }
      `}</style>
    </div>
  );
}
