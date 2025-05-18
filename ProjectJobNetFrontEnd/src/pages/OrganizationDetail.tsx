import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../constants.ts';
import { RootState } from '../store.ts';
import './OrganizationDetail.css';

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

type Member = {
  userId: string;
  userName: string;
  role: string;
  joinedAt: string;
};

type Service = {
  id: string;
  serviceName: string;
  description: string;
  price: number;
};

type Job = {
  id: string;
  title: string;
  description: string;
  salary: number;
  location: string;
};

// Add BlogPost type
type BlogPost = {
  id: string;
  title: string;
  content: string;
  userId: string;
  imageData?: string;
  imageContentType?: string;
  createdAt: string;
};

function OrganizationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, user } = useSelector((state: RootState) => state.auth);
  
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [tab, setTab] = useState<'info' | 'members' | 'services' | 'jobs' | 'posts'>('info');
  
  // Add state for blog posts
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [postImage, setPostImage] = useState<File | null>(null);
  
  // Load organization data
  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    fetch(`${API_BASE_URL}/organization/${id}`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch organization');
        return response.json();
      })
      .then(data => {
        setOrganization(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading organization:', err);
        setError('Failed to load organization details');
        setLoading(false);
      });
      
    // Load members
    fetch(`${API_BASE_URL}/organization/${id}/members`)
      .then(response => response.ok ? response.json() : [])
      .then(setMembers)
      .catch(() => setMembers([]));
      
    // Load services
    fetch(`${API_BASE_URL}/services?organizationId=${id}`)
      .then(response => response.ok ? response.json() : [])
      .then(setServices)
      .catch(() => setServices([]));
      
    // Load jobs
    fetch(`${API_BASE_URL}/jobs?organizationId=${id}`)
      .then(response => response.ok ? response.json() : [])
      .then(setJobs)
      .catch(() => setJobs([]));
      
    // Check user role if logged in
    if (token && user) {
      fetch(`${API_BASE_URL}/organization/${id}/members`)
        .then(response => response.ok ? response.json() : [])
        .then(data => {
          const member = data.find((m: Member) => m.userId === user.id);
          if (member) setUserRole(member.role);
          else setUserRole(null);
        })
        .catch(() => setUserRole(null));
    }
  }, [id, token, user]);
  
  // Add effect to load organization's blog posts
  useEffect(() => {
    if (id && tab === 'posts') {
      fetch(`${API_BASE_URL}/BlogPost?organizationId=${id}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => setPosts(Array.isArray(data) ? data : []))
        .catch(() => setPosts([]));
    }
  }, [id, tab]);
  
  // Function to post as organization
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user || !id) return;
    
    const formData = new FormData();
    formData.append('Title', newPost.title);
    formData.append('Content', newPost.content);
    formData.append('UserId', user.id);
    formData.append('OrganizationId', id);
    formData.append('Tags', newPost.tags);
    
    if (postImage) {
      formData.append('Image', postImage);
    }
    
    try {
      const res = await fetch(`${API_BASE_URL}/BlogPost`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      
      if (!res.ok) throw new Error('Failed to create post');
      
      // Refresh posts
      const updatedPosts = await fetch(`${API_BASE_URL}/BlogPost?organizationId=${id}`).then(r => r.json());
      setPosts(updatedPosts);
      
      // Reset form
      setNewPost({ title: '', content: '', tags: '' });
      setPostImage(null);
      setShowPostForm(false);
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };
  
  const canEdit = userRole === 'Owner' || userRole === 'Admin';
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!organization) return <div>Organization not found</div>;
  
  return (
    <div className="organization-detail">
      <div className="org-header">
        {organization.logoUrl && (
          <div className="org-logo">
            <img src={organization.logoUrl} alt={organization.name} />
          </div>
        )}
        <div className="org-title">
          <h2>{organization.name}</h2>
          <p className="org-industry">{organization.industry}</p>
        </div>
        {canEdit && (
          <div className="org-actions">
            <button onClick={() => navigate(`/organizations/${id}/edit`)} className="edit-button">
              Edit Organization
            </button>
          </div>
        )}
      </div>
      
      <div className="org-tabs">
        <button 
          className={tab === 'info' ? 'active' : ''}
          onClick={() => setTab('info')}
        >
          Information
        </button>
        <button 
          className={tab === 'members' ? 'active' : ''}
          onClick={() => setTab('members')}
        >
          Members ({members.length})
        </button>
        <button 
          className={tab === 'services' ? 'active' : ''}
          onClick={() => setTab('services')}
        >
          Services ({services.length})
        </button>
        <button 
          className={tab === 'jobs' ? 'active' : ''}
          onClick={() => setTab('jobs')}
        >
          Jobs ({jobs.length})
        </button>
        <button 
          className={tab === 'posts' ? 'active' : ''}
          onClick={() => setTab('posts')}
        >
          Blog Posts ({posts.length})
        </button>
      </div>
      
      <div className="org-tab-content">
        {tab === 'info' && (
          <div className="org-info">
            <h3>About</h3>
            <p>{organization.description}</p>
            
            <div className="org-details">
              {organization.website && (
                <div className="org-detail">
                  <strong>Website:</strong> 
                  <a href={organization.website} target="_blank" rel="noopener noreferrer">
                    {organization.website}
                  </a>
                </div>
              )}
              {organization.address && (
                <div className="org-detail">
                  <strong>Address:</strong> {organization.address}
                </div>
              )}
              <div className="org-detail">
                <strong>Created:</strong> {new Date(organization.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}
        
        {tab === 'members' && (
          <div className="org-members">
            <h3>Members</h3>
            {canEdit && (
              <button 
                className="invite-button"
                onClick={() => navigate(`/organizations/${id}/invite`)}
              >
                Invite Member
              </button>
            )}
            <div className="members-list">
              {members.length === 0 ? (
                <p>No members found</p>
              ) : (
                members.map(member => (
                  <div key={member.userId} className="member-card">
                    <div className="member-avatar">
                      <img src={`https://i.pravatar.cc/40?u=${member.userId}`} alt={member.userName} />
                    </div>
                    <div className="member-info">
                      <h4>{member.userName}</h4>
                      <p className="member-role">{member.role}</p>
                      <p className="member-since">Joined {new Date(member.joinedAt).toLocaleDateString()}</p>
                    </div>
                    {canEdit && userRole === 'Owner' && member.role !== 'Owner' && (
                      <div className="member-actions">
                        <select 
                          value={member.role}
                          onChange={e => {
                            fetch(`${API_BASE_URL}/organization/${id}/members/${member.userId}/role`, {
                              method: 'PUT',
                              headers: { 
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}` 
                              },
                              body: JSON.stringify(e.target.value)
                            })
                              .then(() => {
                                // Update local state with new role
                                setMembers(prev => 
                                  prev.map(m => m.userId === member.userId ? 
                                    {...m, role: e.target.value} : m)
                                );
                              })
                              .catch(console.error);
                          }}
                        >
                          <option value="Member">Member</option>
                          <option value="Admin">Admin</option>
                        </select>
                        <button 
                          className="remove-button"
                          onClick={() => {
                            if (window.confirm(`Remove ${member.userName} from the organization?`)) {
                              fetch(`${API_BASE_URL}/organization/${id}/members/${member.userId}`, {
                                method: 'DELETE',
                                headers: { 'Authorization': `Bearer ${token}` }
                              })
                                .then(() => {
                                  // Remove from local state
                                  setMembers(prev => prev.filter(m => m.userId !== member.userId));
                                })
                                .catch(console.error);
                            }
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        {tab === 'services' && (
          <div className="org-services">
            <h3>Services</h3>
            {canEdit && (
              <button 
                className="add-button"
                onClick={() => navigate(`/organizations/${id}/services/new`)}
              >
                Add Service
              </button>
            )}
            <div className="services-grid">
              {services.length === 0 ? (
                <p>No services found</p>
              ) : (
                services.map(service => (
                  <div key={service.id} className="service-card" onClick={() => navigate(`/services/${service.id}`)}>
                    <h4>{service.serviceName}</h4>
                    <p>${service.price}</p>
                    <p>{service.description?.substring(0, 100)}...</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        {tab === 'jobs' && (
          <div className="org-jobs">
            <h3>Job Vacancies</h3>
            {canEdit && (
              <button 
                className="add-button"
                onClick={() => navigate(`/organizations/${id}/jobs/new`)}
              >
                Post New Vacancy
              </button>
            )}
            <div className="jobs-grid">
              {jobs.length === 0 ? (
                <p>No job vacancies found</p>
              ) : (
                jobs.map(job => (
                  <div key={job.id} className="job-card" onClick={() => navigate(`/vacancies/${job.id}`)}>
                    <h4>{job.title}</h4>
                    <div className="job-details">
                      <span className="job-salary">${job.salary}</span>
                      <span className="job-location">{job.location}</span>
                    </div>
                    <p>{job.description?.substring(0, 100)}...</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        {/* New Blog Posts Tab */}
        {tab === 'posts' && (
          <div className="org-posts">
            <h3>Blog Posts</h3>
            
            {canEdit && (
              <div>
                <button 
                  className="add-button"
                  onClick={() => setShowPostForm(!showPostForm)}
                >
                  {showPostForm ? 'Cancel' : 'Create New Post'}
                </button>
                
                {showPostForm && (
                  <form className="create-form" onSubmit={handleCreatePost}>
                    <div className="form-group">
                      <label>Title:</label>
                      <input 
                        type="text"
                        value={newPost.title}
                        onChange={e => setNewPost({...newPost, title: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Content:</label>
                      <textarea 
                        value={newPost.content}
                        onChange={e => setNewPost({...newPost, content: e.target.value})}
                        required
                        rows={6}
                      />
                    </div>
                    <div className="form-group">
                      <label>Tags (comma separated):</label>
                      <input 
                        type="text"
                        value={newPost.tags}
                        onChange={e => setNewPost({...newPost, tags: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Image:</label>
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={e => setPostImage(e.target.files?.[0] || null)}
                      />
                    </div>
                    <button type="submit" className="submit-button">Create Post</button>
                  </form>
                )}
              </div>
            )}
            
            <div className="posts-grid">
              {posts.length === 0 ? (
                <p>No blog posts yet.</p>
              ) : (
                posts.map(post => (
                  <div key={post.id} className="blog-card" onClick={() => navigate(`/posts/${post.id}`)}>
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
                      <span className="blog-date">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrganizationDetail;
