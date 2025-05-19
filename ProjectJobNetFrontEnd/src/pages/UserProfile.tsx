import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store.ts';
import { fetchNotificationsRequest } from '../slices/notificationsSlice.ts';
import { logout } from '../slices/authSlice.ts';
import { API_BASE_URL } from '../constants.ts';
import { 
  toggleUploadForm, 
  uploadProfilePictureRequest,
  deleteProfilePictureRequest,
  setProfilePictureData
} from '../slices/profileSlice.ts';
import './UserProfile.css';

// Remove any BrowserRouter or Router imports if they exist
// Only use Link, NavLink, useNavigate, etc. from react-router-dom

// Import the separated components
import OrganizationsList from '../components/profile/OrganizationsList.tsx';
import ResumeSection from '../components/profile/ResumeSection.tsx';
import ServicesSection from '../components/profile/ServicesSection.tsx';
import OrdersSection from '../components/profile/OrdersSection.tsx';
import SavedItemsSection from '../components/profile/SavedItemsSection.tsx';
import ProfileSettings from '../components/profile/ProfileSettings.tsx';
import ProfilePictureUploader from '../components/ProfilePictureUploader.tsx';
import OrganizationView from '../components/profile/OrganizationView.tsx';

// Type definitions
type Organization = {
  id: string;
  name: string;
  description: string;
  industry: string;
  website: string;
  address: string;
  logoUrl: string;
  createdAt: string;
  updatedAt: string;
  logoImageData?: string;
  logoImageContentType?: string;
};

type Resume = {
  id: string;
  userId: string;
  content: string;
  fileContent?: string;
  fileName?: string;
  contentType?: string;
  createdAt: string;
  updatedAt: string;
};

type Service = {
  id: string;
  serviceName: string;
  description: string;
  price: number;
  upvotes: number;
  downvotes?: number;
  userId: string;
  categoryId: string;
};

type BlogPost = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  userId: string;
};

type Category = {
  id: string;
  categoryName: string;
  description: string;
};

type Order = {
  id: string;
  serviceId: string;
  authorId: string;
  customerId: string;
  status: string;
  createdAt: string;
  message?: string;
};

function UserProfile() {
  // Redux state
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { 
    profileImageData, 
    profileImageContentType, 
    isUploading, 
    isDeleting,
    uploadError, 
    deleteError,
    showUploadForm 
  } = useSelector((state: RootState) => state.profile);
  const notifications = useSelector((state: RootState) => state.notifications.items);
  const dispatch = useDispatch<AppDispatch>();
  
  // Local state
  const [activeTab, setActiveTab] = useState<'info' | 'resumes' | 'services' | 'notifications' | 'orders' | 'saved' | 'organizations' | 'blogs'>('info');
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [savedPosts, setSavedPosts] = useState<BlogPost[]>([]);
  const [savedVacancies, setSavedVacancies] = useState<any[]>([]);
  const [savedServices, setSavedServices] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [viewMode, setViewMode] = useState<'personal' | 'business'>('personal');
  const [activeOrg, setActiveOrg] = useState<Organization | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phoneNumber: ''
  });

  const [orgActiveTab, setOrgActiveTab] = useState<'info' | 'members' | 'jobs' | 'services'>('info');
  const [isProfileMenuVisible, setIsProfileMenuVisible] = useState(false);

  // Initialize profile data when user data is available
  useEffect(() => {
    if (user) {
      // Initialize edit form data
      setEditFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        address: user.address || '',
        phoneNumber: user.phoneNumber || ''
      });
      
      // Initialize profile picture data
      dispatch(setProfilePictureData({
        imageData: user.profileImageData || null,
        contentType: user.profileImageContentType || null
      }));
    }
  }, [user, dispatch]);

  // Fetch data when component mounts
  useEffect(() => {
    if (!user || !token) return;
    
    // Fetch resumes
    fetch(`${API_BASE_URL}/resumes/byUser/${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setResumes(Array.isArray(data) ? data : data ? [data] : []);
      })
      .catch(err => {
        console.error('Resume fetch error:', err);
        setResumes([]);
      });
      
    // Fetch services
    fetch(`${API_BASE_URL}/services`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setServices(data.filter((s: Service) => s.userId === user.id));
      })
      .catch(() => setServices([]));
      
    // Fetch blog posts
    fetch(`${API_BASE_URL}/BlogPost`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const userPosts = Array.isArray(data) 
          ? data.filter((p: BlogPost) => p.userId === user.id)
          : [];
        setBlogPosts(userPosts);
      })
      .catch(() => setBlogPosts([]));
      
    // Fetch categories
    fetch(`${API_BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
      
    // Fetch orders
    fetch(`${API_BASE_URL}/order/author/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setOrders)
      .catch(() => setOrders([]));
      
    // Fetch notifications
    dispatch(fetchNotificationsRequest({ userId: user.id, token }));
    
    // Fetch user organizations
    fetch(`${API_BASE_URL}/organization/user/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(orgs => {
        setOrganizations(orgs);
      })
      .catch(err => {
        console.error("Failed to load organizations:", err);
        setOrganizations([]);
      });
  }, [user, token, dispatch]);

  // Fetch saved items when 'saved' tab is selected
  useEffect(() => {
    if (activeTab === 'saved' && token && user) {
      // Fetch saved blog posts
      fetch(`${API_BASE_URL}/BlogPost/saved`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(setSavedPosts)
        .catch(() => setSavedPosts([]));

      // Fetch saved vacancies
      fetch(`${API_BASE_URL}/SavedJob?employerId=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(async saves => {
          if (!saves || saves.length === 0) {
            setSavedVacancies([]);
            return;
          }
          
          const vacancies = await Promise.all(
            saves.map(async (save: any) => {
              const res = await fetch(`${API_BASE_URL}/jobs/${save.jobId}`);
              return res.ok ? res.json() : null;
            })
          );
          
          setSavedVacancies(vacancies.filter(Boolean));
        })
        .catch(() => setSavedVacancies([]));

      // Fetch saved services
      fetch(`${API_BASE_URL}/SavedService?userId=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(setSavedServices)
        .catch(() => setSavedServices([]));
    }
  }, [activeTab, token, user]);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/';
  };

  // Handle switching between personal and business view
  const switchViewMode = (mode: 'personal' | 'business', org?: Organization) => {
    setViewMode(mode);
    if (mode === 'business' && org) {
      setActiveOrg(org);
    } else {
      setActiveOrg(null);
    }
  };

  // Handle file input changes for profile picture
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    dispatch(uploadProfilePictureRequest({ file, userId: user.id }));
  };

  // Toggle profile picture upload form
  const handleToggleUploadForm = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event from bubbling up
    dispatch(toggleUploadForm());
  }, [dispatch]);

  // Handle profile picture removal
  const handleRemovePhoto = () => {
    if (!user) return;
    
    if (window.confirm('Are you sure you want to remove your profile picture?')) {
      dispatch(deleteProfilePictureRequest({ userId: user.id }));
    }
  };

  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmitProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token || !user) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...editFormData,
          id: user.id
        })
      });
      
      if (!response.ok) throw new Error('Failed to update profile');
      
      // Update local user data in Redux
      dispatch({ 
        type: 'auth/updateUserProfile', 
        payload: { 
          ...user,
          ...editFormData
        } 
      });
      
      // Exit edit mode
      setIsEditMode(false);
      
      // Show success message
      alert('Profile updated successfully!');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleCancelEdit = useCallback(() => {
    // Reset the form data to original values first
    if (user) {
      setEditFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        address: user.address || '',
        phoneNumber: user.phoneNumber || ''
      });
    }
    // Then exit edit mode
    setIsEditMode(false);
  }, [user]);

  // Improved toggle function for profile picture menu
  const toggleProfileMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Toggle profile menu clicked!");
    setIsProfileMenuVisible(!isProfileMenuVisible);
  };

  // Handle organization profile update
  const handleSubmitOrgUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token || !activeOrg) return;
    
    try {
      // Organization update logic would go here
      console.log('Organization update would happen here');
      
      // Exit edit mode
      setIsEditMode(false);
      
      // Show success message
      alert('Organization updated successfully!');
      
    } catch (error) {
      console.error('Error updating organization:', error);
      alert('Failed to update organization. Please try again.');
    }
  };

  if (!user) return <div className="loading-container">Loading...</div>;

  return (
    <div className="profile-container" onClick={showUploadForm ? () => dispatch(toggleUploadForm()) : undefined}>
      {/* Profile header */}
      <div className="profile-header">
        {/* Replace static avatar with ProfilePictureUploader */}
        <div className="profile-avatar" onClick={(e) => e.stopPropagation()}>
          <div className="profile-picture-container">
            <div 
              className="profile-image-clickable-wrapper"
              onClick={toggleProfileMenu}
              role="button"
              tabIndex={0}
            >
              <img 
                src={profileImageData 
                  ? `data:${profileImageContentType || 'image/jpeg'};base64,${profileImageData}`
                  : `https://i.pravatar.cc/150?u=${user.id}`
                } 
                alt="Profile" 
                className="profile-picture"
              />
              <div className="profile-picture-edit-indicator">
                <span>Edit</span>
              </div>
            </div>
            
            {/* Profile picture upload form - always use isProfileMenuVisible instead of showUploadForm */}
            {isProfileMenuVisible && (
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
                      {profileImageData ? 'Change Photo' : 'Add Photo'}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                    </label>
                    
                    {profileImageData && (
                      <button 
                        className="menu-item delete-btn"
                        onClick={handleRemovePhoto}
                      >
                        Remove Photo
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
        </div>
        <div className="profile-info">
          <h2 className="profile-name">{user.firstName} {user.lastName}</h2>
          <p className="profile-username">@{user.userName}</p>
          <p className="profile-email">{user.email}</p>

          {/* Organization selector - only shown if user has orgs */}
          {organizations.length > 0 && (
            <div className="view-selector">
              <span>View as: </span>
              <button 
                className={viewMode === 'personal' ? 'active' : ''} 
                onClick={() => switchViewMode('personal')}
              >
                Personal
              </button>
              <div className="org-dropdown">
                <button 
                  className={viewMode === 'business' ? 'active' : ''}
                >
                  {activeOrg?.name || 'Business'} ▼
                </button>
                <div className="dropdown-content">
                  {organizations.map(org => (
                    <button key={org.id} onClick={() => switchViewMode('business', org)}>
                      {org.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="profile-actions">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      {/* View mode specific tabs and content */}
      {viewMode === 'personal' ? (
        <>
          {/* Personal tabs */}
          <div className="profile-tabs">
            {(['info', 'resumes', 'services', 'notifications', 'orders', 'saved', 'organizations', 'blogs'] as const).map(tab => (
              <button
                key={tab}
                className={activeTab === tab ? 'active' : ''}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'notifications' && notifications.length > 0 && (
                  <span className="badge">{notifications.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* Personal tab content */}
          <div className="tab-content">
            {activeTab === 'info' && (
              <div className="info-tab">
                <div className="section-header">
                  <h3>Personal Information</h3>
                  <button 
                    className="btn btn--outline edit-btn"
                    onClick={() => isEditMode ? handleCancelEdit() : setIsEditMode(true)}
                  >
                    {isEditMode ? 'Cancel' : 'Edit Info'}
                  </button>
                </div>

                {isEditMode ? (
                  <form onSubmit={handleSubmitProfileUpdate} className="edit-form">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={editFormData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={editFormData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Address</label>
                      <input
                        type="text"
                        name="address"
                        value={editFormData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={editFormData.phoneNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <button type="submit" className="btn btn--primary save-btn">
                      Save Changes
                    </button>
                  </form>
                ) : (
                  <div className="info-display">
                    <div className="info-row">
                      <div className="info-label">Full Name</div>
                      <div className="info-value">
                        {user.firstName} {user.lastName}
                      </div>
                    </div>
                    
                    <div className="info-row">
                      <div className="info-label">Username</div>
                      <div className="info-value">{user.userName}</div>
                    </div>
                    
                    <div className="info-row">
                      <div className="info-label">Email</div>
                      <div className="info-value">{user.email}</div>
                    </div>
                    
                    <div className="info-row">
                      <div className="info-label">Address</div>
                      <div className="info-value">
                        {user.address || 'Not provided'}
                      </div>
                    </div>
                    
                    <div className="info-row">
                      <div className="info-label">Phone</div>
                      <div className="info-value">
                        {user.phoneNumber || 'Not provided'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'resumes' && (
              <ResumeSection 
                resumes={resumes}
                token={token!}
                userId={user.id}
                setResumes={setResumes}
              />
            )}
            
            {activeTab === 'services' && (
              <ServicesSection 
                services={services}
                categories={categories}
                token={token!}
                userId={user.id}
                setServices={setServices}
              />
            )}
            
            {activeTab === 'orders' && (
              <OrdersSection 
                orders={orders}
                token={token!}
                userId={user.id}
                setOrders={setOrders}
              />
            )}
            
            {activeTab === 'saved' && (
              <SavedItemsSection 
                savedPosts={savedPosts}
                savedVacancies={savedVacancies}
                savedServices={savedServices}
              />
            )}
            
            {activeTab === 'organizations' && (
              <OrganizationsList 
                organizations={organizations}
                token={token}
                userId={user.id}
                onOrganizationCreate={(org) => setOrganizations([...organizations, org])}
                onOrganizationSelect={(org) => switchViewMode('business', org)}
              />
            )}
            
            {activeTab === 'notifications' && (
              <div className="notifications-section">
                <h3>Notifications</h3>
                {notifications.length === 0 ? (
                  <p className="empty-state">You have no notifications.</p>
                ) : (
                  <div className="notifications-list">
                    {notifications.map((notification: any) => (
                      <div key={notification.id} className="notification-item">
                        <div className="notification-content">
                          {notification.status === 'Pending' && 'You have a new order pending approval.'}
                          {notification.status === 'Accepted' && 'An order has been accepted.'}
                          {notification.status === 'Refused' && 'An order has been refused.'}
                          {notification.status === 'Finished' && 'An order has been completed.'}
                        </div>
                        <div className="notification-actions">
                          <button className="view-btn">View</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'blogs' && (
              <div className="blogs-section">
                <div className="section-header">
                  <h3>My Blog Posts</h3>
                  <a href="/create-blog" className="btn btn--primary">Create New Blog Post</a>
                </div>
                
                {blogPosts.length === 0 ? (
                  <p className="empty-state">You haven't published any blog posts yet.</p>
                ) : (
                  <div className="blog-posts-grid">
                    {blogPosts.map(post => (
                      <div key={post.id} className="blog-post-card">
                        <div className="blog-post-header">
                          <h4>{post.title}</h4>
                          <span className="blog-post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="blog-post-content">
                          <p>{post.content.length > 150 
                            ? post.content.substring(0, 150) + '...' 
                            : post.content}
                          </p>
                        </div>
                        <div className="blog-post-actions">
                          <a href={`/blog/${post.id}`} className="btn btn--outline">Read More</a>
                          <a href={`/edit-blog/${post.id}`} className="btn btn--link">Edit</a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        /* Business view mode */
        <>
          {activeOrg && (
            <OrganizationView
              organization={activeOrg}
              isEditMode={isEditMode}
              setIsEditMode={setIsEditMode}
              handleFileChange={handleFileChange}
              handleRemovePhoto={handleRemovePhoto}
              handleSubmitOrgUpdate={handleSubmitOrgUpdate}
              handleCancelEdit={handleCancelEdit}
            />
          )}
        </>
      )}
    </div>
  );
}

export default UserProfile;
