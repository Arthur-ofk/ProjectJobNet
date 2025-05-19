import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store.ts';
import { logout } from '../slices/authSlice.ts';
import { fetchNotificationsRequest } from '../slices/notificationsSlice.ts';
import { API_BASE_URL } from '../constants.ts';
import './ProfilePage.css';

// Import the separated components
import OrganizationsList from '../components/profile/OrganizationsList.tsx';
import ResumeSection from '../components/profile/ResumeSection.tsx';
import ServicesSection from '../components/profile/ServicesSection.tsx';
import OrdersSection from '../components/profile/OrdersSection.tsx';
import SavedItemsSection from '../components/profile/SavedItemsSection.tsx';
import ProfileSettings from '../components/profile/ProfileSettings.tsx';

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
  const notifications = useSelector((state: RootState) => state.notifications.items);
  const dispatch = useDispatch<AppDispatch>();
  
  // Local state
  const [activeTab, setActiveTab] = useState<'info' | 'resumes' | 'services' | 'notifications' | 'orders' | 'saved' | 'organizations'>('info');
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

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      {/* Profile header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={`https://i.pravatar.cc/150?u=${user.id}`} alt="Profile" />
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
            {(['info', 'resumes', 'services', 'notifications', 'orders', 'saved', 'organizations'] as const).map(tab => (
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
              <ProfileSettings 
                user={user} 
                token={token!}
                onLogout={handleLogout}
              />
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
          </div>
        </>
      ) : (
        /* Business view mode */
        <>
          {activeOrg && (
            <div className="business-view">
              <div className="organization-header">
                <h3>{activeOrg.name}</h3>
                <p>{activeOrg.description}</p>
                <div className="organization-details">
                  <span><strong>Industry:</strong> {activeOrg.industry}</span>
                  {activeOrg.website && (
                    <span><strong>Website:</strong> <a href={activeOrg.website} target="_blank" rel="noopener noreferrer">{activeOrg.website}</a></span>
                  )}
                  {activeOrg.address && (
                    <span><strong>Address:</strong> {activeOrg.address}</span>
                  )}
                </div>
              </div>
              
              {/* Organization tabs could go here */}
              <div className="organization-content">
                <p>Business view is under development. You will be able to manage your organization's services, vacancies, and members here.</p>
                <button onClick={() => switchViewMode('personal')} className="action-button">
                  Back to Personal View
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default UserProfile;
