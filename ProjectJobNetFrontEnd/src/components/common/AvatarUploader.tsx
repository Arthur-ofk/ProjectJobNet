import React from 'react';
import './AvatarUploader.css';

interface AvatarUploaderProps {
  imageData: string | null;
  imageContentType?: string | null;
  name?: string;
  isEditing: boolean;
  showUploadForm: boolean;
  isUploading: boolean;
  isDeleting?: boolean;
  uploadError?: string | null;
  deleteError?: string | null;
  onToggleUploadForm: (e: React.MouseEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto?: () => void;
  avatarUrlFallback?: string;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  imageData,
  imageContentType = 'image/jpeg',
  name = 'User',
  isEditing,
  showUploadForm,
  isUploading,
  isDeleting = false,
  uploadError = null,
  deleteError = null,
  onToggleUploadForm,
  onFileChange,
  onRemovePhoto,
  avatarUrlFallback
}) => {
  // Generate image source URL from either the database image or fallback URL
  const imageSrc = imageData 
    ? `data:${imageContentType || 'image/jpeg'};base64,${imageData}`
    : avatarUrlFallback || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=150&background=245ea0&color=fff`;

  return (
    <div className="avatar-container">
      {!isEditing ? (
        <img 
          src={imageSrc} 
          alt={name} 
          className="avatar-image"
        />
      ) : (
        <div className="avatar-edit-container">
          <div 
            className="avatar-clickable"
            onClick={onToggleUploadForm}
          >
            <img 
              src={imageSrc} 
              alt={name} 
              className="avatar-image"
            />
            <div className="click-overlay">
              <span>Click to change</span>
            </div>
          </div>
          
          {showUploadForm && (
            <div className="avatar-menu">
              {isUploading || isDeleting ? (
                <div className="menu-item loading">
                  <div className="spinner"></div> {isUploading ? 'Uploading...' : 'Deleting...'}
                </div>
              ) : (
                <>
                  <label className="menu-item upload-btn">
                    {imageData ? 'Change Image' : 'Add Image'}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={onFileChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                  
                  {imageData && onRemovePhoto && (
                    <button 
                      className="menu-item delete-btn"
                      onClick={onRemovePhoto}
                    >
                      Remove Image
                    </button>
                  )}
                </>
              )}
              
              {(uploadError || deleteError) && (
                <div className="menu-error">
                  {uploadError || deleteError}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AvatarUploader;
