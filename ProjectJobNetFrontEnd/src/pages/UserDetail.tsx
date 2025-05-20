import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store.ts';
import { API_BASE_URL } from '../constants.ts';
import InfoCard from '../components/InfoCard.tsx';
import './UserDetail.css';

type User = {
  id: string;
  userName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  phoneNumber?: string;
};

type Review = {
  targetId: string | undefined;
  id: string;
  rating: number;
  reviewText: string;
  createdAt: string;
};

type Organization = {
  id: string;
  name: string;
  description: string;
  industry: string;
};

function UserDetail() {
  const { id } = useParams<{id:string}>();
  const { token } = useSelector((state: RootState) => state.auth);
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'blog'|'services'>('blog');
  const [services, setServices] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [profileImageData, setProfileImageData] = useState<string | null>(null);
  const [profileImageContentType, setProfileImageContentType] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/users/${id}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        // Store the profile image data if available
        if (data.profileImageData) {
          setProfileImageData(data.profileImageData);
          setProfileImageContentType(data.profileImageContentType);
        }
      });
    fetch(`${API_BASE_URL}/review`)
      .then(res => res.json())
      .then(data => {
        setReviews(data.filter((r: Review) => r.targetId === id));
        setLoading(false);
      });
      
    // Load blog posts for this user initially
    fetchUserPosts();
    
    // Always fetch organizations for the user info section
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
      
    fetch(`${API_BASE_URL}/organization/user/${id}`, { headers })
      .then(r => r.ok ? r.json() : [])
      .then(setOrganizations)
      .catch(err => {
        console.error("Error loading organizations:", err);
        setOrganizations([]);
      });
  }, [id, token]);

  useEffect(() => {
    if (tab === 'services') {
      fetch(`${API_BASE_URL}/services`)
        .then(r => r.json())
        .then((all: any[]) => setServices(all.filter(s => s.userId === id)))
        .catch(() => setServices([]));
    }
  }, [tab, id]);

  // Specific function to fetch user's blog posts
  const fetchUserPosts = () => {
    fetch(`${API_BASE_URL}/BlogPost?userId=${id}`)
      .then(r => r.json())
      .then((posts: any[]) => setPosts(posts))
      .catch(() => setPosts([]));
  };

  useEffect(() => {
    if (id) {
      fetch(`${API_BASE_URL}/BlogPost/user/${id}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          const userPosts = Array.isArray(data) 
            ? data.filter(post => post.userId === id)
            : data ? [data] : [];
          setPosts(userPosts);
        })
        .catch(error => {
          console.error('Error fetching user posts:', error);
          setPosts([]);
        });
    }
  }, [id]);

  if (loading || !user) return <div>Loading...</div>;

  // Generate image source URL from either the database image or fallback avatar
  const profileImageSrc = profileImageData 
    ? `data:${profileImageContentType || 'image/jpeg'};base64,${profileImageData}`
    : `https://i.pravatar.cc/120?u=${id}`;

  return (
    <div className="user-detail-container">
      {/* User header with primary info - always visible */}
      <div className="user-header">
        <img src={profileImageSrc} alt="avatar" className="user-avatar" />
        <div className="user-header-info">
          <h2 className="user-name">{user.userName}</h2>
          <p className="user-fullname">{user.firstName} {user.lastName}</p>
          <p className="user-email">{user.email}</p>
        </div>
      </div>
      
      {/* User information section - always visible like in UserProfile */}
      <div className="user-info-section">
        <h3>User Information</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Name:</span>
            <span className="detail-value">{user.firstName} {user.lastName}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{user.email}</span>
          </div>
          {user.phoneNumber && (
            <div className="detail-item">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{user.phoneNumber}</span>
            </div>
          )}
          {user.address && (
            <div className="detail-item">
              <span className="detail-label">Address:</span>
              <span className="detail-value">{user.address}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Organization Memberships Section - always visible if present */}
      {organizations.length > 0 && (
        <div className="user-organizations">
          <h3>Organization Memberships</h3>
          <div className="organization-cards">
            {organizations.map(org => (
              <Link 
                to={`/organizations/${org.id}`} 
                key={org.id} 
                className="organization-link-card"
              >
                <div className="organization-card">
                  <h4>{org.name}</h4>
                  <p>{org.industry}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Reviews section - always visible like in UserProfile */}
      {reviews.length > 0 && (
        <div className="reviews-section">
          <h3>Reviews</h3>
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="review-stars">
                    {Array.from({length: review.rating}, (_, i) => (
                      <span key={i} className="star">★</span>
                    ))}
                  </div>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="review-text">{review.reviewText}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Tabs - Blog is default now, and About is removed */}
      <div className="user-tabs">
        {(['blog','services'] as const).map(t => (
          <button
            key={t}
            className={tab === t ? 'active' : ''}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="user-tab-content">
        {tab === 'blog' && (
          <div className="blog-tab-section">
            <h3>Blog Posts</h3>
            <div className="blog-grid">
              {posts.length === 0 ? (
                <p>No blog posts yet.</p>
              ) : (
                posts.map(post => (
                  <div key={post.id} className="blog-card" onClick={() => window.location.href = `/posts/${post.id}`}>
                    {post.imageData && (
                      <div className="blog-card-image">
                        <img 
                          src={`data:${post.imageContentType || 'image/jpeg'};base64,${post.imageData}`}
                          alt={post.title}
                        />
                      </div>
                    )}
                    <div className="blog-card-content">
                      <h4>{post.title}</h4>
                      <p>{post.content.substring(0, 100)}...</p>
                      <Link to={`/posts/${post.id}`} onClick={e => e.stopPropagation()}>Read more</Link>
                      <span className="blog-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        {tab === 'services' && (
          <div className="services-section">
            <h3>Services</h3>
            <div className="cards-grid">
              {services.length === 0 ? (
                <p>No services offered.</p>
              ) : (
                services.map(s => (
                  <Link to={`/services/${s.id}`} key={s.id} style={{ textDecoration: 'none' }}>
                    <InfoCard
                      title={s.serviceName}
                      subtitle={`Price $${s.price}`}
                      description={s.description}
                    />
                  </Link>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDetail;
