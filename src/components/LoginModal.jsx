'use client';

import { useAuth } from './AuthContext';

export default function LoginModal() {
  const { loginModalOpen, setLoginModalOpen, loginWithGoogle } = useAuth();

  if (!loginModalOpen) return null;

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-card">
        <button className="login-modal-close" onClick={() => setLoginModalOpen(false)} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 1.5L14.5 14.5M1.5 14.5L14.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <span className="login-modal-subtitle animate-slide-up" style={{ animationDelay: '0.1s' }}>ARSHIA SINGH</span>
        <h2 className="login-modal-title animate-slide-up" style={{ animationDelay: '0.2s' }}>ELEVATE YOUR EXPERIENCE</h2>
        <p className="login-modal-desc animate-slide-up" style={{ animationDelay: '0.3s' }}>
          Sign in to save pieces to your wishlist, track orders, and shop our conscious luxury collections.
        </p>
        <button className="google-signin-btn animate-slide-up" style={{ animationDelay: '0.4s' }} onClick={loginWithGoogle}>
          <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalEnter {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes itemSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(14px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .login-modal-card {
          background: rgba(250, 249, 246, 0.85);
          backdrop-filter: blur(20px);
          padding: 60px 48px;
          border-radius: 2px;
          width: 100%;
          max-width: 460px;
          text-align: center;
          position: relative;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04);
          animation: modalEnter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .login-modal-close {
          position: absolute;
          top: 24px;
          right: 24px;
          background: none;
          border: none;
          cursor: pointer;
          color: #777;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.3s, transform 0.3s;
          padding: 4px;
        }
        .login-modal-close:hover {
          color: #111;
          transform: rotate(90deg);
        }

        .animate-slide-up {
          opacity: 0;
          animation: itemSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .login-modal-subtitle {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.35em;
          color: #887a64;
          text-transform: uppercase;
          margin-bottom: 18px;
          display: block;
          font-weight: 500;
        }

        .login-modal-title {
          font-family: var(--font-display);
          font-size: 2.4rem;
          color: #111;
          font-weight: 300;
          margin: 0 0 18px 0;
          letter-spacing: 0.03em;
          line-height: 1.25;
        }

        .login-modal-desc {
          font-family: var(--font-body);
          font-size: 15px;
          color: #444;
          line-height: 1.7;
          margin: 0 0 40px 0;
        }

        .google-signin-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          padding: 16px;
          border: 1px solid #111;
          background: #111;
          color: #FAF9F6;
          font-family: var(--font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
        }

        .google-signin-btn:hover {
          background: transparent;
          color: #111;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
        }

        .google-icon {
          background: white;
          padding: 3px;
          border-radius: 50%;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
      `}</style>
    </div>
  );
}
