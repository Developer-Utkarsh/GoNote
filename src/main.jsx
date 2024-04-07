import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './Components/App.jsx';
import './index.css';
import { dark } from '@clerk/themes';
// Import Clerk components and provider
import { ClerkProvider, SignedIn, SignedOut, SignIn, SignUp } from '@clerk/clerk-react';

// Retrieve your Clerk publishable key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} appearance={{ baseTheme: [dark] }} navigate={(to) => (window.location.href = to)}>
      <Router>
        <Routes>
          {/* Render sign in and sign up components when user is not logged in */}
          <Route
            exact
            path="/login"
            element={
              <div className="auth-container">
                <SignIn path="login" afterSignInUrl="" redirect_url="" signUpUrl="/register" afterSignUpUrl="" />
              </div>
            }
          />
          <Route
            exact
            path="/register"
            element={
              <div className="auth-container">
                <SignUp path="register" afterSignUpUrl="" redirect_url="" afterSignInUrl="/login" signInUrl="/login" />
              </div>
            }
          />
          <Route exact path="/" element={<App />} />
        </Routes>
      </Router>
    </ClerkProvider>
  </React.StrictMode>
);