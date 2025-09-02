import React, { useState } from 'react';
import Auth from './Auth';
import './AuthWrapper.css';

const AuthWrapper = ({ onAuthSuccess }) => {
  const [isSignIn, setIsSignIn] = useState(false);

  const handleAuthSuccess = (user) => {
    onAuthSuccess(user);
  };

  const toggleMode = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-header">
        <h1>Sign Language to Voice Converter</h1>
        <p>Create an account or sign in to get started</p>
      </div>
      
      <Auth 
        onAuthSuccess={handleAuthSuccess}
        isSignIn={isSignIn}
      />
      
      <div className="auth-toggle">
        <p>
          {isSignIn ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            className="toggle-btn"
            onClick={toggleMode}
          >
            {isSignIn ? 'Create Account' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthWrapper;

