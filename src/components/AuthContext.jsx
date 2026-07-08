'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('as_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const loginWithGoogle = () => {
    return new Promise((resolve) => {
      // Simulate Google Sign-in Popup Window
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
                body {
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  height: 100vh;
                  margin: 0;
                  background-color: #f8f9fa;
                  color: #202124;
                }
                .card {
                  background: white;
                  padding: 40px;
                  border-radius: 8px;
                  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
                  text-align: center;
                  max-width: 360px;
                  width: 90%;
                }
                .logo {
                  width: 75px;
                  height: 24px;
                  margin-bottom: 20px;
                }
                h1 {
                  font-size: 24px;
                  font-weight: 400;
                  margin: 0 0 8px 0;
                }
                p {
                  color: #5f6368;
                  font-size: 16px;
                  margin: 0 0 30px 0;
                }
                .user-btn {
                  display: flex;
                  align-items: center;
                  padding: 12px 16px;
                  border: 1px solid #dadce0;
                  border-radius: 20px;
                  background: white;
                  cursor: pointer;
                  width: 100%;
                  box-sizing: border-box;
                  margin-bottom: 12px;
                  transition: background-color 0.2s;
                }
                .user-btn:hover {
                  background-color: #f7f8f8;
                }
                .avatar {
                  width: 32px;
                  height: 32px;
                  border-radius: 50%;
                  margin-right: 12px;
                }
                .user-info {
                  text-align: left;
                }
                .user-name {
                  font-weight: 500;
                  font-size: 14px;
                }
                .user-email {
                  font-size: 12px;
                  color: #5f6368;
                }
              </style>
            </head>
            <body>
              <div class="card">
                <svg class="logo" viewBox="0 0 74 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.2 18.6C4.1 18.6 0 14.4 0 9.3C0 4.2 4.1 0 9.2 0C12 0 14 1.1 15.6 2.6L13.8 4.4C12.7 3.4 11.2 2.5 9.2 2.5C5.6 2.5 2.7 5.5 2.7 9.3C2.7 13.1 5.6 16.1 9.2 16.1C11.6 16.1 13 15.1 13.9 14.2C14.6 13.5 15.1 12.4 15.3 11H9.2V8.6H17.7C17.8 9.1 17.9 9.6 17.9 10.2C17.9 12.1 17.4 14.5 15.7 16.2C14 18 12 18.6 9.2 18.6Z" fill="#4285F4"/>
                  <path d="M29.1 12.7C29.1 16.2 26.5 18.6 23.2 18.6C19.9 18.6 17.3 16.2 17.3 12.7C17.3 9.2 19.9 6.8 23.2 6.8C26.5 6.8 29.1 9.2 29.1 12.7ZM26.4 12.7C26.4 10.4 24.8 8.9 23.2 8.9C21.6 8.9 20 10.4 20 12.7C20 15 21.6 16.5 23.2 16.5C24.8 16.5 26.4 15 26.4 12.7Z" fill="#EA4335"/>
                  <path d="M42.2 12.7C42.2 16.2 39.6 18.6 36.3 18.6C33 18.6 30.4 16.2 30.4 12.7C30.4 9.2 33 6.8 36.3 6.8C39.6 6.8 42.2 9.2 42.2 12.7ZM39.5 12.7C39.5 10.4 37.9 8.9 36.3 8.9C34.7 8.9 33.1 10.4 33.1 12.7C33.1 15 34.7 16.5 36.3 16.5C37.9 16.5 39.5 15 39.5 12.7Z" fill="#FBBC05"/>
                  <path d="M54.8 7.2V17.8C54.8 22.2 52.2 24 49 24C46 24 44.2 22 43.5 20.3L45.9 19.3C46.3 20.3 47.4 21.5 49 21.5C51 21.5 52.2 20.3 52.2 18V17.2H52.1C51.5 17.9 50.4 18.6 48.9 18.6C45.8 18.6 43 15.9 43 12.7C43 9.5 45.8 6.8 48.9 6.8C50.4 6.8 51.5 7.5 52.1 8.2H52.2V7.2H54.8ZM52.4 12.7C52.4 10.4 51 8.9 49.3 8.9C47.6 8.9 46.2 10.4 46.2 12.7C46.2 15 47.6 16.5 49.3 16.5C51 16.5 52.4 15 52.4 12.7Z" fill="#4285F4"/>
                  <path d="M59.1 0.6H61.8V18.1H59.1V0.6Z" fill="#34A853"/>
                  <path d="M70.9 14.8L73 16.2C72.3 17.2 70.8 18.6 68.2 18.6C64.9 18.6 62.4 16 62.4 12.7C62.4 9.3 64.9 6.8 67.9 6.8C70.9 6.8 72.3 9.2 72.8 10.5L73.1 11.2L65.2 14.5C65.8 15.7 66.8 16.3 68.2 16.3C69.6 16.3 70.4 15.6 70.9 14.8ZM65 12.5L69.6 10.6C69.3 9.8 68.4 9.2 67.3 9.2C65.9 9.2 64.8 10.5 65 12.5Z" fill="#EA4335"/>
                </svg>
                <h1>Choose an account</h1>
                <p>to continue to Arshia Singh</p>
                
                <button class="user-btn" onclick="selectUser('Arshia Singh', 'arshia.singh@gmail.com', 'https://lh3.googleusercontent.com/a/ACg8ocI-zG7z8yV-T8pQJ9t3M2_r5tL3S0S1=s96-c')">
                  <img class="avatar" src="/assets/founder.jpeg" onerror="this.src='https://api.dicebear.com/7.x/adventurer/svg?seed=Arshia'" />
                  <div class="user-info">
                    <div class="user-name">Arshia Singh</div>
                    <div class="user-email">arshia.singh@gmail.com</div>
                  </div>
                </button>

                <button class="user-btn" onclick="selectUser('Rahul Sharma', 'rahul.sharma@gmail.com', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Rahul')">
                  <img class="avatar" src="https://api.dicebear.com/7.x/adventurer/svg?seed=Rahul" />
                  <div class="user-info">
                    <div class="user-name">Rahul Sharma</div>
                    <div class="user-email">rahul.sharma@gmail.com</div>
                  </div>
                </button>
              </div>

              <script>
                function selectUser(name, email, avatar) {
                  window.opener.postMessage({
                    type: 'GOOGLE_AUTH_SUCCESS',
                    user: { name, email, avatar }
                  }, window.location.origin);
                  window.close();
                }
              </script>
            </body>
          </html>
        `);
      }

      const handleMessage = (event) => {
        if (event.data && event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          const loggedInUser = event.data.user;
          setUser(loggedInUser);
          localStorage.setItem('as_user', JSON.stringify(loggedInUser));
          setLoginModalOpen(false);
          
          if (pendingAction) {
            pendingAction();
            setPendingAction(null);
          }
          
          window.removeEventListener('message', handleMessage);
          resolve(loggedInUser);
        }
      };

      window.addEventListener('message', handleMessage);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('as_user');
  };

  const requireAuth = (action) => {
    if (user) {
      action();
    } else {
      setPendingAction(() => action);
      setLoginModalOpen(true);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loginModalOpen, setLoginModalOpen, loginWithGoogle, logout, requireAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
