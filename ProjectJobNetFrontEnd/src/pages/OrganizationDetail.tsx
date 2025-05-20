import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store.ts';
import { 
  fetchOrganizationRequest,
  uploadOrganizationPictureRequest,
  toggleUploadForm 
} from '../slices/organizationSlice.ts';
import { API_BASE_URL } from '../constants.ts';
import './OrganizationDetail.css';

function OrganizationDetail() {
  const { id } = useParams<{id:string}>();
  const dispatch = useDispatch();
  const { currentOrganization: organization, loading, error, showUploadForm, isUploading, uploadError } = 
    useSelector((state: RootState) => state.organization);
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'members' | 'jobs' | 'services'>('info');
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrganizationRequest(id));
    }
  }, [id, dispatch]);

  // Check if user can edit this organization
  useEffect(() => {
    if (user && organization) {
      // Check if user is a member of this organization
      fetch(`${API_BASE_URL}/Organization/${organization.id}/members`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(members => {
          const isUserMember = members.some((member: any) => member.userId === user.id);
          setCanEdit(isUserMember);
          setMembers(members);
        })
        .catch(err => {
          console.error("Failed to check organization membership:", err);
          setCanEdit(false);
        });
    }
  }, [user, organization, token]);

  // Load jobs and services when on those tabs
  useEffect(() => {
    if (!organization) return;
    
    if (activeTab === 'jobs') {
      fetch(`${API_BASE_URL}/jobs/organization/${organization.id}`)
        .then(res => res.json())
        .then(setJobs)
        .catch(err => {
          console.error("Failed to fetch jobs:", err);
          setJobs([]);
        });
    }
    
    if (activeTab === 'services') {
      fetch(`${API_BASE_URL}/services?organizationId=${organization.id}`)
        .then(res => res.json())
        .then(setServices)
        .catch(err => {
          console.error("Failed to fetch services:", err);
          setServices([]);
        });
    }
  }, [activeTab, organization]);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !organization) return;
    
    dispatch(uploadOrganizationPictureRequest({ id: organization.id, file }));
  };

  // Toggle upload form visibility
  const handleToggleUploadForm = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    dispatch(toggleUploadForm());
  };

  if (loading) return <div className="loading-container">Loading...</div>;
  if (error) return <div className="error-container">Error: {error}</div>;
  if (!organization) return <div className="not-found-container">Organization not found</div>;

  const logoImageSrc = organization.logoImageData 
    ? `data:${organization.logoImageContentType || 'image/jpeg'};base64,${organization.logoImageData}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(organization.name)}&size=150&background=245ea0&color=fff`;

  return (
    <div className="organization-container">
      <div className="organization-header">
        <div className="organization-avatar">
          {!isEditing ? (
            <img 
              src={logoImageSrc} 
              alt={organization.name} 
              className="organization-picture"
            />
          ) : (
            <div className="profile-picture-container">
              <div className="avatar-clickable" onClick={handleToggleUploadForm}>
                <img 
                  src={logoImageSrc} 
                  alt={organization.name} 
                  className="organization-picture"
                />
                <div className="click-overlay">
                  <span>Click to change</span>
                </div>
              </div>
              
              {/* Profile picture upload form */}
              {showUploadForm && (
                <div className="profile-picture-menu">
                  {isUploading ? (
                    <div className="menu-item loading">
                      <div className="spinner"></div> Uploading...
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
                          onClick={() => {
                            if (window.confirm('Are you sure you want to remove the organization logo?')) {
                              dispatch(uploadOrganizationPictureRequest({ 
                                id: organization.id, 
                                file: new File([""], "empty.txt") // Empty file to remove logo
                              }));
                            }
                          }}
                        >
                          Remove Logo
                        </button>
                      )}
                    </>
                  )}
                  
                  {uploadError && (
                    <div className="menu-error">
                      {uploadError}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
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
      
      {/* Updated tabs to match user profile styling */}
      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Organization Info
        </button>
        <button 
          className={`tab-button ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          Members
        </button>
        <button 
          className={`tab-button ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          Jobs
        </button>
        <button 
          className={`tab-button ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          Services
        </button>
      </div>
      
      {/* Organization tab content */}
      <div className="tab-content">
        {activeTab === 'info' && (
          <div className="org-info">
            <h3>Organization Details</h3>
            <div className="info-display">
              <div className="info-row">
                <div className="info-label">Name</div>
                <div className="info-value">{organization.name}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Industry</div>
                <div className="info-value">{organization.industry || 'Not specified'}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Website</div>
                <div className="info-value">
                  {organization.website ? (
                    <a href={organization.website} target="_blank" rel="noopener noreferrer">
                      {organization.website}
                    </a>
                  ) : (
                    'Not provided'
                  )}
                </div>
              </div>
              <div className="info-row">
                <div className="info-label">Address</div>
                <div className="info-value">{organization.address || 'Not provided'}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Created</div>
                <div className="info-value">
                  {new Date(organization.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'members' && (
          <div className="org-members">
            <h3>Organization Members</h3>
            <div className="member-list">
              {members.length === 0 ? (
                <p>No members found.</p>
              ) : (
                members.map((member: any) => (
                  <div key={member.id} className="member-card">
                    <div className="member-avatar">
                      <img
                        src={`https://i.pravatar.cc/48?u=${member.userId}`}
                        alt="Member"
                      />
                    </div>
                    <div className="member-info">
                      <h4>{member.userName || member.userId}</h4>
                      <p className="member-role">{member.role || 'Member'}</p>
                      <p className="member-since">
                        Member since: {new Date(member.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'jobs' && (
          <div className="org-jobs">
            <h3>Organization Jobs</h3>
            {canEdit && (
              <Link to="/createVacancy" className="btn btn--primary create-btn">
                Post New Job
              </Link>
            )}
            <div className="jobs-list">
              {jobs.length === 0 ? (
                <p>No jobs posted by this organization.</p>
              ) : (
                <div className="cards-grid">
                  {jobs.map((job: any) => (
                    <Link to={`/vacancies/${job.id}`} key={job.id} className="job-card card clickable">
                      <h4>{job.title}</h4>
                      <div className="subtitle">
                        <span>Location: {job.location}</span>
                        <span> | Salary: ${job.salary}</span>
                      </div>
                      <div className="desc">{job.description.substring(0, 150)}...</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'services' && (
          <div className="org-services">
            <h3>Organization Services</h3>
            {canEdit && (
              <Link to="/createService" className="btn btn--primary create-btn">
                Add New Service
              </Link>
            )}
            <div className="services-list">
              {services.length === 0 ? (
                <p>No services offered by this organization.</p>
              ) : (
                <div className="cards-grid">
                  {services.map((service: any) => (
                    <Link to={`/services/${service.id}`} key={service.id} className="service-card card clickable">
                      <h4>{service.serviceName}</h4>
                      <div className="subtitle">
                        <span>Price: ${service.price}</span>
                        <span> | Rating: {service.upvotes || 0}</span>
                      </div>
                      <div className="desc">{service.description.substring(0, 150)}...</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrganizationDetail;
