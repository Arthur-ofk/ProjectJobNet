import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store.ts';
import { API_BASE_URL } from '../constants.ts';
import './ProfilePictureUploader.css';

type ProfilePictureUploaderProps = {
  entityId: string;  // User ID or Organization ID
  entityType: 'user' | 'organization';
  currentImageData?: string | null;  // Base64 image data
  currentImageContentType?: string | null; // Content type of the image
  onPictureUpdated: (newData: {
    imageData: string | null,
    contentType: string | null
  }) => void;
};

const ProfilePictureUploader: React.FC<ProfilePictureUploaderProps> = ({
  entityId,
  entityType,
  currentImageData,
  currentImageContentType,
  onPictureUpdated
}) => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Generate a default avatar or use the current image data if available
  const defaultAvatar = `https://i.pravatar.cc/150?u=${entityId}`;
  const currentImageUrl = currentImageData 
    ? `data:${currentImageContentType || 'image/jpeg'};base64,${currentImageData}`
    : defaultAvatar;
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    
    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      setError('Image must be less than 2MB');
      return;
    }
    
    // Clear previous errors and create preview
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.[0] || !token) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('profileImage', fileInputRef.current.files[0]);
      
      const endpoint = entityType === 'user' 
        ? `${API_BASE_URL}/users/${entityId}/profileimage`
        : `${API_BASE_URL}/organizations/${entityId}/profileimage`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      onPictureUpdated({
        imageData: data.profileImageData || data.logoImageData,
        contentType: data.profileImageContentType || data.logoImageContentType
      });
      
      setPreviewUrl(null);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!token) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      const endpoint = entityType === 'user' 
        ? `${API_BASE_URL}/users/${entityId}/profileimage`
        : `${API_BASE_URL}/organizations/${entityId}/profileimage`;
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Delete failed: ${response.statusText}`);
      }
      
      onPictureUpdated({
        imageData: null,
        contentType: null
      });
    } catch (err: any) {
      setError(err.message || 'Delete failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="profile-picture-uploader">
      <div className="profile-picture-container">
        <img 
          src={previewUrl || currentImageUrl}
          alt="Profile" 
          className="profile-picture"
        />
      </div>
      
      <div className="profile-picture-actions">
        <label className="btn btn--outline btn--sm">
          Select Image
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
        </label>
        
        {previewUrl && (
          <button 
            className="btn btn--primary btn--sm"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        )}
        
        {currentImageData && (
          <button 
            className="btn btn--danger btn--sm"
            onClick={handleDelete}
            disabled={isUploading}
          >
            {isUploading ? 'Deleting...' : 'Remove'}
          </button>
        )}
      </div>
      
      {isUploading && (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUploader;
