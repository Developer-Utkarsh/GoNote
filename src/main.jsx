import React, { useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './Components/App.jsx';
import './index.css';
import { dark } from '@clerk/themes';
// Import Clerk components and provider
import { ClerkProvider, SignedIn, SignedOut, SignIn, SignUp } from '@clerk/clerk-react';
import { useLocation, Navigate } from 'react-router-dom';


// Retrieve your Clerk publishable key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} appearance={{ baseTheme: [dark] }}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);