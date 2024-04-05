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
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} appearance={{
      baseTheme: [dark]
    }}
    >
      <Router>
        <Routes>
          {/* Render sign in and sign up components when user is not logged in */}
          <Route path="/login" element={<SignIn path='login' afterSignInUrl="" redirect_url="" signUpUrl="register " afterSignUpUrl="" />} />
          <Route path="/register" element={<SignUp path='register' afterSignUpUrl="" redirect_url="" afterSignInUrl="" signInUrl="login" />} />

          <Route path="/" element={<App />} />
        </Routes>
      </Router>
    </ClerkProvider>
  </React.StrictMode>
);
