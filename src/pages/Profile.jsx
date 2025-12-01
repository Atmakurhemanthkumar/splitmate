import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '/src/services/api';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userAPI.getProfile();
        setUser(response.user);
        setEditData(response.user);
      } catch (error) {
        console.error('Error fetching profile:', error);
        alert('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form if canceling
      setEditData(user);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await userAPI.updateProfile(editData);
      setUser(response.user);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-error">
        <h2>Error Loading Profile</h2>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Background */}
      <div className="profile-background">
        <div className="profile-glow-orb orb-1"></div>
        <div className="profile-glow-orb orb-2"></div>
      </div>

      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <button className="back-button" onClick={handleBackToDashboard}>
            ← Back to Dashboard
          </button>
          <h1>Your Profile</h1>
          <button 
            className={`edit-button ${isEditing ? 'cancel' : 'edit'}`}
            onClick={handleEditToggle}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile Card */}
        <div className="profile-card">
          {/* Avatar Section */}
          <div className="avatar-section">
            <div className="profile-avatar">
              {user.avatar || '👤'}
            </div>
            {isEditing && (
              <input
                type="text"
                name="avatar"
                value={editData.avatar || ''}
                onChange={handleInputChange}
                placeholder="Enter emoji or image URL"
                className="avatar-input"
              />
            )}
          </div>

          {/* Profile Details */}
          <div className="profile-details">
            <div className="detail-group">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              ) : (
                <div className="detail-value">{user.name}</div>
              )}
            </div>

            <div className="detail-group">
              <label>Email</label>
              <div className="detail-value email">{user.email}</div>
            </div>

            <div className="detail-group">
              <label>Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={editData.phone || ''}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className="edit-input"
                />
              ) : (
                <div className="detail-value">
                  {user.phone || 'Not provided'}
                </div>
              )}
            </div>

            <div className="detail-group">
              <label>Fun Description</label>
              {isEditing ? (
                <textarea
                  name="description"
                  value={editData.description || ''}
                  onChange={handleInputChange}
                  placeholder="Tell us something fun about yourself..."
                  className="edit-textarea"
                  rows="3"
                />
              ) : (
                <div className="detail-value description">
                  {user.description || 'No description yet'}
                </div>
              )}
            </div>

            <div className="detail-group">
              <label>Role</label>
              <div className="role-badge">
                {user.role === 'representative' ? '👑 Representative' : '🎯 Roommate'}
              </div>
            </div>

            {/* Group Info if available */}
            {user.groupId && (
              <div className="detail-group">
                <label>Group Status</label>
                <div className="group-status">
                  🏠 Member of a group
                </div>
              </div>
            )}
          </div>

          {/* Save Button when editing */}
          {isEditing && (
            <div className="save-section">
              <button className="save-button" onClick={handleSave}>
                💾 Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;