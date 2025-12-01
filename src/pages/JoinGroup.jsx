import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupAPI } from '/src/services/api';
import '../components/join/JoinGroup.css';

const JoinGroup = () => {
  const [boxes, setBoxes] = useState(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(''); // 'error', 'success', 'loading'
  const [message, setMessage] = useState('');
  const boxRefs = useRef([]);
  const navigate = useNavigate();

  // Create particles effect
  const createParticles = useCallback(() => {
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
  }, []);

  useEffect(() => {
    createParticles();

    // Focus first box on load
    if (boxRefs.current[0]) {
      boxRefs.current[0].focus();
    }
  }, [createParticles]);

  const handleInputChange = (index, value) => {
    const upperValue = value.toUpperCase();
    
    if (upperValue.match(/[A-Z0-9]/)) {
      const newBoxes = [...boxes];
      newBoxes[index] = upperValue;
      setBoxes(newBoxes);

      // Move to next box
      if (index < boxes.length - 1 && upperValue) {
        boxRefs.current[index + 1].focus();
      }
    } else if (value === '') {
      const newBoxes = [...boxes];
      newBoxes[index] = '';
      setBoxes(newBoxes);
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace handling
    if (e.key === 'Backspace' && !boxes[index] && index > 0) {
      boxRefs.current[index - 1].focus();
      const newBoxes = [...boxes];
      newBoxes[index - 1] = '';
      setBoxes(newBoxes);
    }

    // Arrow key navigation
    if (e.key === 'ArrowLeft' && index > 0) {
      boxRefs.current[index - 1].focus();
    }
    if (e.key === 'ArrowRight' && index < boxes.length - 1) {
      boxRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').toUpperCase();
    
    if (pasteData.length === 6 && pasteData.match(/^[A-Z0-9]{6}$/)) {
      const newBoxes = pasteData.split('');
      setBoxes(newBoxes);
      
      // Focus the last box
      boxRefs.current[5].focus();
    }
  };

  const isFormComplete = boxes.every(box => box !== '');

  const handleSubmit = async () => {
    const code = boxes.join('');
    
    // Reset status
    setStatus('loading');
    setMessage('Joining group...');
    setIsLoading(true);

    try {
      // Call real backend API
      const response = await groupAPI.joinGroup(code);
      
      setStatus('success');
      setMessage('Successfully joined the group! Redirecting...');
      
      // Redirect to dashboard after success
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Failed to join group. Please check the code and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="join-group-page">
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
      <div className="join-container">
        {/* Header Icon */}
        <div className="header-icon">
          <span>🔑</span>
          <h1>Join Your Roommate Group</h1>
        </div>

        {/* Join Card */}
        <div className="join-card">
          <p className="instruction-text">Enter the 6-Digit Group Code:</p>

          {/* Code Input Boxes */}
          <div className="code-input-container">
            {boxes.map((value, index) => (
              <input
                key={index}
                ref={el => boxRefs.current[index] = el}
                type="text"
                maxLength="1"
                className={`code-box ${value ? 'filled' : ''}`}
                value={value}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                data-index={index}
                disabled={isLoading}
              />
            ))}
          </div>

          {/* Submit Button */}
          <button 
            className="submit-btn" 
            onClick={handleSubmit}
            disabled={!isFormComplete || isLoading}
          >
            {isLoading ? (
              <>
                <div className="button-spinner"></div>
                <span>Joining...</span>
              </>
            ) : (
              <>
                <span>Join Group</span>
                <span style={{ fontSize: '1.5rem' }}>➔</span>
              </>
            )}
          </button>

          {/* Status Messages */}
          {status === 'error' && (
            <div className="status-message error shake">
              <span>❌</span>
              <span>{message}</span>
            </div>
          )}

          {status === 'loading' && (
            <div className="status-message loading">
              <div className="spinner"></div>
              <span>{message}</span>
            </div>
          )}

          {status === 'success' && (
            <div className="status-message success">
              <span>✅</span>
              <span>{message}</span>
            </div>
          )}

          {/* Help Text */}
          <p className="help-text">
            <strong>Need a code?</strong><br />
            Ask your Room Representative to share the group code with you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JoinGroup;