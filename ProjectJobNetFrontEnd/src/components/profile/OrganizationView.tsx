import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../../store.ts';
import { toggleUploadForm } from '../../slices/profileSlice.ts';
import OrganizationMembers from '../organization/OrganizationMembers.tsx';
import './OrganizationView.css';

type OrganizationViewProps = {
  organization: any;
  isEditMode: boolean;
  setIsEditMode: (isEdit: boolean) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemovePhoto: () => void;
  handleSubmitOrgUpdate: (e: React.FormEvent) => void;
  handleCancelEdit: () => void;
};

const OrganizationView: React.FC<OrganizationViewProps> = ({
  organization,
  isEditMode,
  setIsEditMode,
  handleFileChange,
  handleRemovePhoto,
  handleSubmitOrgUpdate,
  handleCancelEdit
}) => {
  const { showUploadForm, isUploading, isDeleting, uploadError, deleteError } = 
    useSelector((state: RootState) => state.profile);
  const { token, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  
  const [activeTab, setActiveTab] = useState<'info' | 'members' | 'jobs' | 'services'>('info');
  const [orgFormData, setOrgFormData] = useState({
    name: organization.name || '',
    industry: organization.industry || '',
    website: organization.website || '',
    address: organization.address || '',
    description: organization.description || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrgFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleProfileMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleUploadForm());
  };

  const logoImageSrc = organization.logoImageData 
    ? `data:${organization.logoImageContentType || 'image/jpeg'};base64,${organization.logoImageData}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(organization.name)}&size=150&background=245ea0&color=fff`;

  return (
    <div className="profile-card organization-view-container">
      <div className="profile-card__header">
        <div className="organization-avatar">
          {!isEditMode ? (
            <img 
              src={logoImageSrc} 
              alt={organization.name} 
              className="profile-picture"
            />
          ) : (
            <div className="profile-picture-container">
              <div 
                className="profile-image-clickable-wrapper avatar-clickable"
                onClick={toggleProfileMenu}
                role="button"
                tabIndex={0}
              >
                <img 
                  src={logoImageSrc} 
                  alt={organization.name} 
                  className="profile-picture"
                />
                <div className="profile-picture-edit-indicator"></div>
                <div className="click-overlay">
                  <span>Click to change</span>
                </div>
              </div>
              
              {showUploadForm && (
                <div className="profile-picture-menu">
                  {isUploading ? (
                    <div className="menu-item loading">
                      <div className="spinner"></div> Uploading...
                    </div>
                  ) : isDeleting ? (
                    <div className="menu-item loading">
                      <div className="spinner"></div> Deleting...
                    </div>
                  ) : (
                    <>
                      <label className="menu-item upload-btn">
                        {organization.logoImageData ? 'Change Logo' : 'Add Logo'}
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                        />
                      </label>
                      
                      {organization.logoImageData && (
                        <button 
                          className="menu-item delete-btn"
                          onClick={handleRemovePhoto}
                        >
                          Remove Logo
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
        
        <div className="organization-info">
          <h3 className="profile-name">{organization.name}</h3>
          <p className="profile-industry">{organization.industry}</p>
          {organization.website && (
            <p className="profile-website">
              <a href={organization.website} target="_blank" rel="noopener noreferrer">{organization.website}</a>
            </p>
          )}
        </div>
        
        <div className="profile-actions">
          <button 
            className="btn btn--outline edit-btn"
            onClick={() => isEditMode ? handleCancelEdit() : setIsEditMode(true)}
          >
            {isEditMode ? 'Cancel' : 'Edit Info'}
          </button>
        </div>
      </div>
      
      <div className="profile-tabs">
        {(['info', 'members', 'jobs', 'services'] as const).map(tab => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'info' ? 'Organization Info' : 
             tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="profile-card__body tab-content">
        {activeTab === 'info' && (
          <div className="org-info">
            <h3>Organization Details</h3>
            <dl className="detail-list">
              <div className="detail-item">
                <dt className="detail-term">Name</dt>
                <dd className="detail-desc">{organization.name}</dd>
              </div>
              <div className="detail-item">
                <dt className="detail-term">Industry</dt>
                <dd className="detail-desc">{organization.industry || 'Not specified'}</dd>
              </div>
              <div className="detail-item">
                <dt className="detail-term">Website</dt>
                <dd className="detail-desc">
                  {organization.website ? (
                    <a href={organization.website} target="_blank" rel="noopener noreferrer">
                      {organization.website}
                    </a>
                  ) : (
                    'Not provided'
                  )}
                </dd>
              </div>
              <div className="detail-item">
                <dt className="detail-term">Address</dt>
                <dd className="detail-desc">{organization.address || 'Not provided'}</dd>
              </div>
              <div className="detail-item">
                <dt className="detail-term">Created</dt>
                <dd className="detail-desc">
                  {new Date(organization.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        )}
        
        {activeTab === 'members' && (
          <div className="org-members">
            <OrganizationMembers 
              orgId={organization.id}
              token={token}
              isOwner={user?.id === organization.userId}
            />
          </div>
        )}
        
        {activeTab === 'jobs' && (
          <div className="org-jobs">
            <h3>Organization Jobs</h3>
            <Link to="/createVacancy" className="btn btn--primary create-btn">
              Post New Job
            </Link>
            <div className="cards-grid">
              {/* This would be populated with jobs */}
              <p className="empty-state">No jobs found for this organization.</p>
            </div>
          </div>
        )}
        
        {activeTab === 'services' && (
          <div className="org-services">
            <h3>Organization Services</h3>
            <Link to="/createService" className="btn btn--primary create-btn">
              Add New Service
            </Link>
            <div className="cards-grid">
              {/* This would be populated with services */}
              <p className="empty-state">No services found for this organization.</p>
            </div>
          </div>
        )}
      </div>
      
      {isEditMode && (
        <div className="profile-card__footer">
          <form onSubmit={handleSubmitOrgUpdate} className="edit-form">
            <div className="form-group">
              <label>Organization Name</label>
              <input
                type="text"
                name="name"
                value={orgFormData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>Industry</label>
              <input
                type="text"
                name="industry"
                value={orgFormData.industry}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>Website</label>
              <input
                type="url"
                name="website"
                value={orgFormData.website}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={orgFormData.address}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={orgFormData.description}
                onChange={handleInputChange}
              ></textarea>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn--primary save-btn">
                Save Changes
              </button>
              <button type="button" className="btn btn--outline" onClick={handleCancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default OrganizationView;
