import React from 'react';
import AvatarUploader from '../common/AvatarUploader.tsx';
import { toggleUploadForm } from '../../slices/organizationSlice.ts';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store.ts';
import './OrganizationHeader.css';

interface OrganizationHeaderProps {
  organization: any;
  isEditing: boolean;
  canEdit: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemovePhoto: () => void;
  setIsEditing: (isEdit: boolean) => void;
}

const OrganizationHeader: React.FC<OrganizationHeaderProps> = ({
  organization,
  isEditing,
  canEdit,
  handleFileChange,
  handleRemovePhoto,
  setIsEditing
}) => {
  const dispatch = useDispatch();
  const { showUploadForm, isUploading, uploadError, isDeleting, deleteError } = 
    useSelector((state: RootState) => state.organization);
  
  const handleToggleUploadForm = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    dispatch(toggleUploadForm());
  };

  return (
    <div className="organization-header">
      <div className="organization-avatar">
        <AvatarUploader 
          imageData={organization.logoImageData}
          imageContentType={organization.logoImageContentType}
          name={organization.name}
          isEditing={isEditing}
          showUploadForm={showUploadForm}
          isUploading={isUploading}
          isDeleting={isDeleting}
          uploadError={uploadError}
          deleteError={deleteError}
          onToggleUploadForm={handleToggleUploadForm}
          onFileChange={handleFileChange}
          onRemovePhoto={handleRemovePhoto}
          avatarUrlFallback={`https://ui-avatars.com/api/?name=${encodeURIComponent(organization.name)}&size=150&background=245ea0&color=fff`}
        />
      </div>
      
      <div className="organization-info">
        <h2>{organization.name}</h2>
        <div className="organization-industry">{organization.industry}</div>
        {organization.website && (
          <div className="organization-website">
            <a href={organization.website} target="_blank" rel="noopener noreferrer">
              {organization.website}
            </a>
          </div>
        )}
      </div>
      
      <div className="organization-actions">
        {canEdit && (
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className="btn btn--outline"
          >
            {isEditing ? 'Cancel' : 'Edit Organization'}
          </button>
        )}
      </div>
    </div>
  );
};

export default OrganizationHeader;
