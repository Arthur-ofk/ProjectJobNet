import React, { useEffect, useState, useRef } from 'react';
import { API_BASE_URL } from '../constants.ts';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store.ts';
import InfoCard from '../components/InfoCard.tsx';
import { logout } from '../slices/authSlice.ts';

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
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [tab, setTab] = useState<'info' | 'resumes' | 'services' | 'notifications' | 'orders'>('info');
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
  const [notifications, setNotifications] = useState<any[]>([]);
  const dispatch = useDispatch();

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
      .then(res => res.json())
      .then(data => {
        setServices(data.filter((s: Service) => s.userId === user.id));
      })
      .catch(() => setServices([]));
    // Fetch blog posts
    fetch(`${API_BASE_URL}/posts`)
      .then(res => res.json())
      .then(data => {
        setBlogPosts(data.filter((p: BlogPost) => p.userId === user.id));
      });
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
    // Fetch notifications
    fetch(`${API_BASE_URL}/order/notifications/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setNotifications(data));
  }, [user, token]);

  useEffect(() => {
    fetchNotifications();
    // Poll for updates if on notifications tab
    if (tab === 'notifications') {
      const interval = setInterval(fetchNotifications, POLL_INTERVAL);
      return () => clearInterval(interval);
    }
  // eslint-disable-next-line
  }, [user, token, tab]);

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
      fetchNotifications(); // Refresh immediately after confirming
    } else {
      setOrderActionStatus('Failed to confirm order.');
    }
  };

  // Optionally, handle rating after order is finished
  const handleRateService = (serviceId: string) => {
    // Redirect to rating/review page or open modal
    window.location.href = `/services/${serviceId}`; // or open a modal for rating
  };

  const fetchNotifications = () => {
    if (user && token) {
      fetch(`${API_BASE_URL}/order/notifications/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setNotifications(data));
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
    <div style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 4px 16px rgba(36,94,160,0.08)', maxWidth: 900, margin: '0 auto' }}>
      <h2>Your Profile</h2>
      <button
        style={{
          float: 'right',
          borderRadius: 8,
          padding: '6px 18px',
          background: '#ffeaea',
          color: '#b71c1c',
          border: '1px solid #b71c1c',
          fontWeight: 600,
          fontSize: '1rem',
          cursor: 'pointer'
        }}
        onClick={handleLogout}
      >
        Logout
      </button>
      <div style={{ marginBottom: 24 }}>
        <button style={tab === 'info' ? btnPrimary : btnStyle} onClick={() => setTab('info')}>Info</button>
        <button style={tab === 'resumes' ? btnPrimary : btnStyle} onClick={() => setTab('resumes')}>Resumes</button>
        <button style={tab === 'services' ? btnPrimary : btnStyle} onClick={() => setTab('services')}>Services</button>
        <button style={tab === 'notifications' ? btnPrimary : btnStyle} onClick={() => setTab('notifications')}>Notifications</button>
        <button style={tab === 'orders' ? btnPrimary : btnStyle} onClick={() => setTab('orders')}>My Orders</button>
      </div>

      {tab === 'info' && (
        <>
          <div style={{ marginBottom: 16 }}>
            <b>Username:</b> {user.userName}<br />
            <b>Name:</b> {user.firstName} {user.lastName}<br />
            <b>Email:</b> {user.email}<br />
            <b>Address:</b> {user.address}<br />
            <b>Phone:</b> {user.phoneNumber}<br />
            <b>Date of Birth:</b> {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : ''}<br />
            <b>Rating:</b> {rating !== null ? rating.toFixed(2) : 'No reviews yet'}
            <button style={btnStyle} onClick={() => setShowSettings(s => !s)}>
              {showSettings ? 'Close Settings' : 'Edit Info'}
            </button>
          </div>
          {showSettings && (
            <form /* ...settings form as before... */>
              {/* ...settings form fields... */}
            </form>
          )}
          <h3 style={{ marginTop: 32 }}>Your Blog Posts</h3>
          {/* ...blog posts section as before... */}
        </>
      )}

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
                    onClick={() => handleRateService(n.serviceId)}
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
    </div>
  );
}

export default UserProfile;
