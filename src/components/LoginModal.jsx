'use client';

import { useState } from 'react';
import { useAuth } from './AuthContext';

export default function LoginModal() {
  const {
    user,
    loginModalOpen,
    setLoginModalOpen,
    modalView,
    setModalView,
    login,
    register,
    recoverPassword,
    logout
  } = useAuth();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [acceptsMarketing, setAcceptsMarketing] = useState(true);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');

  // Status & feedback
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!loginModalOpen) return null;

  const resetFeedback = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    resetFeedback();
    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please enter both email and password');
      return;
    }

    setSubmitting(true);
    const res = await login(loginEmail, loginPassword);
    setSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Invalid credentials');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    resetFeedback();
    if (!regFirstName || !regEmail || !regPassword) {
      setErrorMsg('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    const res = await register({
      firstName: regFirstName,
      lastName: regLastName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      acceptsMarketing
    });
    setSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Registration failed');
    }
  };

  const handleRecoverSubmit = async (e) => {
    e.preventDefault();
    resetFeedback();
    if (!forgotEmail) {
      setErrorMsg('Please enter your email address');
      return;
    }

    setSubmitting(true);
    const res = await recoverPassword(forgotEmail);
    setSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to send recovery instructions');
    } else {
      setSuccessMsg('Reset instructions sent! Please check your email inbox.');
    }
  };

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
                setModalView('login');
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          /* LOGGED-OUT AUTHENTICATION VIEWS (LOGIN / REGISTER / FORGOT PASSWORD) */
          <div className="auth-forms-container">
            {/* View Selector Tabs */}
            {modalView !== 'forgot_password' && (
              <div className="auth-tab-selector">
                <button
                  type="button"
                  className={`tab-btn ${modalView === 'login' ? 'active' : ''}`}
                  onClick={() => { resetFeedback(); setModalView('login'); }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`tab-btn ${modalView === 'register' ? 'active' : ''}`}
                  onClick={() => { resetFeedback(); setModalView('register'); }}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* ERROR / SUCCESS ALERTS */}
            {errorMsg && <div className="auth-alert error-alert">{errorMsg}</div>}
            {successMsg && <div className="auth-alert success-alert">{successMsg}</div>}

            {/* LOGIN FORM */}
            {modalView === 'login' && (
              <form onSubmit={handleLoginSubmit} className="auth-form">
                <h2 className="login-modal-title">WELCOME BACK</h2>
                <p className="login-modal-desc">Access your orders, saved addresses, and tailored wishlist.</p>

                <div className="form-group">
                  <label className="input-label">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="luxury-input"
                  />
                </div>

                <div className="form-group">
                  <div className="label-row">
                    <label className="input-label">PASSWORD</label>
                    <button
                      type="button"
                      className="forgot-link"
                      onClick={() => { resetFeedback(); setModalView('forgot_password'); }}
                    >
                      Forgot?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="luxury-input"
                  />
                </div>

                <button type="submit" className="primary-auth-btn" disabled={submitting}>
                  {submitting ? 'SIGNING IN...' : 'SIGN IN'}
                </button>
              </form>
            )}

            {/* REGISTRATION FORM */}
            {modalView === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="auth-form">
                <h2 className="login-modal-title">BECOME A MEMBER</h2>
                <p className="login-modal-desc">Join our world of conscious luxury and exclusive privileges.</p>

                <div className="form-row">
                  <div className="form-group half">
                    <label className="input-label">FIRST NAME *</label>
                    <input
                      type="text"
                      required
                      value={regFirstName}
                      onChange={(e) => setRegFirstName(e.target.value)}
                      placeholder="Arshia"
                      className="luxury-input"
                    />
                  </div>
                  <div className="form-group half">
                    <label className="input-label">LAST NAME</label>
                    <input
                      type="text"
                      value={regLastName}
                      onChange={(e) => setRegLastName(e.target.value)}
                      placeholder="Singh"
                      className="luxury-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="input-label">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="luxury-input"
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">MOBILE PHONE NUMBER</label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="luxury-input"
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">PASSWORD *</label>
                  <input
                    type="password"
                    required
                    minLength={5}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="At least 5 characters"
                    className="luxury-input"
                  />
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={acceptsMarketing}
                      onChange={(e) => setAcceptsMarketing(e.target.checked)}
                    />
                    <span>Subscribe to our exclusive collection updates & private previews</span>
                  </label>
                </div>

                <button type="submit" className="primary-auth-btn" disabled={submitting}>
                  {submitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                </button>
              </form>
            )}

            {/* FORGOT PASSWORD FORM */}
            {modalView === 'forgot_password' && (
              <form onSubmit={handleRecoverSubmit} className="auth-form">
                <h2 className="login-modal-title">RESET PASSWORD</h2>
                <p className="login-modal-desc">Enter your email address and we'll send you reset instructions.</p>

                <div className="form-group">
                  <label className="input-label">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="luxury-input"
                  />
                </div>

                <button type="submit" className="primary-auth-btn" disabled={submitting}>
                  {submitting ? 'SENDING...' : 'SEND INSTRUCTIONS'}
                </button>

                <button
                  type="button"
                  className="back-to-login-btn"
                  onClick={() => { resetFeedback(); setModalView('login'); }}
                >
                  ← Return to Sign In
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
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
