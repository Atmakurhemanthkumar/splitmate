import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "/src/services/api";
import { userAPI  } from "/src/services/api";
import "../components/role/RoleSelection.css";

const RoleSelection = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
  const fetchUserData = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.user);
      
      // If user already has a group, redirect to dashboard
      if (response.user.groupId) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // If not authenticated, redirect to auth
      navigate('/auth');
    } finally {
      setIsLoading(false);
    }
  };

  fetchUserData();
}, [navigate]); // Add navigate to dependencies

  const handleCreateGroup = async () => {
    try {
      setIsLoading(true);
      
    // Update user role to representative (this will create a group automatically)
    const response = await userAPI.updateRole('representative');

      // update user data
     
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Navigate to group code page to show the generated code
      navigate('/group-code', { 
        state: { 
          groupCode: response.group.code,
          groupName: response.group.name 
        } 
      });

    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGroup = () => {
    navigate("/join-group");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  if (isLoading) {
    return (
      <div className="role-selection">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="role-selection">
      {/* Animated Background */}
      <div className="particles" id="particles"></div>
      <div className="glow-orb glow-orb-1"></div>
      <div className="glow-orb glow-orb-2"></div>

      {/* Navbar */}
      <nav className="role-navbar">
        <div className="navbar-left">
          <div className="logo" onClick={handleGoHome}>
            <span>🏠</span>
            <span>SplitMate</span>
          </div>
        </div>
        <div className="navbar-right">
          <div className="user-welcome">
            Welcome, <strong>{user?.name}</strong>!
          </div>
          <div className="nav-icon" onClick={handleGoBack} title="Go Back">
            ↩️
          </div>
          <div className="nav-icon" onClick={handleLogout} title="Logout">
            🚪
          </div>
        </div>
      </nav>

      {/* Role Container */}
      <div className="role-container">
        {/* Header */}
        <div className="header">
          <h1>Welcome, <span className="welcome-name">{user?.name}</span>! 👋</h1>
          <p>Choose how you want to get started with your roommates:</p>
        </div>

        {/* Cards */}
        <div className="cards-container">
          {/* Create Group Card */}
          <div className="role-card create" onClick={handleCreateGroup}>
            <div className="role-icon">👑</div>
            
            <div className="role-content">
              <h2>Create a Group</h2>
              <p>Be the Room Representative</p>
              
              <div className="features">
                <div className="feature-item">
                  <span className="feature-icon">✨</span>
                  <span>Generate a unique code</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">👥</span>
                  <span>Invite up to 5 members</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📊</span>
                  <span>Manage all expenses</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔍</span>
                  <span>View payment proofs</span>
                </div>
              </div>
            </div>

            <button 
              className="role-btn" 
              onClick={handleCreateGroup}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Group'}
            </button>
          </div>

          {/* Join Group Card */}
          <div className="role-card join" onClick={handleJoinGroup}>
            <div className="role-icon">🤝</div>
            
            <div className="role-content">
              <h2>Join a Group</h2>
              <p>Enter Group Code</p>
              
              <div className="features">
                <div className="feature-item">
                  <span className="feature-icon">🔑</span>
                  <span>Use your group code</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💰</span>
                  <span>Track shared expenses</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📸</span>
                  <span>Upload payment proofs</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <span>Mark expenses as paid</span>
                </div>
              </div>
            </div>

            <button className="role-btn" onClick={handleJoinGroup}>
              Enter Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;