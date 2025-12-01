import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { groupAPI } from "/src/services/api";
import '../components/group/GroupCode.css';

const GroupCode = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [group, setGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const groupCodeRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get group data from location state or fetch from API
  const groupCode = location.state?.groupCode;
  const groupName = location.state?.groupName;

  useEffect(() => {
  const fetchGroupData = async () => {
    try {
      const response = await groupAPI.getMyGroup();
      setGroup(response.group);
    } catch (error) {
      console.error('Error fetching group data:', error);
      // If no group, redirect to role selection
      navigate('/role-selection');
    } finally {
      setIsLoading(false);
    }
  };

  if (groupCode) {
    // If we have group code from navigation, use it
    setGroup({
      code: groupCode,
      name: groupName,
      members: [{ name: 'You', role: '👑 Representative' }],
      memberCount: 1
    });
    setIsLoading(false);
  } else {
    // Otherwise fetch group data from API
    fetchGroupData();
  }

  // Create floating particles
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    particlesContainer.innerHTML = '';
    
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 15 + 's';
      particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
      particlesContainer.appendChild(particle);
    }
  }
}, [groupCode, groupName, navigate]); // Add navigate to dependencies
  const fetchGroupData = async () => {
    try {
      const response = await groupAPI.getMyGroup();
      setGroup(response.group);
    } catch (error) {
      console.error('Error fetching group data:', error);
      // If no group, redirect to role selection
      navigate('/role-selection');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyClick = () => {
    if (group?.code) {
      navigator.clipboard.writeText(group.code).then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      });
    }
  };

  const handleShareClick = () => {
    if (group?.code) {
      const shareText = `Join my expense sharing group "${group.name}" on SplitMate! Use this code: ${group.code}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="group-code-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your group...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="group-code-page">
        <div className="error-container">
          <h2>No Group Found</h2>
          <p>You need to create a group first.</p>
          <button onClick={() => navigate('/role-selection')}>
            Go to Role Selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group-code-page">
      {/* Animated Background */}
      <div className="particles" id="particles"></div>
     
      <div style={{
        position: 'absolute',
        top: '2rem',
        left: '2rem',
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '1.5rem',
        zIndex: 10
      }} onClick={() => navigate('/role-selection')}>
        ↩️
      </div>

      {/* Main Container */}
      <div className="code-container">
        {/* Success Icon */}
        <div className="success-icon">
          <span>🎉</span>
          <h1>Your Group "{group.name}" is Ready!</h1>
        </div>

        {/* Code Card */}
        <div className="code-card">
          <p className="code-label">Your Unique Group Code:</p>

          {/* Code Display */}
          <div className="code-display">
            <div className="code-text" id="groupCode" ref={groupCodeRef}>
              {group.code}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className={`action-btn copy-btn ${isCopied ? 'copied' : ''}`} onClick={handleCopyClick}>
              <span className="btn-icon">📋</span>
              <span>{isCopied ? '✓ Copied!' : 'Copy Code'}</span>
            </button>
            <button className="action-btn share-btn" onClick={handleShareClick}>
              <span className="btn-icon">📤</span>
              <span>Share via WhatsApp</span>
            </button>
          </div>

          {/* Info Text */}
          <p className="info-text">
            Share this code with your roommates so they can join your group!<br />
            Maximum 5 members allowed.
          </p>

          {/* Members Section */}
          <div className="members-section">
            <div className="members-header">Current Members: {group.members?.length || 1}/5</div>
            {group.members?.map((member, index) => (
              <div key={index} className="member-item">
                <div className="member-avatar">
                  {member.userId?.avatar || '👤'}
                </div>
                <div className="member-info">
                  <div className="member-name">
                    {member.userId?.name || 'You'}
                    {member.role && <span className="member-badge">{member.role}</span>}
                  </div>
                  {member.userId?.description && (
                    <div className="member-desc">{member.userId.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Dashboard Button */}
          <button className="dashboard-btn" onClick={handleDashboardClick}>
            <span>Go to Dashboard</span>
            <span style={{ fontSize: '1.5rem' }}>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupCode;