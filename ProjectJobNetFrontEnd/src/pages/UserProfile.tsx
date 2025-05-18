import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { RootState, AppDispatch } from '../store.ts';
import { API_BASE_URL } from '../constants.ts';
import { fetchPostsRequest } from '../slices/blogSlice.ts';
import { logout } from '../slices/authSlice.ts';
import { fetchNotificationsRequest } from '../slices/notificationsSlice.ts'; // Add this import
import InfoCard from '../components/InfoCard.tsx';
import './UserProfile.css';

// Organization type definition
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

// Other existing types remain the same
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
  // Existing state from the original component
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [tab, setTab] = useState<'info' | 'resumes' | 'services' | 'notifications' | 'orders' | 'saved' | 'organizations'>('info');
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderActionStatus, setOrderActionStatus] = useState<string | null>(null);
  const notifications = useSelector((state: RootState) => state.notifications.items) as Notification[];
  const dispatch = useDispatch<AppDispatch>();
  const [savedPosts, setSavedPosts] = useState<BlogPost[]>([]);
  const navigate = useNavigate();
  const [savedVacancies, setSavedVacancies] = useState<any[]>([]);
  const [savedSubTab, setSavedSubTab] = useState<'posts'|'vacancies'|'services'>('posts');
  const [savedServices, setSavedServices] = useState<BlogPost[]>([]);

  // Add Service Form State
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({
    serviceName: '',
    description: '',
    price: '',
    categoryId: ''
  });

  // Polling interval for order status updates (in ms)
  const POLL_INTERVAL = 3000;

  // New state for organizations
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [newOrg, setNewOrg] = useState({
    name: '',
    description: '',
    industry: '',
    website: '',
    address: '',
    logoUrl: ''
  });

  // Active organization context for business view
  const [activeOrg, setActiveOrg] = useState<Organization | null>(null);
  const [viewMode, setViewMode] = useState<'personal' | 'business'>('personal');

  useEffect(() => {
    if (!user || !token) return;
    setLoading(true);
    setResumeError(null);
    fetch(`${API_BASE_URL}/resumes/byUser/${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      credentials: 'include'
    })
      .then(async res => {
        if (res.status === 401) {
          setResumeError('Unauthorized. Please log in again.');
          setLoading(false);
          return [];
        }
        if (res.status === 404) return [];
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to fetch resumes: ${res.status} ${res.statusText} - ${text}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setResumes(data);
        } else if (data) {
          setResumes([data]);
        } else {
          setResumes([]);
        }
        setResumeError(null);
        setLoading(false);
      })
      .catch((err) => {
        setResumes([]);
        setResumeError('Could not load resume. ' + (err?.message || ''));
        setLoading(false);
        console.error('Resume fetch error:', err);
      });
  }, [user, token]);

  useEffect(() => {
    if (!user) return;
    // Fetch services
    fetch(`${API_BASE_URL}/services`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setServices(data.filter((s: Service) => s.userId === user.id));
      })
      .catch(() => setServices([]));
    // Fetch blog posts - FIX: Filter by user ID
    fetch(`${API_BASE_URL}/BlogPost`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const userPosts = Array.isArray(data) 
          ? data.filter((p: BlogPost) => p.userId === user.id)
          : [];
        setBlogPosts(userPosts);
      })
      .catch(() => setBlogPosts([]));
    // Fetch rating (average from reviews)
    fetch(`${API_BASE_URL}/Review`)
      .then(res => res.json())
      .then(data => {
        const myReviews = data.filter((r: any) => r.targetId === user.id);
        if (myReviews.length > 0) {
          const avg = myReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / myReviews.length;
          setRating(avg);
        } else {
          setRating(null);
        }
      });
    // Set settings initial state
    setSettings({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      address: user.address || '',
      phoneNumber: user.phoneNumber || ''
    });
    // Fetch categories for service form from backend
    fetch(`${API_BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
    // Fetch orders for author notifications tab
    fetch(`${API_BASE_URL}/order/author/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setOrders)
      .catch(() => setOrders([]));
  }, [user, token]);

  useEffect(() => {
    if (user && token) {
      dispatch(fetchNotificationsRequest({ userId: user.id, token: token! }));
      const interval = setInterval(() => {
        dispatch(fetchNotificationsRequest({ userId: user.id, token: token! }));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [user, token, dispatch]);

  useEffect(() => {
    if (tab === 'saved' && token) {
      // saved blog posts
      fetch(`${API_BASE_URL}/BlogPost/saved`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(setSavedPosts)
        .catch(() => setSavedPosts([]));

      // saved vacancies
      fetch(`${API_BASE_URL}/SavedJob?employerId=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(async saves => {
          const jobs = await Promise.all(saves.map((s: any) =>
            fetch(`${API_BASE_URL}/jobs/${s.jobId}`)
              .then(r => r.json())
          ));
          setSavedVacancies(jobs);
        })
        .catch(() => setSavedVacancies([]));

      // fetch saved services
      fetch(`${API_BASE_URL}/BlogPost/saved`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(setSavedServices)
        .catch(() => setSavedServices([]));
    }
  }, [tab, token]);

  // Add a new useEffect for loading user's organizations
  useEffect(() => {
    if (user && token) {
      fetch(`${API_BASE_URL}/organization/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : [])
        .then(orgs => {
          setOrganizations(orgs);
          if (orgs.length > 0 && !activeOrg) {
            setActiveOrg(orgs[0]);
          }
        })
        .catch(err => {
          console.error("Error loading organizations", err);
          setOrganizations([]);
        });
    }
  }, [user, token]);

  // Helper to get auth headers if token exists
  const getAuthHeaders = () => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  };

  // Delete resume by id
  const handleDeleteResume = async (resumeId: string) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    setLoading(true);
    setResumeError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/resumes/${resumeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Failed to delete resume');
      // Refresh resumes after delete
      fetch(`${API_BASE_URL}/resumes/byUser/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(async res => {
          if (res.status === 404) return [];
          if (!res.ok) throw new Error('Failed to fetch resume');
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            setResumes(data);
          } else if (data) {
            setResumes([data]);
          } else {
            setResumes([]);
          }
          setResumeError(null);
          setLoading(false);
        })
        .catch((err) => {
          setResumes([]);
          setResumeError('Could not load resume. ' + (err?.message || ''));
          setLoading(false);
        });
    } catch (err: any) {
      setResumeError('Delete failed: ' + (err?.message || 'Unknown error'));
      setLoading(false);
    }
  };

  // Restrict to 3 resumes
  const canUploadResume = resumes.length < 3;

  // Upload Resume (as file)
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setLoading(true);
    setResumeError(null);
    try {
      const toBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = error => reject(error);
        });

      const base64Content = await toBase64(file);

      const res = await fetch(`${API_BASE_URL}/resumes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          userId: user.id,
          content: '',
          fileContent: base64Content,
          fileName: file.name,
          contentType: file.type
        })
      });
      if (!res.ok) {
        throw new Error('Failed to upload resume');
      }
      // Fetch resumes by user id after upload
      fetch(`${API_BASE_URL}/resumes/byUser/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        credentials: 'include'
      })
        .then(async res => {
          if (res.status === 401) {
            setResumeError('Unauthorized. Please log in again.');
            setLoading(false);
            return [];
          }
          if (res.status === 404) return [];
          if (!res.ok) throw new Error('Failed to fetch resume');
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            setResumes(data);
          } else if (data) {
            setResumes([data]);
          } else {
            setResumes([]);
          }
          setResumeError(null);
          setLoading(false);
        })
        .catch((err) => {
          setResumes([]);
          setResumeError('Could not load resume. ' + (err?.message || ''));
          setLoading(false);
        });
    } catch (err: any) {
      setResumeError('Upload failed: ' + (err?.message || 'Unknown error'));
      setLoading(false);
    }
  };

  // Add Service Form Logic
  const handleAddServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.serviceName || !newService.description || !newService.price || !newService.categoryId) {
      setServiceError('All fields are required.');
      return;
    }
    if (isNaN(Number(newService.price))) {
      setServiceError('Price must be a number.');
      return;
    }
    setLoading(true);
    setServiceError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/services`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          userId: user.id,
          categoryId: newService.categoryId,
          serviceName: newService.serviceName,
          description: newService.description,
          price: Number(newService.price),
          upvotes: 0,
          downvotes: 0
        })
      });
      if (!res.ok) throw new Error('Failed to add service');
      setShowAddService(false);
      setNewService({ serviceName: '', description: '', price: '', categoryId: '' });
      // Refresh services
      fetch(`${API_BASE_URL}/services`)
        .then(res => res.json())
        .then(data => {
          setServices(data.filter((s: Service) => s.userId === user.id));
        });
    } catch (err: any) {
      setServiceError('Add service failed: ' + (err?.message || 'Unknown error'));
    }
    setLoading(false);
  };

  const handleOrderAction = async (orderId: string, action: 'accept' | 'refuse') => {
    if (!token) return;
    setOrderActionStatus(null);
    const res = await fetch(`${API_BASE_URL}/order/${orderId}/${action}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setOrderActionStatus(`Order ${action}ed.`);
      // Refresh orders
      fetch(`${API_BASE_URL}/order/author/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(setOrders);
    } else {
      setOrderActionStatus('Failed to update order.');
    }
  };

  const handleConfirmOrder = async (orderId: string, role: 'author' | 'customer') => {
    if (!token) return;
    setOrderActionStatus(null);
    const res = await fetch(`${API_BASE_URL}/order/${orderId}/confirm`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(role)
    });
    if (res.ok) {
      setOrderActionStatus('Order confirmed.');
      fetch(`${API_BASE_URL}/order/author/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(setOrders);
    } else {
      setOrderActionStatus('Failed to confirm order.');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleConfirm = async (orderId: string, role: 'author' | 'customer') => {
    setOrderActionStatus(null);
    const res = await fetch(`${API_BASE_URL}/order/${orderId}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(role)
    });
    if (res.ok) {
      setOrderActionStatus('Order confirmed successfully.');
    } else {
      setOrderActionStatus('Failed to confirm order.');
    }
  };

  // Optionally, handle rating after order is finished
  const handleRateService = (serviceId: string) => {
    // Redirect to rating/review page or open modal
    window.location.href = `/services/${serviceId}`; // or open a modal for rating
  };

  // New handlers for organization actions
  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user) {
      alert("You must be logged in to create an organization");
      return;
    }
  
    try {
      const requestData = {
        ...newOrg,
        ownerUserId: user.id
      };
      console.log("Creating organization with data:", requestData);
  
      const res = await fetch(`${API_BASE_URL}/organization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server response:", errorText);
        throw new Error(`Failed to create organization: ${res.status} ${res.statusText}. ${errorText}`);
      }
  
      const created = await res.json();
      console.log("Organization created:", created);
      
      setOrganizations([...organizations, created]);
      setShowCreateOrg(false);
      setNewOrg({
        name: '',
        description: '',
        industry: '',
        website: '',
        address: '',
        logoUrl: ''
      });
  
      // Set active org to the newly created one
      setActiveOrg(created);
      setViewMode('business');
    } catch (err) {
      console.error("Error creating organization:", err);
      alert(`Failed to create organization: ${err.message}`);
    }
  };
  

  const switchViewMode = (mode: 'personal' | 'business', org?: Organization) => {
    setViewMode(mode);
    if (mode === 'business' && org) {
      setActiveOrg(org);
    }
  };

  // --- Button Styles ---
  const btnStyle: React.CSSProperties = {
    borderRadius: 8,
    padding: '6px 18px',
    background: '#eaf4fb',
    color: '#245ea0',
    border: '1px solid #b3e0ff',
    fontWeight: 600,
    fontSize: '1rem',
    marginRight: 12,
    marginBottom: 8,
    cursor: 'pointer',
    transition: 'background 0.2s'
  };

  const btnPrimary: React.CSSProperties = {
    ...btnStyle,
    background: '#245ea0',
    color: '#fff',
    border: '1px solid #245ea0'
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      {/* Always visible profile header with enhanced styling */}
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={`https://i.pravatar.cc/150?u=${user?.id}`} alt="Profile" />
        </div>
        <div className="profile-info">
          <h2 className="profile-name">{user?.firstName} {user?.lastName}</h2>
          <p className="profile-username">@{user?.userName}</p>
          <p className="profile-email">{user?.email}</p>

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
        
        {/* Add logout button */}
        <div className="profile-actions">
          <button 
            onClick={handleLogout} 
            className="logout-btn"
            style={{
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginLeft: 'auto'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* View mode specific tabs */}
      {viewMode === 'personal' ? (
        <>
          {/* Personal view tabs */}
          <div className="profile-tabs">
            <button className={tab === 'info' ? 'active' : ''} onClick={() => setTab('info')}>Info</button>
            <button className={tab === 'resumes' ? 'active' : ''} onClick={() => setTab('resumes')}>Resumes</button>
            <button className={tab === 'services' ? 'active' : ''} onClick={() => setTab('services')}>My Services</button>
            <button className={tab === 'notifications' ? 'active' : ''} onClick={() => setTab('notifications')}>Notifications</button>
            <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>My Orders</button>
            <button className={tab === 'saved' ? 'active' : ''} onClick={() => setTab('saved')}>Saved</button>
            <button className={tab === 'organizations' ? 'active' : ''} onClick={() => setTab('organizations')}>Organizations</button>
          </div>

          {/* Content for personal tabs */}
          <div className="profile-content">
            {tab === 'info' && (
              <div className="info-section">
                {/* Full user info with enhanced styling */}
                <div className="user-details">
                  <h3 className="section-title">Personal Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Username:</span>
                      <span className="detail-value">{user?.userName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">{user?.firstName} {user?.lastName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{user?.email}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{user?.phoneNumber || 'Not provided'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Address:</span>
                      <span className="detail-value">{user?.address || 'Not provided'}</span>
                    </div>
                    {user?.dateOfBirth && (
                      <div className="detail-item">
                        <span className="detail-label">Birth Date:</span>
                        <span className="detail-value">{new Date(user.dateOfBirth).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Organization memberships - show all orgs user belongs to */}
                {organizations.length > 0 && (
                  <div className="user-organizations">
                    <h3 className="section-title">Organization Memberships</h3>
                    <div className="org-membership-list">
                      {organizations.map(org => (
                        <div key={org.id} className="org-membership-item">
                          <Link to={`/organizations/${org.id}`} className="org-name">{org.name}</Link>
                          <span className="org-industry">{org.industry}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Blog posts from this user with images */}
                <h3 className="section-title">My Blog Posts</h3>
                <div className="blog-strip">
                  {blogPosts.length === 0 ? (
                    <p>No blog posts yet.</p>
                  ) : (
                    blogPosts.map((post: any) => (
                      <div key={post.id} className="blog-post-card">
                        {post.imageData && (
                          <div className="blog-post-image">
                            <img 
                              src={`data:${post.imageContentType || 'image/jpeg'};base64,${post.imageData}`}
                              alt={post.title}
                            />
                          </div>
                        )}
                        <h4>{post.title}</h4>
                        <p>{post.content.substring(0, 150)}...</p>
                        <Link to={`/posts/${post.id}`}>Read more</Link>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Other tab contents remain largely the same */}
            {tab === 'resumes' && (
              <>
                <h3>Resume</h3>
                {resumeError && <div style={{ color: 'red', marginBottom: 8 }}>{resumeError}</div>}
                {resumes.length > 0 ? (
                  resumes.map(resume => (
                    <div key={resume.id} style={{ marginBottom: 16 }}>
                      <div>
                        <b>File:</b> {resume.fileName ? (
                          <a
                            href={`data:${resume.contentType};base64,${resume.fileContent}`}
                            download={resume.fileName}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#245ea0', textDecoration: 'underline' }}
                          >
                            {resume.fileName}
                          </a>
                        ) : (
                          <span>No file</span>
                        )}
                        <button
                          style={{
                            marginLeft: 16,
                            borderRadius: 8,
                            padding: '4px 12px',
                            background: '#ffeaea',
                            color: '#b71c1c',
                            border: '1px solid #b71c1c',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleDeleteResume(resume.id)}
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </div>
                      <div><b>Last updated:</b> {new Date(resume.updatedAt).toLocaleDateString()}</div>
                      {resume.content && (
                        <div style={{ background: '#f5f5f5', borderRadius: 8, padding: 16, marginTop: 8 }}>{resume.content}</div>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={{ marginBottom: 16 }}>No resume uploaded.</div>
                )}
                <input
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleResumeUpload}
                  disabled={!canUploadResume}
                />
                <button
                  style={btnPrimary}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading || !canUploadResume}
                  title={canUploadResume ? '' : 'You can only have up to 3 resumes.'}
                >
                  {loading ? 'Uploading...' : 'Upload Resume'}
                </button>
                {!canUploadResume && (
                  <div style={{ color: '#b71c1c', marginTop: 8 }}>You can only have up to 3 resumes.</div>
                )}
              </>
            )}

            {tab === 'services' && (
              <>
                <h3>Your Services</h3>
                <button style={btnPrimary} onClick={() => setShowAddService(s => !s)} disabled={loading}>
                  {showAddService ? 'Close' : 'Add Service'}
                </button>
                {showAddService && (
                  <form onSubmit={handleAddServiceSubmit} style={{ margin: '16px 0', background: '#f5f5f5', padding: 16, borderRadius: 8, maxWidth: 400 }}>
                    <div>
                      <label>Service Name:</label>
                      <input
                        value={newService.serviceName}
                        onChange={e => setNewService(s => ({ ...s, serviceName: e.target.value }))}
                        required
                        style={{ width: '100%', marginBottom: 8 }}
                      />
                    </div>
                    <div>
                      <label>Description:</label>
                      <textarea
                        value={newService.description}
                        onChange={e => setNewService(s => ({ ...s, description: e.target.value }))}
                        required
                        style={{ width: '100%', marginBottom: 8 }}
                      />
                    </div>
                    <div>
                      <label>Price:</label>
                      <input
                        value={newService.price}
                        onChange={e => setNewService(s => ({ ...s, price: e.target.value }))}
                        required
                        type="number"
                        min="0"
                        style={{ width: '100%', marginBottom: 8 }}
                      />
                    </div>
                    <div>
                      <label>Category:</label>
                      <select
                        value={newService.categoryId}
                        onChange={e => setNewService(s => ({ ...s, categoryId: e.target.value }))}
                        required
                        style={{ width: '100%', marginBottom: 8 }}
                      >
                        <option value="">Select category...</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                        ))}
                      </select>
                    </div>
                    <button type="submit" style={btnPrimary} disabled={loading}>Add</button>
                    {serviceError && <div style={{ color: 'red', marginTop: 8 }}>{serviceError}</div>}
                  </form>
                )}
                <div className="cards-grid">
                  {services.length === 0 && <div>No services yet.</div>}
                  {services.map(service => (
                    <InfoCard
                      key={service.id}
                      title={service.serviceName}
                      subtitle={`Price: $${service.price} | Upvotes: ${(service.upvotes ?? 0) - (service.downvotes ?? 0)}`}
                      description={service.description}
                    />
                  ))}
                </div>
              </>
            )}

            {tab === 'notifications' && (
              <>
                <h3>Notifications</h3>
                {notifications.length === 0 ? (
                  <div>No notifications</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} style={{ background: '#f5f5f5', padding: 16, marginBottom: 12, borderRadius: 8 }}>
                      <p>
                        Order <strong>{n.id}</strong> - Status: <strong>{n.status}</strong>
                      </p>
                      {/* Accept/Refuse buttons for service author when order is pending */}
                      {user && user.id === n.authorId && n.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleOrderAction(n.id, 'accept')}
                            style={{ marginRight: 8, padding: '4px 8px', background: '#eaf4fb', color: '#245ea0', borderRadius: 6, border: '1px solid #245ea0' }}
                          >
                            Accept Order
                          </button>
                          <button
                            onClick={() => handleOrderAction(n.id, 'refuse')}
                            style={{ padding: '4px 8px', background: '#ffeaea', color: '#b71c1c', borderRadius: 6, border: '1px solid #b71c1c' }}
                          >
                            Refuse Order
                          </button>
                        </>
                      )}
                      {/* Confirm button for author after accepted */}
                      {user && user.id === n.authorId && !n.authorConfirmed && n.status === 'Accepted' && (
                        <button onClick={() => handleConfirm(n.id, 'author')}
                                style={{ marginRight: 8, padding: '4px 8px' }}>
                          Confirm Order (Author)
                        </button>
                      )}
                      {/* Confirm button for customer after accepted */}
                      {user && user.id === n.customerId && !n.customerConfirmed && n.status === 'Accepted' && (
                        <button onClick={() => handleConfirm(n.id, 'customer')}
                                style={{ padding: '4px 8px' }}>
                          Confirm Order (Customer)
                        </button>
                      )}
                      {/* Only the customer (order placer) can rate the service after completion */}
                      {user && user.id === n.customerId && n.status === 'Finished' && (
                        <button
                          style={{ marginLeft: 8, padding: '4px 8px', background: '#eaf4fb', color: '#245ea0', borderRadius: 6, border: '1px solid #245ea0' }}
                          onClick={() => handleRateService(n.serviceId!)}
                        >
                          Rate Service
                        </button>
                      )}
                    </div>
                  ))
                )}
              </>
            )}

            {tab === 'orders' && (
              <>
                <h3>My Orders</h3>
                {notifications.length === 0 ? (
                  <div>No orders found</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} style={{ background: '#eef', padding: 16, marginBottom: 12, borderRadius: 8 }}>
                      <p>
                        Order <strong>{n.id}</strong> – Status: <strong>{n.status}</strong>
                      </p>
                      {/* You can include similar confirm buttons if needed */}
                    </div>
                  ))
                )}
              </>
            )}

            {tab === 'saved' && (
              <>
                <div style={{ display:'flex', gap:12, marginBottom:16 }}>
                  <button style={savedSubTab==='posts'?btnPrimary:btnStyle} onClick={()=>setSavedSubTab('posts')}>Posts</button>
                  <button style={savedSubTab==='vacancies'?btnPrimary:btnStyle} onClick={()=>setSavedSubTab('vacancies')}>Vacancies</button>
                  <button style={savedSubTab==='services'?btnPrimary:btnStyle} onClick={()=>setSavedSubTab('services')}>Services</button>
                </div>
                {savedSubTab==='posts' && (
                  savedPosts.length===0 
                    ? <div>No saved posts.</div>
                    : savedPosts.map(p => (
                        <div key={p.id} onClick={()=>navigate(`/posts/${p.id}`)} style={{border:'1px solid #245ea0',borderRadius:8,padding:12,marginBottom:12,cursor:'pointer'}}>
                          <h4>{p.title}</h4><p>{p.content.slice(0,100)}…</p>
                        </div>
                      ))
                )}
                {savedSubTab==='vacancies' && (
                  savedVacancies.length===0
                    ? <div>No saved vacancies.</div>
                    : savedVacancies.map(j => (
                        <div key={j.id} onClick={()=>navigate(`/vacancies/${j.id}`)} style={{border:'1px solid #28a745',borderRadius:8,padding:12,marginBottom:12,cursor:'pointer'}}>
                          <h4>{j.title}</h4><p>{j.location} • ${j.salary}</p>
                        </div>
                      ))
                )}
                {savedSubTab==='services' && (
                  savedServices.length===0
                    ? <div>No saved services.</div>
                    : savedServices.map(s => (
                        <div key={s.id} onClick={()=>navigate(`/services/${s.id}`)} style={{border:'1px solid #ff8c00',borderRadius:8,padding:12,marginBottom:12,cursor:'pointer'}}>
                          <h4>{s.title}</h4><p>{s.content.slice(0,100)}…</p>
                        </div>
                      ))
                )}
              </>
            )}

            {/* New organizations tab */}
            {tab === 'organizations' && (
              <div className="organizations-section">
                <h3>My Organizations</h3>
                <button 
                  className="create-button"
                  onClick={() => setShowCreateOrg(!showCreateOrg)}
                >
                  {showCreateOrg ? 'Cancel' : 'Create Organization'}
                </button>

                {showCreateOrg && (
                  <form className="create-org-form" onSubmit={handleCreateOrg}>
                    <div className="form-group">
                      <label>Organization Name</label>
                      <input 
                        type="text" 
                        value={newOrg.name}
                        onChange={e => setNewOrg({...newOrg, name: e.target.value})}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={newOrg.description}
                        onChange={e => setNewOrg({...newOrg, description: e.target.value})}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Industry</label>
                      <input 
                        type="text" 
                        value={newOrg.industry}
                        onChange={e => setNewOrg({...newOrg, industry: e.target.value})}
                      />
                    </div>

                    <div className="form-group">
                      <label>Website</label>
                      <input 
                        type="url" 
                        value={newOrg.website}
                        onChange={e => setNewOrg({...newOrg, website: e.target.value})}
                      />
                    </div>

                    <div className="form-group">
                      <label>Address</label>
                      <input 
                        type="text" 
                        value={newOrg.address}
                        onChange={e => setNewOrg({...newOrg, address: e.target.value})}
                      />
                    </div>

                    <div className="form-group">
                      <label>Logo URL</label>
                      <input 
                        type="url" 
                        value={newOrg.logoUrl}
                        onChange={e => setNewOrg({...newOrg, logoUrl: e.target.value})}
                      />
                    </div>

                    <button type="submit" className="submit-button">Create Organization</button>
                  </form>
                )}

                {organizations.length === 0 ? (
                  <p>You are not a member of any organization. Create one to get started.</p>
                ) : (
                  <div className="org-list">
                    {organizations.map(org => (
                      <div key={org.id} className="org-card">
                        <h4>{org.name}</h4>
                        <p>{org.description}</p>
                        <div className="org-details">
                          <div><strong>Industry:</strong> {org.industry}</div>
                          {org.website && (
                            <div><strong>Website:</strong> <a href={org.website} target="_blank" rel="noopener noreferrer">{org.website}</a></div>
                          )}
                        </div>
                        <button 
                          className="switch-button"
                          onClick={() => switchViewMode('business', org)}
                        >
                          Switch to Business View
                        </button>
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
            <>
              <div className="org-header">
                <h3>{activeOrg.name}</h3>
                <p>{activeOrg.industry}</p>
              </div>

              <div className="profile-tabs">
                <button className={tab === 'info' ? 'active' : ''} onClick={() => setTab('info')}>Info</button>
                <button className={tab === 'services' ? 'active' : ''} onClick={() => setTab('services')}>Services</button>
                <button className={tab === 'vacancies' ? 'active' : ''} onClick={() => setTab('vacancies')}>Vacancies</button>
                <button className={tab === 'members' ? 'active' : ''} onClick={() => setTab('members')}>Members</button>
                <button className={tab === 'blog' ? 'active' : ''} onClick={() => setTab('blog')}>Blog</button>
              </div>

              <div className="profile-content">
                {tab === 'info' && (
                  <div className="info-section">
                    <h3>Organization Details</h3>
                    <div><strong>Name:</strong> {activeOrg.name}</div>
                    <div><strong>Description:</strong> {activeOrg.description}</div>
                    <div><strong>Industry:</strong> {activeOrg.industry}</div>
                    {activeOrg.website && (
                      <div><strong>Website:</strong> <a href={activeOrg.website} target="_blank" rel="noopener noreferrer">{activeOrg.website}</a></div>
                    )}
                    <div><strong>Address:</strong> {activeOrg.address}</div>
                    <div><strong>Created:</strong> {new Date(activeOrg.createdAt).toLocaleDateString()}</div>
                  </div>
                )}

                {tab === 'services' && (
                  <OrganizationServices orgId={activeOrg.id} token={token} />
                )}

                {tab === 'vacancies' && (
                  <OrganizationVacancies orgId={activeOrg.id} token={token} />
                )}

                {tab === 'members' && (
                  <OrganizationMembers orgId={activeOrg.id} token={token} />
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

// New BlogStrip component for user-specific blog posts
function BlogStrip({ userId }: { userId?: string }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    fetch(`${API_BASE_URL}/BlogPost?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => {
        setPosts([]);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div>Loading posts...</div>;

  return (
    <div className="blog-strip">
      {posts.length === 0 ? (
        <p>No blog posts yet.</p>
      ) : (
        posts.map((post: any) => (
          <div key={post.id} className="blog-post-card">
            <h4>{post.title}</h4>
            <p>{post.content.substring(0, 150)}...</p>
            <a href={`/posts/${post.id}`}>Read more</a>
          </div>
        ))
      )}
    </div>
  );
}

// Organization Services sub-component
function OrganizationServices({ orgId, token }: { orgId: string, token: string | null }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orgId || !token) return;

    setLoading(true);
    fetch(`${API_BASE_URL}/services?organizationId=${orgId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(() => {
        setServices([]);
        setLoading(false);
      });
  }, [orgId, token]);

  if (loading) return <div>Loading services...</div>;

  return (
    <div className="services-section">
      <h3>Organization Services</h3>
      <a href="/createService" className="create-button">Add New Service</a>

      {services.length === 0 ? (
        <p>No services yet. Add a service to get started.</p>
      ) : (
        <div className="services-grid">
          {services.map((service: any) => (
            <InfoCard
              key={service.id}
              title={service.serviceName}
              subtitle={`Price: $${service.price}`}
              description={service.description}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Organization Vacancies sub-component
function OrganizationVacancies({ orgId, token }: { orgId: string, token: string | null }) {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orgId || !token) return;

    setLoading(true);
    fetch(`${API_BASE_URL}/jobs?organizationId=${orgId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setVacancies(data);
        setLoading(false);
      })
      .catch(() => {
        setVacancies([]);
        setLoading(false);
      });
  }, [orgId, token]);

  if (loading) return <div>Loading vacancies...</div>;

  return (
    <div className="vacancies-section">
      <h3>Organization Vacancies</h3>
      <a href="/createVacancy" className="create-button">Add New Vacancy</a>

      {vacancies.length === 0 ? (
        <p>No vacancies yet. Add a vacancy to get started.</p>
      ) : (
        <div className="vacancies-grid">
          {vacancies.map((vacancy: any) => (
            <InfoCard
              key={vacancy.id}
              title={vacancy.title}
              subtitle={`Salary: $${vacancy.salary} | Location: ${vacancy.location}`}
              description={vacancy.description}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Organization Members sub-component
function OrganizationMembers({ orgId, token }: { orgId: string, token: string | null }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orgId || !token) return;

    setLoading(true);
    fetch(`${API_BASE_URL}/organization/${orgId}/members`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setMembers(data);
        setLoading(false);
      })
      .catch(() => {
        setMembers([]);
        setLoading(false);
      });
  }, [orgId, token]);

  if (loading) return <div>Loading members...</div>;

  return (
    <div className="members-section">
      <h3>Organization Members</h3>
      <button className="create-button">Add Member</button>

      {members.length === 0 ? (
        <p>No members yet.</p>
      ) : (
        <div className="members-list">
          {members.map((member: any) => (
            <div key={member.userId} className="member-card">
              <div className="member-avatar">
                <img src={`https://i.pravatar.cc/40?u=${member.userId}`} alt="Avatar" />
              </div>
              <div className="member-info">
                <h4>{member.userName}</h4>
                <p className="member-role">{member.role}</p>
                <p className="member-since">Member since {new Date(member.joinedAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserProfile;
