import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from "/src/services/api";
import './Auth.css';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('signup');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    description: '',
    avatar: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Create floating particles
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
      particlesContainer.innerHTML = '';
      
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
      }
    }
  }, []);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      description: '',
      avatar: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...submitData } = formData;
      
      const response = await authAPI.register({
        ...submitData,
        role: 'roommate' // Default role, they'll choose later
      });

      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Navigate to role selection
      navigate('/role-selection');

    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  // Prevent multiple submissions
  if (isLoading) return;
    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
      });

      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Check if user has a group, navigate accordingly
      if (response.user.groupId) {
        navigate('/dashboard');
      } else {
        navigate('/role-selection');
      }

    } catch (error) {
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* Animated Background */}
      <div className="auth-background">
        <div className="particles" id="particles"></div>
        <div className="glow-orb glow-orb-1"></div>
        <div className="glow-orb glow-orb-2"></div>
      </div>

<div className="auth-header">
  <button className="auth-back-button" onClick={() => navigate('/')}>
    ← Back to Home
  </button>
</div>

      {/* Auth Container */}
      <div className="auth-container">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-icon">🏠</div>
          <h1>SplitMate</h1>
          <p>Smart Expense Splitting</p>
        </div>

        {/* Auth Card */}
        <div className="auth-card">
          {/* Tabs */}
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'signup' ? 'active' : ''}`} 
              onClick={() => switchTab('signup')}
            >
              Sign Up
            </button>
            <button 
              className={`tab ${activeTab === 'login' ? 'active' : ''}`} 
              onClick={() => switchTab('login')}
            >
              Login
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {/* Sign Up Form */}
          <div className={`form-container ${activeTab === 'signup' ? 'active' : ''}`}>
            <form onSubmit={handleSignup}>
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input 
                    type="text" 
                    name="name"
                    className="form-input" 
                    placeholder="Enter your full name" 
                    required 
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input 
                    type="email" 
                    name="email"
                    className="form-input" 
                    placeholder="Enter your email" 
                    required 
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <div className="input-wrapper">
                  <span className="input-icon">📱</span>
                  <input 
                    type="tel" 
                    name="phone"
                    className="form-input" 
                    placeholder="Enter your phone number" 
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input 
                    type="password" 
                    name="password"
                    className="form-input" 
                    placeholder="Create a password" 
                    required 
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    className="form-input" 
                    placeholder="Re-enter password" 
                    required 
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Fun Description (Optional)</label>
                <div className="input-wrapper">
                  <span className="input-icon">✨</span>
                  <textarea 
                    className="form-input" 
                    name="description"
                    placeholder="Tell us something fun about yourself... ☕"
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="footer-text">
              Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); switchTab('login'); }}>Login</a>
            </div>
          </div>

          {/* Login Form */}
          <div className={`form-container ${activeTab === 'login' ? 'active' : ''}`}>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input 
                    type="email" 
                    name="email"
                    className="form-input" 
                    placeholder="Enter your email" 
                    required 
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input 
                    type="password" 
                    name="password"
                    className="form-input" 
                    placeholder="Enter your password" 
                    required 
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Continue'}
              </button>
            </form>

            <div className="footer-text">
              Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); switchTab('signup'); }}>Sign Up</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;