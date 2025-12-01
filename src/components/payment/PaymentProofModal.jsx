/* global process */
import React, { useState } from 'react';
import './PaymentProofModal.css';

const PaymentProofModal = ({ isOpen, onClose, onProofUpload, expense, currentUser }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a payment screenshot');
      return;
    }

    setIsUploading(true);
    
    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', 'expense_proofs'); // You'll need to create this in Cloudinary

      // Upload to Cloudinary
   
    const cloudName = 'dn3w8b216'; // ← REPLACE THIS with your actual cloud name
    
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });

      const data = await response.json();
      
      if (data.secure_url) {
        // Call parent with the Cloudinary URL
        onProofUpload(data.secure_url);
        onClose();
      } else {
        throw new Error('Upload failed: ' + (data.error?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload payment proof. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="payment-proof-overlay" onClick={handleOverlayClick}>
      <div className="payment-proof-modal">
        <div className="modal-header">
          <h2>Upload Payment Proof</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-content">
          <div className="expense-info">
            <h3>{expense?.title}</h3>
            <p>Amount: ₹{expense?.members?.find(m => m.userId._id === currentUser?.id)?.amount}</p>
          </div>

          <div className="upload-section">
            <div className="upload-area">
              <input
                type="file"
                id="payment-proof"
                accept="image/*"
                onChange={handleFileSelect}
                className="file-input"
              />
              <label htmlFor="payment-proof" className="upload-label">
                {previewUrl ? (
                  <div className="preview-container">
                    <img src={previewUrl} alt="Payment proof preview" className="preview-image" />
                    <div className="preview-overlay">
                      <span>📁 Change Image</span>
                    </div>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon">📁</div>
                    <p>Click to select payment screenshot</p>
                    <small>Supports: JPG, PNG, WebP (Max 5MB)</small>
                  </div>
                )}
              </label>
            </div>

            <div className="upload-tips">
              <h4>📸 Payment Proof Tips:</h4>
              <ul>
                <li>Take clear screenshot of UPI transaction</li>
                <li>Ensure amount and recipient are visible</li>
                <li>Blur sensitive information if needed</li>
                <li>File should be less than 5MB</li>
              </ul>
            </div>
          </div>

          <div className="modal-actions">
            <button className="cancel-btn" onClick={onClose} disabled={isUploading}>
              Cancel
            </button>
            <button 
              className="upload-btn" 
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? 'Uploading...' : '📤 Upload Proof'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProofModal;